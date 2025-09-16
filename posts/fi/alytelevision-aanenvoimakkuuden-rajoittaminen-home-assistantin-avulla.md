---
title: "Älytelevision äänenvoimakkuuden rajoittaminen Home Assistantin avulla"
date: "2023-01-02"
tags: 
  - "alytelevisio"
  - "homeassistant"
  - "kotiautomaatio"
  - "mediaplayer"
---

[Home Assistant](https://www.home-assistant.io/) on monikäyttöinen kotiautomaatiojärjestelmä, jonka tulin huomanneeksi, kun mietin, että miten voisin rajoittaa Samsungin älytelevision äänen voimakkuutta. Meillä kotona tuppasi käymään siten, että kiusalla äänen voimakkuutta nostettiin välillä lähes maksimiin, jonka vuoksi kyllästyin ja aloin miettimään ratkaisua tähän ongelmaan.

Valmistajan sovelluskaupasta ei apuja löytynyt, joten päätin kokeilla, että miten [Home Assistant](https://www.home-assistant.io/) tässa onnistuu. Ja onnistuuhan se, vieläpä oikein hyvin.

Aluksi meidän täytyy lisätä älytelevio [Home Assistantiin](https://www.home-assistant.io/) media playerinä, jonka [Home Assistant](https://www.home-assistant.io/) yleensä tekee automaattisesti, mikäli TV on samassa verkossa. Minulla TV näkyy integraatiossa seuraavasti:

![](/images/alytelevision-aanenvoimakkuuden-rajoittaminen-home-assistantin-avulla/kuva1.webp)

_Kuva: Integraatiot, TV_

Seuraavaksi luodaan muuttuja, jolla määritetään äänen voimakkuuden yläraja. Tämä muuttuja luodaan `input_number` -muuttujana eli lisätään `configuration.yaml` -tiedostoon seuraavat rivit:

```
# configuration.yaml

input_number:
  tv_volume_max:
    name: 'Maksimi äänenvoimakkuus'
    initial: 20
    min: 0
    max: 40
    step: 1
    icon: mdi:cog
    mode: box
```

Alarajalle voidaan myös tehdä oma muuttuja, mutta itse olen määrittänyt automaatiossa tähän arvoksi 10. Eli tämä tarkoittaa sitä, että kun TV:n äänen voimakkuus nostetaan yli muuttujan määrittämän arvon, eli tässä tapauksessa 20, niin automaatio laskee äänen voimakuuden automaattisesti takaisin tasolle 10. HUOM! [Home Assistant](https://www.home-assistant.io/) määrittää automaatiossa äänen voimakkuuden desimaalilukuna eli tässä tapauksessa lukuna `0,1`.

Tämä [Home Assistantin](https://www.home-assistant.io/) avulla tehty ratkaisu ei ole kuitenkaan aivan "idiootti"-varma, koska äänen voimakkuutta "renkuttamalla" automaatio voi joskus pudota kyydistä, jolloin rajoitus ei hetkeen toimi. Normaalissa käytössä se toimii kuitenkin hyvin.

Seuraavaksi määritetään TV:n äänen voimakkuudesta oma sensori lisäämällä `sensor:` -kohtaan seuraavat rivit

```
sensor:
  - platform: template
    sensors:
      tv_volume:
        friendly_name: 'TVn äänen voimakkuus'
        value_template: "{{ (state_attr('media_player.tv','volume_level') *100 |float) | round(0) }}"
```

Lopuksi tehdään vielä tarvittava automaatio, joka sitten laskee äänen voimakkuutta tarvittaessa alas päin. Käyttöliittymän kautta tehtynä se näyttää seuraavalta:

**Laukaisuehdot:**

![](/images/alytelevision-aanenvoimakkuuden-rajoittaminen-home-assistantin-avulla/kuva2.webp)

_Kuva: Laukaisuehdot_

**Toiminnot:**

![](/images/alytelevision-aanenvoimakkuuden-rajoittaminen-home-assistantin-avulla/kuva3.webp)

_Kuva: Toiminnot_

Mikäli haluaa tehdä muutokset `automations.yaml` -tiedostoon, niin tällöin lisätään sinne rivit:

```
# automations.yaml
- id: '1650139109230'
  alias: TVn äänenvoimakkuuden rajoitus
  description: ''
  trigger:
  - platform: template
    value_template: '{{states.sensor.tv_volume.state >= states.input_number.tv_volume_max.state}}'
  condition: []
  action:
  - service: media_player.volume_set
    data:
      volume_level: 0.1
    target:
      entity_id:
      - media_player.tv
  mode: single
```

[Home Assistantin](https://www.home-assistant.io/) työpöydällä TV:n tiedot näkyvät seuraavasti:

![](/images/alytelevision-aanenvoimakkuuden-rajoittaminen-home-assistantin-avulla/kuva4.png)

_Kuva: Älytelevision äänen voimakkuuden rajoitus_

