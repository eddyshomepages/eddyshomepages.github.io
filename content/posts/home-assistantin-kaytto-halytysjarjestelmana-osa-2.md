---
title: "Home Assistantin käyttö hälytysjärjestelmänä, osa 2"
date: "2023-03-31"
categories: 
  - "esphome"
  - "hacs"
  - "halytysjarjestelma"
  - "homeassistant"
  - "kotiautomaatio"
  - "rfid"
tags: 
  - "alarmo"
  - "esp8266"
  - "esphome"
  - "halytysjarjestelma"
  - "homeassistant"
  - "joy-it-rfid-rc522"
  - "kotiautomaatio"
  - "rfid"
  - "wemos-d1-mini"
---

Seuraavaksi ajatteli jatkaa tarinaa [Home Assistantin](/posts/home-assistantin-kaytto-halytysjarjestelmana-osa-1/) käytöstä hälytysjärjestelmänä. Tässä tarinassa käyn läpi RFID-lukijan tekemisen ja liittämisen [Home Assistantiin](https://www.home-assistant.io/) siten, että RFID- tagilla tai -kortilla voi laittaa hälyt päälle ja ottaa ne pois päältä.

Materiaalina tarvitaan RFID-lukija, RFID -tagi sekä jokin ESP8266 -mikrokontrolleri. Minulla on RFID -lukijana [joy-it RFID-RC522](https://joy-it.net/en/products/SBC-RFID-RC522) -lukija ja mikrokontrollerina [Wemos D1 Mini](https://www.wemos.cc/en/latest/d1/d1_mini.html) lähinnä sen pienuuden vuoksi. Mikrokontrollerissa käytän firmiksenä [ESPHome](https://esphome.io/) -firmwarea, koska se on hyvin yhteensopiva [Home Assistantin](https://www.home-assistant.io/) kanssa.

#### RFID -lukijan rakentaminen

Aluksi aloitetaan RFID -lukijan rakentaminen kytkemällä RFID -lukija mikrokontrolleriin seuraavasti:

![](/images/home-assistantin-kaytto-halytysjarjestelmana-osa-2/kuva1.webp)

_Kuva: RFID -lukijan kytkentä, kuva luotu käyttäen Fritzing -sovellusta_

Eli pinnien osalta kytkentä on alla olevan mukainen:

| **RFID-RC522** (joy-it:in lukijan pinnijärjestys) | **WEMOS D1 MINI** |
| --- | --- |
| GND | GND |
| VCC | 3V3 |
| NSS | D8 (GPIO15) |
| SCK | D5 (GPIO14) |
| MOSI | D7 (GPIO13) |
| MISO | D6 (GPIO12) |
| RST | RST |

_Taulukko: Pinnien kytkentä_

Seuraavaksi muokataan [ESPHome](https://esphome.io/) -asetustiedostoa sopivaksi eli mennään [ESPHomen](https://esphome.io/) hakemistoon, joka luotiin asennuksen yhteydessä `home` -hakemistoon eli annetaan komento

```
cd esphome
```

Seuraavaksi tehdään firmiksen asetustiedosto seuraavalla komennolla

```
nano nodemcu-rfid.yaml
```

Tämän jälkeen kopioidaan tiedostoon seuraavat rivit

```
esphome:
  name: nodemcu-rfid
  platform: ESP8266
  board: d1_mini

wifi:
  ssid: "tähän wifi-verkon ssid"
  password: "tähän wifi-verkon salasana"

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "rfid Fallback Hotspot"
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

spi:
  clk_pin: GPIO14
  miso_pin: GPIO12
  mosi_pin: GPIO13

rc522_spi:
  cs_pin: GPIO15
  update_interval: 1s

# Alla oleva asetus lisää tagin automaattisesti Home Assistantiin, kun lukija lukee tagin
  on_tag:
    then:
      - homeassistant.tag_scanned: !lambda 'return x;'

# Sensorit
text_sensor:
  - platform: wifi_info
    ip_address:
      name: 'IP-address' # Mikrokontrollerin IP-osoite
    ssid:
      name: 'SSID' # Mikrokontrollerin wifi-verkko, johon se on yhdistetty
```

Kun asetukset ovat kunnossa, edetään samaan tapaan kuin tehtiin aikaisemmassa [tarinassa](https://fasted.dy.fi/index.php/2023/03/sahkon-kulutuksen-seurantaa-esp8266-esphomen-ja-home-assistantin-avulla/), jossa luotiin pulssianturi laskemaan sähkömittarin pulsseja. Eli yhdistetään mikrokontrolleri-kortti USB-kaapelilla tietokoneeseen ja annetaan alla olevat käskyt

```
esphome compile nodemcu-rfid.yaml
esphome upload nodemcu-rfid.yaml
```

Ensimmäisenä käännetään firmis `compile` -käskyllä ja tässä menee hetki aikaa riippuen tietokoneen nopeudesta. Kun kääntäminen on valmis, niin seuraavaksi annetaan käsky `upload`, joka lataa käännetyn firmiksen mikrokontrollerille. Kun firmistä ladataan mikrokontrolleriin, niin valitaan se vaihtoehto, jolla firmis ladataan USB-väylän kautta.

#### Yhdistäminen Home Assistantiin

Seuraavaksi voidaan yhdistää tagi [Home Assistantiin](https://www.home-assistant.io/) eli luetaan tagi lukijalla, jonka se pitäisi ilmestyä [Home Assistantiin](https://www.home-assistant.io/) näkyviin asetuksien alle kohtaan "Merkinnät" (kts. kuva alla)

![](/images/home-assistantin-kaytto-halytysjarjestelmana-osa-2/kuva2.webp)

_Kuva: Home Assistant, Asetukset - Merkinnät_

Luetut tagit näkyvät luettelossa ja avatessa tagin tiedot, ne näkyvät alla olevan mukaisesti (tiedoista poistettu tagin tunniste ja QR-koodi)

![](/images/home-assistantin-kaytto-halytysjarjestelmana-osa-2/kuva3.webp)

_Kuva: Tagin tiedot_

#### Automaatioiden luominen

Seuraavaksi luodaan tagille automaatio eli painetaan tagin rivillä tätä "robotin pää" -kuvaketta

![](/images/home-assistantin-kaytto-halytysjarjestelmana-osa-2/kuva4.webp)

_Kuva: Automaation lisääminen tagille_

Ensimmäisenä lisätään automaatio, joka kytkee hälytykset päälle, kun tagi skannataan. Eli alla oleva automaatio tarkastaa aluksi ehdon, että hälyt eivät ole päällä ja mikäli tämä ehto toteutuu, niin automaatio laittaa ne päälle. Kuvassa näkyvä koodi asetetaan [Alarmon](https://github.com/nielsfaber/alarmo) asetuksista, kun luodaan käyttäjä, jolle tagi kohdistetaan.

![](/images/home-assistantin-kaytto-halytysjarjestelmana-osa-2/kuva5.webp)

_Kuva: Hälyt päälle, kun tagi skannataan_

Lopuksi luodaan vielä toinen automaatio, jolla hälyt otetaan pois päältä. Eli tässä automaatio tarkistaa aluksi, että hälyt ovat päällä ja mikäli tämä ehto täyttyy, niin automaatio ottaa ne pois päältä.

![](/images/home-assistantin-kaytto-halytysjarjestelmana-osa-2/kuva6.webp)

_Kuva: Hälyt pois päältä, kun tagi skannataan_

Eli nyt meillä on luotuna [Home Assistantin](https://www.home-assistant.io/) hälytysjärjestelmään lukija, joka lukee tagin ja laittaa sen perusteella hälytykset päälle tai pois päältä.

Seuraavaksi tätä [Home Assistantin](https://www.home-assistant.io/) avulla tehtyä hälytysjärjestelmää voidaan laajentaa esim. kameroilla, jotka voidaan laittaa ottamaan kuvia tai videoita, kun hälyt ovat lauenneet ja lähettämään ne esim. sähköpostiin, [Telegram](https://telegram.org/) -sovellukseen tai [Signal](https://signal.org/) -sovellukseen. Vaihtoehtoja siis löytyy mitä vain keksii tehdä.

