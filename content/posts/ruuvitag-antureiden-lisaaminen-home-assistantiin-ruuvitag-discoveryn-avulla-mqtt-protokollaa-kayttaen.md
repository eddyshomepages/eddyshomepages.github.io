---
title: "RuuviTag -antureiden lisääminen Home Assistantiin Ruuvitag Discoveryn avulla MQTT-protokollaa käyttäen"
date: "2022-09-21"
categories: 
  - "homeassistant"
  - "kotiautomaatio"
  - "linux"
  - "mqtt"
  - "node.js"
  - "ruuvitag"
  - "ruuvitag-discovery"
tags: 
  - "bluetooth"
  - "debian"
  - "homeassistant"
  - "kotiautomaatio"
  - "mqtt"
  - "node.js"
  - "raspberrypios"
  - "ruuvitag"
  - "ruuvitag-discovery"
---

Lähtökohtaisesti meillä on [Docker-Composen](https://docs.docker.com/compose/) avulla asennettuna [Home Assistant](https://www.home-assistant.io/) sekä [Mosquitto](https://mosquitto.org/) -broker. Seuraavaksi lisäämme [Home Assistanttin](https://www.home-assistant.io/) [RuuviTag](https://ruuvi.com/fi/) -antureita käyttäen [MQTT](https://mqtt.org/) -protokollaa ja siinä käytämme apuna [Ruuvitag Discovery](https://github.com/balda/ruuvitag-discovery) -ohjelmistoa.

[RuuviTag](https://ruuvi.com/fi/) on kotimainen tuote, joka toimii lämpötila-, kosteus-, ilmanpaine ja liike -anturina. [RuuviTag](https://ruuvi.com/fi/) toimii [Bluetooth](https://en.wikipedia.org/wiki/Bluetooth) -yhteydellä ja se voidaan yhdistää esim. puhelimeen tai kuten tässä tapauksessa, myös [Home Assistantiin](https://www.home-assistant.io/) tai muihin kotiautomaatiojärjestelmiin.

[RuuviTagit](https://ruuvi.com/fi/) voisi lisätä [Home Assistanttiin](https://www.home-assistant.io/) myös erilaisilla lisäosilla, mutta me teemme sen [Ruuvitag Discoveryn](https://github.com/balda/ruuvitag-discovery) ja [MQTT](https://mqtt.org/):n avulla. Tämä siksi, että meillä [Home Assistant](https://www.home-assistant.io/) on asennettu [Docker-Composen](https://docs.docker.com/compose/) avulla, jolloin tämä lisäosat eivät toimi sellaisenaan. Jatkossa tarkoituksena on asentaa myös [zigbee](https://en.wikipedia.org/wiki/Zigbee)\- ja [z-wave](https://en.wikipedia.org/wiki/Z-Wave) -antureita [MQTT](https://mqtt.org/):tä hyödyntäen, jolloin [RuuviTagit](https://ruuvi.com/fi/) menevät siinä samalla mukana.

### Node.js asennus

Aluksi meidän täytyy kuitenkin asentaa [node.js](https://nodejs.org/en/), jotta saamme [Ruuvitag Discoveryn](https://github.com/balda/ruuvitag-discovery) asennettua. [RaspberryPiOS](https://www.raspberrypi.com/software/) on [Debian](https://www.debian.org/) -pohjainen käyttöjärjestelmä eli saamme asennettua [node.js](https://nodejs.org/en/):n ohjelmistolähteistä, joihin löytyvät ohjeet [linkin](https://github.com/nodesource/distributions/blob/master/README.md) takaa.

Aluksi asennamme [node.js](https://nodejs.org/en/):n ohjelmistolähteet ja myös [node.js](https://nodejs.org/en/):n komennoilla

```
#HUOM! asennus tehdään root-käyttäjänä
sudo su
curl -fsSL https://deb.nodesource.com/setup_current.x | bash -
apt-get install -y nodejs
exit
```

### Ruuvitag Discoveryn asennus

Seuraavaksi haetaan [Ruuvitag Discovery](https://github.com/balda/ruuvitag-discovery) -tiedostot komennolla

```
git clone https://github.com/balda/ruuvitag-discovery
```

Seuraavaksi suoritetaan asennus

```
cd ruuvitag-discovery/
npm install
```

Asennukseen jälkeen voimme käynnistää [Ruuvitag-Discoveryn](https://github.com/balda/ruuvitag-discovery) komennolla

```
npm start
```

Voi olla, että järjestelmä ei vielä suoraan löydä [RuuviTag](https://ruuvi.com/fi/) -antureita, jolloin pitää varmistaa, että järjestelmään on asennettu tarvittavat `bluetooth` -paketit sekä ajaa komento, jolloin [Ruuvitag Discovery](https://github.com/balda/ruuvitag-discovery) ei tarvitse `root/sudo` -oikeuksia

```
sudo apt-get install bluetooth bluez
sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)
```

Mikäli asennus onnistui, niin meillä pitäisi näkyä päätteessä alla olevan kaltaiset rivit, josta alimpana nähdään, että [Ruuvitag Discovery](https://github.com/balda/ruuvitag-discovery) on löytänyt kaksi erillistä [RuuviTagia](https://ruuvi.com/fi/)

![](/images/ruuvitag-antureiden-lisaaminen-home-assistantiin-ruuvitag-discoveryn-avulla-mqtt-protokollaa-kayttaen/kuva1.png)

### Palvelun ruuvitag-discovery.service luominen

Ennen kuin jatketaan asetuksien tekemistä, niin tehdään kuitenkin [Ruuvitag Discoverystä](https://github.com/balda/ruuvitag-discovery) palvelu, joka käynnistyy automaattisesti tietokoneen käynnistyessä. Aluksi luodaan tiedosto `ruuvitag-discovery.service` komennolla `sudo nano /etc/systemd/system/ruuvitag-discovery.service` ja lisätään tiedostoon alla olevat rivit

```
[Unit]
Description=RuuviTag Discovery

[Service]
Type=simple
Restart=always
User=pi
WorkingDirectory=/home/pi/ruuvitag-discovery
ExecStart=/usr/bin/npm start

[Install]
WantedBy=multi-user.target
```

Seuraavaksi käynnistetään palvelu ja tehdään siitä automaattisesti käynnistyvä komennoilla

```
sudo systemctl start ruuvitag-discovery
sudo systemctl enable ruuvitag-discovery
```

### Ruuvitag Discoveryn asetus web-selaimen kautta

Tämän jälkeen avataan selaimella osoite `http://x.x.x.x:8099`, jota kautta pääsemme avaamaan web-pohjaisen konfigurointi -ikkunan. IP-osoite `x.x.x.x` on sen tietokoneen IP-osoite, jolle [Ruuvitag Discovery](https://github.com/balda/ruuvitag-discovery) on asennettu.

Etusivulla näkyvät löydetyt anturit ja kohdasta "`Targets`" päästään antamaan [MQTT](https://mqtt.org/):n asetukset. Lisätään asetukset painamalla napista "`+Home Assistant (MQTT)`" , jolloin avautuu alla olevan kaltainen ikkuna

![](/images/ruuvitag-antureiden-lisaaminen-home-assistantiin-ruuvitag-discoveryn-avulla-mqtt-protokollaa-kayttaen/kuva2.png)

Aluksi annetaan tarvittavat tiedot eli

- kohtaan `name` jokin nimi esim. `mosquitto`

- kohtaan `host` mosquitto -brokerin IP-osoite

- kohtaan `port` mosquitto -brokerin portti

- kohtaan `topic` otsikoksi `homeassistant`

- kohtaan `username` käyttäjätunnus

- kohtaan `password` salasana

Kohdasta "Tags" voidaan ottaa käyttöön halutut anturit sekä tiedot, joita lähetetään [Home Assistantille](https://www.home-assistant.io/) eli esim. ainakin `humidity`, `temperature` ja `pressure`. Lisäksi valittavana on myös muitakin tietoja, joita voidaan lähetään [Home Assistantille](https://www.home-assistant.io/).

![](/images/ruuvitag-antureiden-lisaaminen-home-assistantiin-ruuvitag-discoveryn-avulla-mqtt-protokollaa-kayttaen/kuva3.png)

Lopuksi otetaan vielä "`Home Assistant (MQTT)`" käyttöön valitsemalla "`enable`" ja tallennetaan asetukset, jonka jälkeen pitäisi alkaa tulla anturi-dataa [Home Assistantille](https://www.home-assistant.io/).

