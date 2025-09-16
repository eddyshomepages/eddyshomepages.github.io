---
title: "RuuviTag BLE -integraation käyttöönotto Docker-Composen avulla asennetussa Home Assistantissa"
date: "2023-07-30"
tags: 
  - "docker"
  - "docker-compose"
  - "duplicati"
  - "homeassistant"
  - "kotiautomaatio"
  - "linux"
  - "node.js"
  - "ruuvitag"
  - "ruuvitag-ble"
  - "ruuvitag-discovery"
---

Minulla oli aikaisemmin [RuuviTag](https://ruuvi.com/fi/ruuvitag/) -anturit yhdistettynä [Home Assistantiin](https://www.home-assistant.io/) [RuuviTag Discovery](https://github.com/balda/ruuvitag-discovery/) nimisen ohjelmiston avulla, josta myös aikoinaan kirjoitin [jutun](#post/ruuvitag-antureiden-lisaaminen-home-assistantiin-ruuvitag-discoveryn-avulla-mqtt-protokollaa-kayttaen). Viime aikoina tämä konfiguraatio on kuitenkin alkanut enemmän ja enemmän temppuilemaan. Tämä johtunee ilmeisesti siitä, että [node.js](https://nodejs.org/en) -paketteihin on tullut päivityksiä, joiden kanssa [Ruuvitag Discovery](https://github.com/balda/ruuvitag-discovery) ei enää oikein toimi kunnolla.

Tästä syystä aloin miettimään, että miten anturit olisi järkevä liittää [Home Assistantiin](https://www.home-assistant.io/), koska minulla ei ole esim. [Ruuvi Gateway](https://ruuvi.com/fi/gateway/):tä käytössä. [Home Assistantissa](https://www.home-assistant.io/) on kuitenkin nykyisin olemassa [RuuviTag BLE](https://www.home-assistant.io/integrations/ruuvitag_ble) -integraatio, jonka vuoksi aloin selvittämään, että miten anturit saisi lisättyä järjestelmään sen avulla.

#### Muutokset isäntä -järjestelmään

[Home Assistant](https://www.home-assistant.io/) on minulla asennettuna konttiin [Docker-Composen](https://docs.docker.com/compose/) avulla, joten aluksi _isäntä_ -järjestelmään piti asentaa tarvittavat paketit kuten _BlueZ_, lisätä _configurations.yaml_ -tiedostoon rivi _bluetooth:_ ja lopuksi käynnistää vielä [Home Assistantin](https://www.home-assistant.io/) uudelleen.

Mitään ei kuitenkaan tapahtunut kunnes tajusin lukea vielä tarkemmin [Home Assistantin](https://www.home-assistant.io/) dokumentointia [Bluetooth](https://www.home-assistant.io/integrations/bluetooth) -integraation osalta. Ratkaisu löytyikin kohdasta _Additional requirements by install method_, jossa mainitaan, että [Dockerin](https://www.docker.com/) avulla asennetussa järjestelmässä täytyy _isäntä_ -järjestelmässä olla käytössä _BlueZ_ ja _D-Bus socket_ ja ne täytyy olla myös [Home Assistantin](https://www.home-assistant.io/) saatavilla kontin sisällä. Eli tämä korjaantuu lisäämällä _docker-compose.yaml_ -tiedostoon kohdan _volumes:_ alle rivi

```
  - /run/dbus:/run/dbus:ro
```

Ennen kuin käynnistetään [Home Assistantin](https://www.home-assistant.io/) kontti uudestaan, niin tässä vaiheessa on hyvä viimeistään ottaa varmuuskopio [Home Assistantista](https://www.home-assistant.io/). Minulla nimittäin kävi niin, että järjestelmän käynnistyttyä uudestaan olivat kaikki vanhat historiatiedot yms. hävinneet ja [Home Assistant](https://www.home-assistant.io/) käynnistyi kokonaan puhtaalta pöydältä. Tämä toi tietysti hiukan lisää työtä, kun järjestelmää joutui palauttamaan vanhoista varmuuskopioista, mutta se onnistui kuitenkin hyvin.

Tietojen nollaantuminen johtunee todennäköisesti siitä, että lisäsin epähuomiossa tämän _/run/dbus:/run/dbus:ro_ -rivin _docker-compose.yaml_ tiedostoon loppuun uuteen _volumes_ -kohtaan, jolloin se jostain syystä nollasi kaikki tiedot.

#### Home Assistantin varmuuskopiointi

[Home Assistantin](https://www.home-assistant.io/) varmuuskopioinnin voi hoitaa usealla tavalla ja minulla se on hoidettu automaattisesti [Duplicati](https://www.duplicati.com/) -nimisellä selainpohjaisella sovelluksella, josta aikoinaan kirjoitin [tämän](#post/docker-composen-avulla-asennetun-home-assistantin-varmuuskopiointi-duplicatin-avulla) tarinan. Varmuuskopion järjestelmästä voi tehdä myös manuaalisesti päätteen kautta, kuten tein sen tässä tapauksessa eli toisin sanoen luodaan [Home Assistantin](https://www.home-assistant.io/) -kansiosta kopio. Tämä tapahtuu päätteen kautta siten, että annetaan päätteessä komento (tällöin pitää olla tietysti oikeassa hakemistossa, jossa käsky annetaan)

```
sudo cp -r homeassistant homeassistant_backup
```

Varmuuskopioinnin jälkeen käynnistetään [Home Assistantin](https://www.home-assistant.io/) kontti uudelleen komennolla

```
sudo docker-compose up -d
```

Seuraavaksi odotetaan hetken aikaa, että myös [Home Assistant](https://www.home-assistant.io/) käynnistyy uudestaan. Tämän jälkeen [Home Assistant](https://www.home-assistant.io/) tarjoaa suoraan [Bluetooth](https://www.home-assistant.io/integrations/bluetooth) -integraatiota käyttöön otettavaksi eli otetaan se käyttöön. Seuraavaksi [Home Assistant](https://www.home-assistant.io/) tarjoaa automaattisesti myös [RuuviTag](https://ruuvi.com/fi/ruuvitag/) -antureita käyttöön otettavaksi. Eli nyt [Home Assistant](https://www.home-assistant.io/) löytää automaattisesti kantaman päässä olevat [RuuviTag](https://ruuvi.com/fi/ruuvitag/) -anturit ja ehdottaa niiden lisäämistä järjestelmään.

Oman kokemukseni perusteella anturit ovat pysyneet hyvin käytössä ilman ongelmia. Mikäli käy kuitenkin niin, että [Home Assistant](https://www.home-assistant.io/) ei löydäkään [RuuviTag](https://ruuvi.com/fi/ruuvitag/) -antureita, niin seuraavaksi kannattaa päivittää [RuuviTagien](https://ruuvi.com/fi/ruuvitag/) firmikset viimeisimpään versioon. Firmiksien päivitys yleensä viimeistään korjaa tilanteen.

