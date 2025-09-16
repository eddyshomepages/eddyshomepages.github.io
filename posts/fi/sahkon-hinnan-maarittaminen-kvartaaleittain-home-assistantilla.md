---
title: "Sähkön hinnan määrittäminen kvartaaleittain Home Assistantilla"
date: "2022-11-12"
tags: 
  - "energia"
  - "energiankulutus"
  - "homeassistant"
  - "input_datetime"
  - "input_number"
  - "kotiautomaatio"
---

Edellisessä [kirjoituksessa](#posts/energian-hinnan-seurantaa-home-assistantilla) kirjoitin sensorien ja muuttujien luomisesta pörssisähkölle. Nyt ajattelin laittaa vielä jakoon myös vanhan konfiguraation, jossa voidaan antaa sähkön hinta kvartaaleittain sekä määrittää kvartaalit oman sähkösopimuksen mukaiseksi. Tässäkin tapauksessa voidaan sähkön kokonaishintasensori myös yhdistää [Home Assistantin](https://www.home-assistant.io/) Energia-seurantaosioon.

Aluksi luomme tarvittavat muuttujat hinta- ja päivämäärätiedoille eli lisätään `configration.yaml`\-tiedostoon seuraavat rivit

```
#configuration.yaml

input_number:
  sahkon_hinta_q1:
    name: Hinta Q1
    min: 0
    max: 150
    step: 0.01
    initial: 0
    icon: mdi:currency-eur
    unit_of_measurement: cnt/kWh
    mode: box
  sahkon_hinta_q2:
    name: Hinta Q2
    min: 0
    max: 150
    step: 0.01
    initial: 0
    icon: mdi:currency-eur
    unit_of_measurement: cnt/kWh
    mode: box
  sahkon_hinta_q3:
    name: Hinta Q3
    min: 0
    max: 150
    step: 0.01
    initial: 0
    icon: mdi:currency-eur
    unit_of_measurement: cnt/kWh
    mode: box
  sahkon_hinta_q4:
    name: Hinta Q4
    min: 0
    max: 150
    step: 0.01
    initial: 0
    icon: mdi:currency-eur
    unit_of_measurement: cnt/kWh
    mode: box
  sahkon_hinta_siirto:
    name: Siirtohinta
    min: 0
    max: 150
    step: 0.01
    initial: 2.15
    icon: mdi:currency-eur
    unit_of_measurement: cnt/kWh
    mode: box

input_datetime:
  q1:
    name: 'Q1 alkaa'
    has_date: true
    has_time: false
    icon: mdi:clock-time-four
  q2:
    name: 'Q2 alkaa'
    has_date: true
    has_time: false
    icon: mdi:clock-time-four
  q3:
    name: 'Q3 alkaa'
    has_date: true
    has_time: false
    icon: mdi:clock-time-four
  q4:
    name: 'Q4 alkaa'
    has_date: true
    has_time: false
    icon: mdi:clock-time-four
```

Seuraavaksi luodaan em. tiedoille vielä hintasensorit sähkön hinta per q1, q2, q3 ja q4, sähkön siirtohinta sekä kokonaishinta meneillään olevan kvartaalin mukaisesti

```
sensor:
  - platform: template
    sensors:
      sahkon_hinta_q1:
        friendly_name: Sähkön hinta Q1
        unit_of_measurement: EUR/kWh
        icon_template: 'mdi:currency-eur'
        value_template: "{{ states('input_number.sahkon_hinta_q1') | float / 100 | round(4) }}"
      sahkon_hinta_q2:
        friendly_name: Sähkön hinta Q2
        unit_of_measurement: EUR/kWh
        icon_template: 'mdi:currency-eur'
        value_template: "{{ states('input_number.sahkon_hinta_q2') | float / 100 | round(4) }}"
      sahkon_hinta_q3:
        friendly_name: Sähkön hinta Q3
        unit_of_measurement: EUR/kWh
        icon_template: 'mdi:currency-eur'
        value_template: "{{ states('input_number.sahkon_hinta_q3') | float /100 | round(4) }}"
      sahkon_hinta_q4:
        friendly_name: Sähkön hinta Q4
        unit_of_measurement: EUR/kWh
        icon_template: 'mdi:currency-eur'
        value_template: "{{ states('input_number.sahkon_hinta_q4') | float / 100 | round(4) }}"
      sahkon_hinta_siirto:
        friendly_name: Sähkön hinta siirto
        unit_of_measurement: EUR/kWh
        icon_template: 'mdi:currency-eur'
        value_template: "{{ states('input_number.sahkon_hinta_siirto') | float / 100 | round(4) }}"
      sahkonhinta_nyt:
        friendly_name: Sähkön hinta tällä hetkellä
        unit_of_measurement: EUR/kWh
        icon_template: 'mdi:currency-eur'
        value_template: >-
            {% if states('input_datetime.q1') <= states('sensor.date_time') %} 
                  {{ (states('sensor.sahkon_hinta_siirto')|float + states('sensor.sahkon_hinta_q2')|float |round(4)) }}
            {% elif states('input_datetime.q2') <= states('sensor.date_time') %} 
                  {{ (states('sensor.sahkon_hinta_siirto')|float + states('sensor.sahkon_hinta_q3')|float |round(4)) }}
            {% elif states('input_datetime.q3') <= states('sensor.date_time') %} 
                  {{ (states('sensor.sahkon_hinta_siirto')|float + states('sensor.sahkon_hinta_q4')|float |round(4)) }}
            {% elif states('input_datetime.q4') <= states('sensor.date_time') %} 
                  {{ (states('sensor.sahkon_hinta_siirto')|float + states('sensor.sahkon_hinta_q1')|float |round(4)) }}
            {% endif%}
```

Käynnistetään vielä [Home Assistant](https://www.home-assistant.io/) uudelleen ja luodaan työpöydälle tarvittavat muuttujat ja sensorit, joihin sitten annetaan tarvittavat tiedot.

![](/images/sahkon-hinnan-maarittaminen-kvartaaleittain-home-assistantilla/kuva1.png)

_Kuva: Muuttujat ja sensorit_

Lopuksi vielä liitetään sähkön kokonaishinnan sensori [Home Assistantin](https://www.home-assistant.io/blog/2021/08/04/home-energy-management/) energia-osioon, jolloin saadaan kerättyä tietoa sähkön kulutuksen lisäksi myös käytetyn sähkön hinnasta.

