---
title: "Sähkön kulutuksen seurantaa ESP8266:n, ESPHomen ja Home Assistantin avulla"
date: "2023-03-01"
tags: 
  - "energia"
  - "energiankulutus"
  - "esp8266"
  - "esphome"
  - "homeassistant"
  - "kotiautomaatio"
  - "pulse_meter"
  - "total_daily_energy"
---

Tämä tarina on oikeastaan jatkoa aikaisemmalle jutuille ja liittyy hyvin paljon [Home Assistantiin](https://www.home-assistant.io/), sähkön kulutuksen seurantaan ja myös edellisessä kirjoituksessa olleeseen [ESPHome](#post/esphomen-asennus-paatteen-kautta-linux-kayttojarjestelmaan) -firmikseen.

Minä en ole tullut hankkineeksi mitään valmista mittausanturia, jolla voisin seurata kotini sähkönkulutusta. Olen ratkaissut tämän siten, että olen itse tehnyt tällaisen pulssianturin käyttäen [ESP8266](https://en.wikipedia.org/wiki/ESP8266) -pohjaista mikrokontrolleria, [LM393 Light Sensor](https://www.elektroniikkaosat.com/c-67/p-163360505/Valosensorimoduuli-fotodiodi.html) -valoanturia (ei ole maksettu mainos) sekä firmiksenä [ESPHomea](https://esphome.io/). HUOM! Valoanturin tulee olla malliltaan nimen omaan fotodiodi, eikä LDR -moduuli. Alla olevassa kytkentäkuvassa on LDR -moduuli.

Tämä kombinaatio lukee sähkömittarin pulssia ja muuntaa sen sitten hetkelliseksi- ja vuorokautiseksi kulutukseksi eli [ESPHomessa](https://esphome.io/) on käytössä `pulse_meter`\- ja `total_daily_energy` -komponentit, joiden avulla laskenta tapahtuu. Lisäksi tarvitaan tarvitaan myös tieto omasta sähkömittarista, että kuinka paljon yksi pulssi on watteina, minulla yksi pulssi = yksi watti.

Muut kulutukset kuten tunti-, vuorokausi-, kuukausi- ja vuosikulutukset lasketaan käyttäen [Home Assistantin](https://www.home-assistant.io/) omaa energia -laskentaa. Toki näissä kulutusseurannoissa voisi käyttää myös [Home Assistantin](https://www.home-assistant.io/) `utility_meter` -ominaisuutta, mutta tämä on kuitenkin aika lailla turhaa, koska [Home Assistantin](https://www.home-assistant.io/) oma energia -laskenta hoitaa nämä hyvin ja säilyttää myös historiatiedot pidemmältä ajalta.

#### Valoanturin kytkentä mikrokontrolleri -korttiin

Aluksi siis kytkentään valoanturi mikrokontrolleriin seuraavasti :

![](/images/sahkon-kulutuksen-seurantaa-esp8266-esphomen-ja-home-assistantin-avulla/kuva1.webp)

_Kuva: valoanturin kytkentä_

Eli pinnien kytkentä tapahtuu seuraavasti:

- GND --- GND

- 3V3 --- VCC

- D4 --- D0

#### Firmwaren kääntäminen

Seuraavaksi palataan [edellisen tarinan](#post/esphomen-asennus-paatteen-kautta-linux-kayttojarjestelmaan) asiaan eli käännetään mikrokontrollerille uusi firmware käyttäen [ESPHomea](https://esphome.io/). Tätä varten meidän tarvitsee tehdä asetustiedosto firmistä varten.

Aluksi mennään [ESPHomen](https://esphome.io/) hakemistoon, joka oli luotu `home` -hakemistoon eli annetaan komento

```
cd esphome
```

Seuraavaksi tehdään firmiksen asetustiedosto seuraavalla komennolla

```
nano nodemcu-powerconsumption.yaml
```

Tämän jälkeen kopioidaan tiedostoon seuraavat rivit

```
esphome:
  name: nodemcu-powerconsumption
  platform: ESP8266
  board: nodemcuv2

wifi:
  ssid: "wifi-verkon ssid"
  password: "wifi-verkon salasana"

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "el-sensor Fallback Hotspot"
    password: "tähän jokin salasana"

captive_portal:

# Enable logging
logger:

# Enable Home Assistant API
api:

# Enable OTA updates
ota:

# Enable web-server
web_server:
  port: 80

# Sensorit
sensor:
  - platform: total_daily_energy
    name: "Total Daily Energy" # Vuorokauden kokonaiskulutus
    power_id: power1

  - platform: pulse_meter
    pin: D6
    unit_of_measurement: 'kW'
    name: 'Power Consumption Momentary' # Hetkellinen kulutus per kW
    filters:
      - multiply: 0.06
    id: power1
    
    total:
      unit_of_measurement: 'kWh'
      name: 'Total Consumption' # Kokonaiskulutus
      accuracy_decimals: 3
      filters:
        - multiply: 0.001  # (1/1000 pulses per kWh)
    
  - platform: wifi_signal
    name:  "WiFi Signal strenght" # Wifi-verkon signaalin vahvuus
    update_interval: 60s
 
# Mikrokontrollerin kellonaika, jotta mm. vrk-kulutuksen laskenta onnistuu
time:
  - platform: sntp
    id: sntp_time
    
binary_sensor:
  - platform: gpio
    pin: D4
    device_class: light
    name: 'Pulse Measurement' # Tämä kertoo, että pulssimittaus on päällä
    id: light_detect
    filters:
      - delayed_off: 60ms

text_sensor:
  - platform: wifi_info
    ip_address:
      name: 'IP-address' # Mikrokontrollerin IP-osoite
    ssid:
      name: 'SSID' # Mikrokontrollerin wifi-verkko, johon se on yhdistetty
```

Osa näistä sensoreista, kuten _wifi-verkon signaalin vahvuus, mikrokontrollerin IP-osoite tai wifi-verkko_, ovat sellaisia, että niitä ei välttämättä tarvitse, mutta minulle ne ovat vähän kuin "_nice to know_" -tietoa.

Tämän jälkeen, kun asetukset ovat kunnossa, pitää mikrokontrolleri -kortti yhdistää tietokoneeseen USB-kaapelilla. Seuraavaksi voidaan sitten antaa komento `esphome run nodemcu-powerconsumption.yaml`, joka aluksi kääntää firmiksen ja sen jälkeen lataa sen mikrokontrolleri -kortille. Annetaan kuitenkin aluksi nämä käskyt erillisenä, jolloin ne ovat seuraavat

```
esphome compile nodemcu-powerconsumption.yaml
esphome upload nodemcu-powerconsumption.yaml
```

Eli ensimmäisenä käännetään firmis `compile` -käskyllä ja tässä menee hetki aikaa riippuen tietokoneen nopeudesta. Kun kääntäminen on valmis, niin seuraavaksi annetaan käsky `upload`, joka lataa käännetyn firmiksen mikrokontrollerille. Minulla tuli tässä yhteydessä alla oleva näkymä

![](/images/sahkon-kulutuksen-seurantaa-esp8266-esphomen-ja-home-assistantin-avulla/kuva2.webp)

_Kuva: firmwaren lataus mikrokontrollerille_

Eli tässä vaiheessa, kun käännetään firmistä ensimmäisen kerran, ladataan se USB-väylän kautta, eli valitaan nro 1. Tämän jälkeen, kun firmis on ladattu kortille, voidaan kortti irrottaa USB-väylästä ja laittaa se sähkömittarin yhteyteen pulssia lukemaan.

#### Laitteen yhdistäminen Home Assistantiin

Lopuksi mennään vielä [Home Assistantin](https://www.home-assistant.io/) puolelle, joka yleensä löytää nämä [ESPHome](https://esphome.io) -laitteet automaattisesti, kuten minulla

![](/images/sahkon-kulutuksen-seurantaa-esp8266-esphomen-ja-home-assistantin-avulla/kuva3.webp)

_Kuva: Home Assistant löytää ESPHome-laitteen_

Viimeisenä vielä yhdistetään `Total Daily Energy` -sensori [Home Assistantin](https://www.home-assistant.io/) energia -osioon, kuten alla

![](/images/sahkon-kulutuksen-seurantaa-esp8266-esphomen-ja-home-assistantin-avulla/kuva4.webp)

_Kuva: Home Assistantin energia -osio_

