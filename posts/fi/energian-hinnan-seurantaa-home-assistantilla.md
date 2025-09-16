---
title: "Energian hinnan seurantaa Home Assistantilla, osa 1"
date: "2022-11-07"
tags: 
  - "binary_sensor"
  - "energia"
  - "energiankulutus"
  - "hacs"
  - "homeassistant"
  - "input_number"
  - "kotiautomaatio"
  - "nordpool"
  - "sensor"
---

Edit: 12.12.2022 Energian laskenta päivitetty, uusi päivitetty kirjoitus löytyy [linkin](#post/energian-hinnan-seurantaa-home-assistantilla-osa-2) takaa.

Seuraavaksi ajattelin kirjoittaa päivän polttavasta aiheesta eli sähkön hinnasta. Minulla oli aikaisemmin kvartaaleittain vaihtuva sähkön hinta, mutta koska vanhan sähkösopimuksen hinta oli jo yli 50 cnt/kWh, tulin siihen tulokseen, että nyt olisi ehkä hyvä kuitenkin vaihtaa sopimus pörssisähköön, jolloin pystyn vaikuttamaan sähkön hintaan sentään jollakin tavalla. Nyt siis mennään pörssisähköllä ja käytössä on [HACS](https://hacs.xyz/):in kautta saatava [Nordpool](https://github.com/custom-components/nordpool) -integraatio, jonka kautta haetaan pörssisähkölle hinta.

[Home Assistantin](https://www.home-assistant.io/) avulla pystytään tekemään hyvinkin erilaisia sähkön hinnan mukaan muuttuvia ohjauksia. Tähän liittyen tehdään erilliset muuttujat sähköyhtiön pörssisähkön marginaalille, siirtohinnalle sekä lisäksi muuttuja, jossa on mahdollisuus asettaa sähkön hinnalle ns. "kipuraja"-hinta eli kun ollaan tämän hinnan alapuolella, niin tällöin voidaan ohjata esim. koristevalaistusta tms. päälle. "Kipuraja"-hinnasta tehdään vielä erillinen binääri-sensori `(binary_sensor)` eli tästä saadaan kyllä / ei -tieto siitä, että onko hinta yli vai alle asetetun "kipurajan".

Nämä muuttujat toteutetaan [Home Assistantin](https://www.home-assistant.io/) `input_number`\-muuttujalla eli `configuration.yaml`\-tiedostoon lisätään alla olevan mukaiset rivit:

```
#configuration.yaml
input_number:
  sahkon_hinta_siirto:
    name: Sähkön siirtohinta
    min: 0
    max: 50
    step: 0.01
    initial: 2.15
    icon: mdi:currency-eur
    unit_of_measurement: cnt/kWh
    mode: box

  sahkon_hinta_marginaali:
    name: Sähköyhtiön marginaali pörssisähkölle
    min: 0
    max: 10
    step: 0.01
    initial: 0.31
    icon: mdi:currency-eur
    unit_of_measurement: cnt/kWh
    mode: box

  sahkon_hinta_kipuraja:
    name: Sähkön hinnan kipuraja
    min: 0
    max: 25
    step: 0.5
    initial: 6.0
    icon: mdi:currency-eur
    unit_of_measurement: cnt/kWh
    mode: box
```

Seuraavaksi tehdään muuttujista sekä sähkön kokonaishinnasta sensorit sekä "kipuraja"-hinnasta binääri-sensori eli lisätään alla olevat tiedot `configuration.yaml`\-tiedostoon

```
sensor:
  - platform: template
    sensors:
      sahkon_hinta_siirto:
        friendly_name: Sähkön hinta siirto
        unit_of_measurement: EUR/kWh
        icon_template: 'mdi:currency-eur'
        value_template: "{{ states('input_number.sahkon_hinta_siirto') | float / 100 | round(4) }}"

      sahkon_hinta_marginaali:
        friendly_name: Sähköyhtiön marginaali
        unit_of_measurement: EUR/kWh
        icon_template: 'mdi:currency-eur'
        value_template: "{{ states('input_number.sahkon_hinta_marginaali') | float / 100| round(4) }}"

      sahkon_hinta_kipuraja:
        friendly_name: Sähkön hinta kipuraja
        unit_of_measurement: EUR/kWh
        icon_template: 'mdi:currency-eur'
        value_template: "{{ states('input_number.sahkon_hinta_kipuraja') | float / 100 | round(4) }}"

      sahkonhinta_spotti_nyt:
        friendly_name: Sähkön kok.hinta tällä hetkellä
        unit_of_measurement: EUR/kWh
        icon_template: 'mdi:currency-eur'
        value_template: "{{ (states('sensor.nordpool_kwh_fi_eur_4_025_024') |float + states('sensor.sahkon_hinta_siirto') | float + states('sensor.sahkon_hinta_marginaali') | float ) | round(4)}}"

binary_sensor:
  - platform: template
    sensors:
      sahko_kipuraja_hinta:
        friendly_name: 'Sähkön hinta alle kipurajan'
        value_template: >-
            {{ states('sensor.sahkonhinta_spotti_nyt') < states('sensor.sahkon_hinta_kipuraja') }}
```

Nyt voidaan vielä käynnistää [Home Assistant](https://www.home-assistant.io) uudestaan ja lisätä muuttujat ja sensorit työpöydälle, joista kuvat alla

![](/images/energian-hinnan-seurantaa-home-assistantilla/kuva1.png)

_Kuva: Muuttujien tiedot_

![](/images/energian-hinnan-seurantaa-home-assistantilla/kuva2.png)

_Kuva: Sensorien tiedot_

Nyt meillä on saatavilla sähkölle kokonaishintatieto (pois lukien mahdolliset kiinteät kuukausinnat) sensorin muodossa eli tämä tieto voidaan liittää suoraan [Home Assistantin](https://www.home-assistant.io/) Energia -osioon, jolloin saadaan energian kulutuksen lisäksi myös hinta kulutetulle sähkölle.

