---
title: "Zigbee2MQTT asentaminen Docker-Composen avulla"
date: "2022-10-05"
categories: 
  - "docker"
  - "docker-compose"
  - "homeassistant"
  - "kotiautomaatio"
  - "linux"
  - "mqtt"
  - "zigbee2mqtt"
tags: 
  - "conbee ii"
  - "deconz"
  - "docker"
  - "docker-compose"
  - "homeassistant"
  - "kotiautomaatio"
  - "zigbee2mqtt"
---

Jatketaan vielä [Docker-Composen](https://docs.docker.com/compose/) parissa ja seuraavaksi asennetaan [Zigbee2MQTT](https://www.zigbee2mqtt.io/) [Docker-Composen](https://docs.docker.com/compose/) avulla. Meillä on siis [Home Assistant](/posts/home-assistantin-asennus-docker-composen-avulla/) ja [Mosquitto -broker](/posts/mosquitto-brokerin-asennus-kayttaen-docker-composea/) asennettuna [Docker-Composen](https://docs.docker.com/compose/) kautta, jonka vuoksi mm. [Home Assistantin](https://www.home-assistant.io/) lisäosat eivät ole käytettävissä. Tätä kautta onnistuisi myös asentaa [Zigbee2MQTT](https://www.zigbee2mqtt.io/), mutta me asennamme sen toisella tapaan. Minulla on myös käytössä [Conbee II](https://phoscon.de/en/conbee2) zigbee -mokkula, joka toimii hyvin [Zigbee2MQTT](https://www.zigbee2mqtt.io/):n kanssa. Vaihtoehtoisesti voitaisiin käyttää myös [deConz](https://phoscon.de/en/conbee2/install) -ohjelmistoa, mutta itse olen tykästynyt [Zigbee2MQTT](https://www.zigbee2mqtt.io/):hen. Mikäli olen asentanut [Home Assistantin](https://www.home-assistant.io/installation/) oman käyttöjärjestelmän, löytyy [deConz](https://phoscon.de/en/conbee2/install) -lisäosa suoraan ohjelmakirjastosta.

Asennus aloitetaan samaan tapaan kuin aikaisemmissa [Docker-Compose](https://docs.docker.com/compose/) asennuksissa eli aluksi luodaan `zigbee2mqtt` -hakemisto [Docker-Composen](https://docs.docker.com/compose/) asennushakemistoon eli annetaan käskyt

```
cd /home/pi/docker-data
mkdir zigbee2mqtt
cd zigbee2mqtt
```

Seuraavaksi avataan / luodaan tiedosto `docker-compose.yaml` komennolla `nano docker-compose.yaml` ja kopioidaan sinne alla olevat tiedot

```
version: '3.8'
services:
  zigbee2mqtt:
    container_name: zigbee2mqtt
    image: koenkk/zigbee2mqtt
    restart: unless-stopped
    volumes:
      - /home/pi/docker-data/zigbee2mqtt/data:/app/data
      - /run/udev:/run/udev:ro
    ports:
      # Frontend port
      - 8080:8080
    environment:
      - TZ=Europe/Helsinki
    devices:
      # Make sure this matched your adapter location
      - /dev/ttyACM0:/dev/ttyACM0
```

Rivi `devices` on tärkeä, koska siihen laitetaan oikeat tiedot zigbee -adapterin portista. Yleensä adapterin osoite on `/dev/ttyACM0`, mutta se saattaa myös vaihdella. Oikean osoitteen saa hyvin tarkastettua komennolla `ls -l /dev/serial/by-id`. Minulla komento antaa alla olevan mukaisen näkymän

![](/images/zigbee2mqtt-asentaminen-docker-composen-avulla/kuva1.png)

Tämä kertoo, että zigbee-adabteri on portissa `/dev/ttyACM0`, joka on myös täten adapterin osoite.

Tämän jälkeen voimme sitten asentaa tarvittavat tiedostot ja käynnistää [Zigbee2MQTT](https://www.zigbee2mqtt.io/):n komennolla

```
docker-compose up -d
```

Kun asennus on valmis, niin tämän jälkeen meillä on [Zigbee2MQTT](https://www.zigbee2mqtt.io/) asennettuna ja seuraavaksi voimmekin mennä selaimen kautta konffaamaan zigbee -laitteita. [Zigbee2MQTT](https://www.zigbee2mqtt.io/):n käyttöliittymä löytyy osoitteesta `http://x.x.x.x:8080`, jossa `x.x.x.x` on sen koneen IP-osoite, jolle [Zigbee2MQTT](https://www.zigbee2mqtt.io/) on asennettu.

