---
title: "Auton lohkolämmittimen käynnistys automaattisesti haluttuun aikaan"
date: "2022-12-29"
categories: 
  - "energia"
  - "homeassistant"
  - "kotiautomaatio"
tags: 
  - "autolammitys"
  - "energia"
  - "energiankulutus"
  - "homeassistant"
  - "input_datetime"
  - "input_number"
  - "input_select"
  - "kotiautomaatio"
---

Seuraavaksi ajattelin kirjoittaa tällä hetkellä melko ajankohtaisesta asiasta kuin auton lohkolämmittimen ajastuksen automatisointi. Tähän on löytyy erilaisia toteutuksia netistä vaikka kuinka paljon, mutta itselleni on riittänyt se, että olen voinut asettaa auton lämmitys- ja lähtöajan, jonka jälkeen [Home Assistant](https://www.home-assistant.io/) on hoitanut lopun automaattisesti.

Minulla on käytössä myös erillinen autolämmitysrasia, jossa on kaksi erillistä pistorasiaa. Näistä toinen on kellon takana ja toinen on sellainen, johon tulee jatkuva virta. Varsinkin kellon käyttö on mielestäni tosi hankalaa ja kömpelöä, jonka vuoksi olen päätynyt tähän ohjattavaan pistorasiaan. Jo pelkästään mahdollisuus ohjata pistorasiaa helpotti paljon, kun ei enää tarvinnut lähteä erikseen laittamaan lämmittimen johtoa seinään tai muuttamaan kellon asetusta.

Pistorasiana minulla on tällainen [Ledvance Smart+ Outdoor Plug](https://hintaseuranta.fi/lyhdyt-ja-ulkovalaisimet/ledvance-smart-plus-outdoor-plug-eu-zigbee/8626997) [](https://www.proshop.fi/Smart-Home-Aelykoti/LEDVANCE-Smart-Outdoor-Plug-EU-Zigbee/2799786)\-ulkopistorasia, jossa on erillinen johto. Tämä on siitä hyvä, että sen voi kytkeä autolämmitysrasian (jatkuva virta) pistorasiaan siten, että kansikin mahtuu vielä kiinni ja lukkoon. Lisäksi ulkopistorasiassa on myös kunnon kansi, jolloin se on suojassa kosteudelta. Tällä kokoonpanolla on menty jo muutama talvi läpi ja hyvin on toiminut.

#### Muuttujien ja automaation teko

Automaattista ohjausta varten [Home Assistantiin](https://www.home-assistant.io/) tarvitsee luoda muuttujat lähtö- ja lämmitysajalle sekä myös tehdä valitsin, jolla voidaan määrittää toiminta siten, että autolämmitysrasia toimii joko automaattisesti tai manuaalisesti.

Muuttujat määritetään `configuration.yaml` -tiedostoon seuraavasti:

```
# configuration.yaml # eli tähän tiedostoon tehdään muuttujat

# lähtöaika
input_datetime:
  lahtoaika:
    name: 'Lähtöaika'
    has_date: false
    has_time: true
    initial: '08:00'
    icon: 'mdi:clock-time-four'

# lämmitysaika
input_number:
  lammitysaika:
    name: 'Lämmitysaika'
    initial: 60
    min: 0
    max: 240
    step: 5
    icon: 'mdi:timer-outline'
    unit_of_measurement: 'min'

# lämmitysjan asetus manuaalisesti/automaattisesti
input_select:
  autonlammitysasetus:
    name: 'Auton lämmityksen asetus'
    options:
      - Automaattinen
      - Manuaalinen
    initial: Manuaalinen
    icon: 'mdi:cog'
```

Myös ulkopistorasia tulee liittää [Home Assistantiin](https://www.home-assistant.io/) ja minulla se on nimeltään `switch.pistorasia_autopaikka`. Lisäksi olen automaatiossa määrittänyt, että autolämmitysrasia pysyy päällä vielä 10 min sen jälkeen, kun lähtöaika on ollut käsillä. Tämä siksi, että mikäli lähtöaika hiukan venyy, niin auton lämmitys on kuitenkin vielä hetken päällä.

Ennen automaation määrityksiä, täytyy [Home Assistant](https://www.home-assistant.io/) kuitenkin käynnistää uudestaan, jotta muuttujat tulevat näkyviin. Automaation osalta määritykset voidaan tehdä joko käyttöliittymän kautta, jolloin ne ovat seuraavat:

###### Auton lämmitys päälle:

![](/images/auton-lammityspistorasian-kaynnistys-automaattisesti-haluttuun-aikaan/kuva1.png)
_Kuva: Laukaisuehdot_

![](/images/auton-lammityspistorasian-kaynnistys-automaattisesti-haluttuun-aikaan/kuva2.png)
_Kuva: Ehdot_

![](/images/auton-lammityspistorasian-kaynnistys-automaattisesti-haluttuun-aikaan/kuva3.png)
_Kuva: Toiminnot_

###### Auton lämmitys pois päältä:

![](/images/auton-lammityspistorasian-kaynnistys-automaattisesti-haluttuun-aikaan/kuva4.png)
_Kuva: Laukaisuehdot_

![](/images/auton-lammityspistorasian-kaynnistys-automaattisesti-haluttuun-aikaan/kuva5.webp)
_Kuva: Ehdot_

![](/images/auton-lammityspistorasian-kaynnistys-automaattisesti-haluttuun-aikaan/kuva7.webp)
_Kuva: Toiminnot_

Tai vaihtoehtoisesti muutokset voidaan tehdä myös `automations.yaml` -tiedostoon, jolloin ne ovat alla olevan kaltaiset:

```
# automations.yaml
- id: e1897cef08d440cfa52696008714b83e
  alias: Auton lämmitys päälle
  trigger:
  - platform: template
    value_template: '{{states.sensor.time.state == states.sensor.autonlammitysaloitusaika.state}}'
  condition:
  - condition: and
    conditions:
    - condition: device
      type: is_off
      device_id: 4bee6cbb7dff9ba9ac9ee503b5b554f8
      entity_id: switch.pistorasia_autopaikka
      domain: switch
    - condition: state
      entity_id: input_select.autonlammitysasetus
      state: Automaattinen
  action:
  - type: turn_on
    device_id: 4bee6cbb7dff9ba9ac9ee503b5b554f8
    entity_id: switch.pistorasia_autopaikka
    domain: switch
  - service: notify.notify
    data:
      message: Auton lämmitys on käynnistynyt!
  mode: single

- id: 5af07494ae784eb79ecf7d0da8a2c444
  alias: Auton lämmitys pois
  trigger:
  - platform: template
    value_template: '{{states.sensor.time.state == states.input_datetime.lahtoaika.state[0:5]}}'
  condition:
  - condition: and
    conditions:
    - condition: device
      type: is_on
      device_id: 4bee6cbb7dff9ba9ac9ee503b5b554f8
      entity_id: switch.pistorasia_autopaikka
      domain: switch
    - condition: state
      entity_id: input_select.autonlammitysasetus
      state: Automaattinen
  action:
  - delay:
      hours: 0
      minutes: 10
      seconds: 0
      milliseconds: 0
  - type: turn_off
    device_id: 4bee6cbb7dff9ba9ac9ee503b5b554f8
    entity_id: switch.pistorasia_autopaikka
    domain: switch
  - service: notify.notify
    data:
      message: Auton lämmityspistorasia on nyt pois päältä!
  mode: single
```

Automaatiossa olen myös ottanut ilmoitukset käyttöön, jolloin [Home Assistant](https://www.home-assistant.io/) ilmoittaa aina, kun autolämmitysrasia on mennyt päälle tai pois päältä. Nämä näkyvät automaation lopussa.

Lopuksi tehdään vielä [Home Assistantin](https://www.home-assistant.io/) työpöydälle tarvittavat muutokset eli tehdään näistä muuttujista ja kytkimestä oma kortti, joka minulla on alla olevan mukainen:

![](/images/auton-lammityspistorasian-kaynnistys-automaattisesti-haluttuun-aikaan/kuva8.webp)
_Kuva: Autolämmityksen ohjaus_

Ja sama vielä muokkausmuodossa koodieditorissa:

![](/images/auton-lammityspistorasian-kaynnistys-automaattisesti-haluttuun-aikaan/kuva9.webp)
_Kuva: Autolämmityksen ohjaus koodieditorissa_

Ja nyt vain autoa lämmittämään aina sen mukaan, mitä säät vaativat ja mitä on tarpeen.

