---
title: "Sadevesimittarin tuunaus Zigbee-verkkoon sopivaksi"
date: "2023-06-20"
categories: 
  - "homeassistant"
  - "kotiautomaatio"
  - "mqtt"
  - "raingauge"
  - "zigbee"
  - "zigbee2mqtt"
tags: 
  - "433-mhz"
  - "elektroniikka"
  - "homeassistant"
  - "kotiautomaatio"
  - "mqtt"
  - "raingauge"
  - "reed-rele"
  - "sademittari"
  - "tipping-bucket"
  - "utility_meter"
  - "zigbee"
  - "zigbee2mqtt"
---

Seuraavaksi ajattelin kirjoittaa aiheesta, joka liittyy [Home Assistantin](https://www.home-assistant.io/) lisäksi myös hiukan [elektroniikkaan](https://fi.wikipedia.org/wiki/Elektroniikka). Tarkoituksena on tuunata sadevesimittaria sellaiseksi, että se voidaan liittää [Zigbee](https://fi.wikipedia.org/wiki/ZigBee) -verkkoon. Innostuksen tähän sain, kun luin vastaavanlaisesta muutoksesta [Home Assistantin](https://www.home-assistant.io/) keskustelupalstalta, johon linkki [https://community.home-assistant.io/t/diy-zigbee-rain-gauge/255379](https://community.home-assistant.io/t/diy-zigbee-rain-gauge/255379). Pienenä varoituksen sanana myös, että tämän muutostyön yhteydessä tarvitaan [juotoskolvia](https://fi.wikipedia.org/wiki/Juotin).

#### Mitä tarvitaan?

Tarvikkeina tarvitaan jokin sadevesimittari, joka minulla on tällainen [MTX Basic langanton sadevesimittari](https://www.motonet.fi/fi/tuote/8601352/MTX-Basic-langaton-sadevesimittari) (HUOM! ei ole maksettu mainos) sekä [Zigbee](https://fi.wikipedia.org/wiki/ZigBee) -verkkoon liitettävä ovi- ja ikkuna -anturi, kuten esimerkiksi [Aqara](https://www.aqara.com/eu/door_and_window_sensor.html), joka minulla on käytössä. Tämä MTX:n sadevesimittari toimii 433 MHz -verkkoon liitettynä, mutta minulla ei ollut sellaista mökillä käytössä, jonka vuoksi tuunasin tämän mittarin toimimaan [Zigbee](https://fi.wikipedia.org/wiki/ZigBee) -verkossa.

Tämä MTX:n sadevesimittari, kuten myös useat muut markkinoilla olevat mittarit, toimivat siten, että mittarin sisällä on eräänlainen heiluri -kuppi (engl. [tipping bucket](https://en.wikipedia.org/wiki/Rain_gauge#Tipping_bucket_rain_gauge)), joka ohjaa sadevesimittarissa olevaa [reed](https://fi.wikipedia.org/wiki/Rele#Reed-rele) -relettä sitä mukaan, kun kuppi täyttyy vedellä. Eli sademäärän laskenta tapahtuu laskemalla pulsseina [reed](https://fi.wikipedia.org/wiki/Rele#Reed-rele) -releen aukeamista ja sulkeutumista samalla tavalla kuten tapahtuu ovi- ja ikkuna -antureissa eli kun ovi sulkeutuu, rele sulkeutuu ja kun ovi avautuu, niin rele avautuu. Samalla tavalla toimii myös tämä tuunattu sadevesimittari eli lasketaan sen antamaa pulssia ja annetaan [Home Assistantin](https://www.home-assistant.io/) hoitaa sitten muunnos millimetreiksi.

#### Toteutus lyhykäisyydessään

Aluksi avataan sadevesimittari ja poistetaan vanha piirilevy siten, että olemassa olevan [reed](https://fi.wikipedia.org/wiki/Rele#Reed-rele) -releen johdot jäävät näkyville (tässä kuvassa piirilevy on jo poistettu ja johdot liitetty ovi- ja ikkuna -anturiin)

![](/images/sadevesimittarin-tuunaus-zigbee-verkkoon-sopivaksi/kuva1.webp)

_Kuva: Sademittari, josta alkuperäinen piirilevy poistettu_

Seuraavaksi avataan ovi- ja ikkuna -tunnistin ja poistetaan siitä [reed](https://fi.wikipedia.org/wiki/Rele#Reed-rele) -rele juottamalla se irti piirilevyltä sekä juottamalla sadevesimittarin [reed](https://fi.wikipedia.org/wiki/Rele#Reed-rele) -releen johdot tilalle  

![](/images/sadevesimittarin-tuunaus-zigbee-verkkoon-sopivaksi/kuva2.webp)

_Kuva: Sademittarin reed -releen johdot juotettu ovianturin reed -releen tilalle_

Alla vielä kuva valmiista toteutuksesta ennen kuin paketti suljetaan

![](/images/sadevesimittarin-tuunaus-zigbee-verkkoon-sopivaksi/kuva3.webp)

_Kuva: Sademäärä -anturi valmis_

#### Muutokset Home Assistantiin

Lopuksi vielä yhdistetään sadevesimittari [Home Assistantiin](https://www.home-assistant.io/) (ellei jo tehty) eli minä lisään mittarin [Zigbee2MQTT](https://www.zigbee2mqtt.io/) kautta [Home Assistantiin](https://www.home-assistant.io/), jolloin se tulee näkyviin [MQTT](https://mqtt.org/) -liitännäisen kautta. Laitteen olen nimennyt "raingauge" eli sademäärämittari eli minulla laite näkyy nimellä _binary\_sensor.raingauge\_contact_.

Seuraavaksi luodaan [Home Assistantiin](https://www.home-assistant.io/) kaksi uutta sensoria eli lisätään _configuration.yaml_ -tiedostoon alla olevat rivit

```
sensor:
  - platform: history_stats
    name: Raingauge laskuri
    entity_id: binary_sensor.raingauge_contact #ovianturi
    state: 'off'
    type: count
    start: '{{ now().replace(hour=0, minute=0, second=0) }}'
    end: '{{ now() }}'

  - platform: template
    sensors:
      rainfall_today:
        friendly_name: Sademäärä tänään
        unit_of_measurement: mm
        icon_template: mdi:water
        value_template: >-
          {% set count = states('sensor.raingauge_laskuri') | int %}
          {% set mm_per_pulse = 0.330024 %}
          {% set mm = count * mm_per_pulse %}
          {{ mm|round(1, 'floor') }}
```

#### Sademittarin kalibrointi

Sadevesimittarin kalibrointi voidaan tehdä seuraavasti (selitetty myös [keskustelupalstalla](https://community.home-assistant.io/t/diy-zigbee-rain-gauge/255379)) eli aluksi mitataan sadevesimittarin pinta-ala sekä kuinka monta pulssia 10 ml vettä aiheuttaa. Laskelmia alla

- sadevesimittarin koko on 17,2 cm x 9,6 cm

- 1 mm sadetta mittarissa on tällöin 0,1 x 17,2 x 9,6 = 16,512 ml

- 10 ml vettä sademäärämittarissa aiheuttaa 5 pulssi eli 2 ml / pulssi

- tällöin saadaan sademääräksi per pulssi 16,512 / 10 / 5 = 0,33024 mm / pulssi

Eli edellä lasketulla tavalla saadaan laskettua vuorokautista kokonaissademäärää, mutta mikäli halutaan laskea tarkemmin myös esim. tunti-, viikko- jne. kohtaisia sademääriä, täytyy [Home Assistantin](https://www.home-assistant.io/) _configuration.yaml_ -tiedostoon lisätä vielä laskentakaavat näille eli tässä voidaan käyttää [Home Assistantin](https://www.home-assistant.io/integrations/utility_meter/) _utility\_meter_ -integraatiota.

```
utility_meter:
# sademäärä per tunti
  rainfall_hour:
    source: sensor.rainfall_today
    cycle: hourly
# sademäärä per viikko
  rainfall_week:
    source: sensor.rainfall_today
    cycle: weekly
# sademäärä per kuukausi
  rainfall_month:
    source: sensor.rainfall_today
    cycle: monthly
# sademäärä per vuosi
  rainfall_year:
    source: sensor.rainfall_today
    cycle: yearly
```

Lopuksi voidaan vielä lisätä [Home Assistantin](https://www.home-assistant.io/) työpöydälle tiedot sademääristä eli lisätään _entities_ -kortti alla olevan mukaisesti

![](/images/sadevesimittarin-tuunaus-zigbee-verkkoon-sopivaksi/kuva4.webp)

_Kuva: Home Assistantin entities -kortti_

