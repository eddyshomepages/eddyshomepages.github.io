---
title: "Energian hinnan seurantaa Home Assistantilla, osa 2"
date: "2022-12-12"
categories: 
  - "energia"
  - "hacs"
  - "homeassistant"
  - "kotiautomaatio"
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

Kirjoitin taannoin energian hinnan seurannasta [Home Assistantilla](https://www.home-assistant.io/) ja käytössä minulla oli [HACS](https://hacs.xyz/):in kautta ladattava [Nordpool](https://github.com/custom-components/nordpool) -integraatio. Tämä konfiguraatio antoi spottisähkön hinnan arvonlisäverollisena, mutta nyt joulukuun -22 alusta alkaen arvonlisävero on laskenut käyttösähkön osalta 10%. Tätä muutosta [Nordpool](https://github.com/custom-components/nordpool) -integraatio ei osaa automaattisesti laskea, jolloin myöskin [Home Assistantin](https://www.home-assistant.io/) laskema kustannustieto on liian suuri. Ja mikäli haluat lukea myös vanhan kirjoituksen, niin linkki on [tässä](/posts/energian-hinnan-seurantaa-home-assistantilla/).

Tämän vuoksi tein muutoksia aikaisempaan laskentaan siten, että [Nordpool](https://github.com/custom-components/nordpool) -integraatio antaa jatkossa spottihinnan arvonlisäverottomana ja arvonlisäveron laskenta tapahtuu [Home Assistantin](https://www.home-assistant.io/) kautta. Selkeyden vuoksi olen laittanut tähän kaikki muuttujat ja sensorit kokonaisuudessaan uudestaan, koska muutoin voi käydä helposti niin, että nämä tehtävät muutokset menevät vanhojen kanssa sekaisin.

Aluksi meidän täytyy tehdä vanhojen muuttujien lisäksi uusi `input_number` -muuttuja, jonka avulla annetaan voimassa olevan arvonlisäveron suuruus eli lisätään vanhat rivit mukaan lukien `configuration.yaml` -tiedostoon alla olevat rivit:

```
#configuration.yaml 

input_number:
# nämä muuttujat samoja kuin aikaisemmin tehdyt

  sahkon_hinta_siirto:
    name: 'Siirtohinta'
    min: 0
    max: 150
    step: 0.01
    initial: 2.15
    icon: 'mdi:currency-eur'
    unit_of_measurement: 'cnt/kWh'
    mode: box

  sahkon_hinta_marginaali:
    name: 'Sähköyhtiön marginaali'
    min: 0
    max: 150
    step: 0.01
    initial: 0.31
    icon: 'mdi:currency-eur'
    unit_of_measurement: 'cnt/kWh'
    mode: box

  sahkon_hinta_kipuraja:
    name: 'Sähkön hinnan kipuraja'
    min: 0
    max: 25
    step: 0.5
    initial: 6.0
    icon: 'mdi:currency-eur'
    unit_of_measurement: 'cnt/kWh'
    mode: box

#tämä on uusi lisättävä muuttuja
  sahkon_arvonlisavero:
    name: 'Käyttösähköstä perittävä arvonlisävero'
    min: 0
    max: 30
    step: 0.5
    initial: 10
    icon: 'mdi:percent'
    unit_of_measurement: '%'
    mode: box
```

[Nordpool](https://github.com/custom-components/nordpool) -integraatioon täytyy myös tehdä muutoksia ja sen voi tehdä joko antamalla tiedot manuaalisesti `sensor` -kohdan kautta tai vaihtoehtoisesti [Home Assistantista](https://www.home-assistant.io/) käsin. Minä olen lisännyt tiedot `sensor` -kohdan alle seuraavasti:

```
sensor:
  - platform: nordpool

    # Should the prices include vat? Default True
    VAT: False

    # What currency the api fetches the prices in
    # this is only need if you want a sensor in a non local currecy
    currency: "EUR"

    # Helper so you can set your "low" price
    # low_price = hour_price < average * low_price_cutoff
    low_price_cutoff: 0.25

    # What power regions your are interested in.
    # Possible values: "DK1", "DK2", "FI", "LT", "LV", "Oslo", "Kr.sand", "Bergen", "Molde", "Tr.heim", "Tromsø", "SE1", "SE2", "SE3","SE4", "SYS", "EE"
    region: "FI"

    # How many decimals to use in the display of the price
    precision: 4

    # What the price should be displayed in default
    # Possible values: MWh, kWh and Wh
    # default: kWh
    price_type: kWh
```

[Nordpool](https://github.com/custom-components/nordpool) -integraatiossa on myös mahdollista asettaa oma "low" price -tieto kohdassa `low_price_cutoff`, mutta itse olen tehnyt siitä yksinkertaisen `binary_sensor` -sensorin. Tämä sensori kertoo suoraan kyllä/ei tiedolla, että onko hinta alle itse määritettävän "kipu"-rajan.

Seuraavaksi lisätään vielä vanhat muuttumattomat sensorit, uusi sensori sekä sensorit, joihin on tehty muutoksia eli lisätään kohdan `sensors` -alle seuraavat rivit:

```
  - platform: template
    sensors:

# nämä vanhoja sensoreita, joihin ei ole tehty muutoksia
 
     sahkon_hinta_siirto:
        friendly_name: 'Sähkön hinta siirto'
        unit_of_measurement: 'EUR/kWh'
        icon_template: 'mdi:currency-eur'
        value_template: "{{ states('input_number.sahkon_hinta_siirto') | float / 100 | round(4) }}"

      sahkon_hinta_marginaali:
        friendly_name: 'Sähköyhtiön marginaali'
        unit_of_measurement: 'EUR/kWh'
        icon_template: 'mdi:currency-eur'
        value_template: "{{ states('input_number.sahkon_hinta_marginaali') | float / 100 | round(4) }}"

      sahkon_hinta_kipuraja:
        friendly_name: 'Sähkön hinta kipuraja'
        unit_of_measurement: 'EUR/kWh'
        icon_template: 'mdi:currency-eur'
        value_template: "{{ states('input_number.sahkon_hinta_kipuraja') | float / 100 | round(4) }}"

# nämä vanhoja sensoreita, joihin on tehty muutoksia

      sahkonhinta_spotti_nyt:
        friendly_name: 'Pörssisähkön kok.hinta tällä hetkellä'
        unit_of_measurement: 'EUR/kWh'
        icon_template: 'mdi:currency-eur'
        value_template: "{{ ((states('sensor.nordpool_kwh_fi_eur_4_025_0') |float * (states('sensor.sahkon_arvonlisavero_desimaalilukuna')) |float) + states('sensor.sahkon_hinta_siirto') | float + states('sensor.sahkon_hinta_marginaali') | float ) | round(4)}}"

# tästä eteen päin uusia lisättyjä sensoreita

      sahkonhinta_spotti_arvonlisaverollisena:
        friendly_name: 'Pörssisähkön hinta tällä hetkellä sis. alv.'
        unit_of_measurement: 'EUR/kWh'
        icon_template: 'mdi:currency-eur'
        value_template: "{{ ((states('sensor.nordpool_kwh_fi_eur_4_025_0') |float) * (states('sensor.sahkon_arvonlisavero_desimaalilukuna')) |float) | round(4) }}"

      sahkon_arvonlisavero:
        friendly_name: 'Sähköstä perittävä arvonlisävero'
        unit_of_measurement: '%'
        icon_template: 'mdi:percent'
        value_template: "{{ states('input_number.sahkon_arvonlisavero') | float | round(0) }}"

# tämä on apusensori, jonka avulla lasketaan arvonlisäverollinen hinta spottisähkölle

      sahkon_arvonlisavero_desimaalilukuna:
        friendly_name: 'Sähköstä perittävä arvonlisävero desimaalilukuna'
        value_template: "{{ states('input_number.sahkon_arvonlisavero') | float / 100 + 1| round(4) }}"

# tämä on vanha sensori, jolla ilmaistaan, että onko sähkön hinta alle halutun "kipu"-rajan

binary_sensor:
  - platform: template
    sensors:
      sahko_kipuraja_hinta:
        friendly_name: 'Sähkön hinta alle kipurajan'
        value_template: >-
            {{ states('sensor.sahkonhinta_spotti_nyt') < states('sensor.sahkon_hinta_kipuraja') }}
```

Lopuksi käynnisteään [Home Assistant](https://www.home-assistant.io/) uudestaan sekä lisätään työpöydälle tarvittavat sensorit ja muuttujat

![](/images/energian-hinnan-seurantaa-home-assistantilla-osa-2/kuva1.png)

_Kuva: Home Assistant muuttujat_

![](/images/energian-hinnan-seurantaa-home-assistantilla-osa-2/kuva2.png)

_Kuva: Home Assistant sensorit_

