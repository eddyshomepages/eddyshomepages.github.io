---
title: "Home Assistantin asennus Docker-Composen avulla"
date: "2022-08-21"
categories: 
  - "docker"
  - "docker-compose"
  - "homeassistant"
  - "linux"
  - "raspberrypios"
tags: 
  - "docker"
  - "docker-compose"
  - "homeassistant"
  - "kotiautomaatio"
  - "zwave"
  - "zigbee2mqtt"
  - "zwavejs2mqtt"
---

Seuraavaksi päästään käsiksi yhteen lempiaiheistani eli kotiautomaatiojärjestelmät ja [Home Assistant](https://www.home-assistant.io/). Minulla itselläni on [Home Assistant](https://www.home-assistant.io/) asennettuna [Raspberry Pi 4](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/) -tietokoneelle siten, että tietokoneessa on käyttöjärjestelmänä [RaspberryPiOS](https://www.raspberrypi.com/software/) ja [Home Assistant](https://www.home-assistant.io/) on asennettu [Docker-Composen](https://docs.docker.com/compose/) avulla.

[Docker](https://www.docker.com/) -asennuksessa on mm. se haittapuoli, että nämä lisäosat eivät ole käytössä samalla tavalla kuin [Home Assistantin](https://www.home-assistant.io/) omassa käyttöjärjestelmässä. Samoin myös varmuuskopiointi ei toimi samalla tavalla, mutta näihinkin löytyy kyllä kuitenkin ratkaisut. Mielestäni etuna [Docker](https://www.docker.com/)\-asennuksessa on kuitenkin se, että tietokoneen resursseja voi helpommin käyttää myös muuhunkin.

Tässä kirjoituksessa käydään siis läpi [Home Assistantin](https://www.home-assistant.io/) asennus [Docker-Composen](https://docs.docker.com/compose/) avulla. Itselläni ei ollut oikeastaan juurikaan kokemusta [Dockerista](https://www.docker.com/) tai [Docker-Composesta](https://docs.docker.com/compose/) ennen tätä asennusta, mutta sen jälkeen olen asentanut [Docker-Composen](https://docs.docker.com/compose/) avulla mm. [Baikal](https://sabre.io/baikal/) -kalenteripalvelimen, [Matrix](https://matrix.org/) -pikaviestipalvelimen, [Dublicati](https://www.duplicati.com/) -varmuuskopiointi -palvelimen sekä [Home Assistantille](https://www.home-assistant.io/) [Z-Wave](https://en.wikipedia.org/wiki/Z-Wave) lisäosan [ZWavejs2Mqtt](https://zwave-js.github.io/zwavejs2mqtt/#/):n avulla.

Nykyään pyrin asentamaan ohjelmistot [Docker-Composen](https://docs.docker.com/compose/) avulla, mikäli se vain on mahdollista. Vanhoja asennuksia kuten [Mosquitto](https://mosquitto.org/) -palvelin tai [MariaDB](https://mariadb.org/) -palvelin, jotka ovat asennettu ohjelmistolähteistä, en ole lähtenyt muuttamaan, mutta nämäkin pystyy asentamaan myös [Docker-Composen](https://docs.docker.com/compose/) avulla. Käydään läpi näitä muita asennuksia sitten erikseen seuraavissa kirjoituksessa.

### Home Assistantin asennus

Ennen [Home Assistantin](https://www.home-assistant.io/) asennusta meillä pitäisi olla asennettuna [Docker](https://www.docker.com/) ja [Docker-Compose](https://docs.docker.com/compose/). Näiden asennuksesta kirjoitin jokin aika sitten kirjoituksessa "[Dockerin ja Docker-Composen asennus RaspberryPiOS -käyttöjärjestelmään](https://fasted.dy.fi/index.php/2022/08/dockerin-ja-docker-composen-asennus-raspberrypios-kayttojarjestelmaan/)", josta voi tarvittaessa kerrata asennusta.

Asennus on aika selkeä, aluksi täytyy luoda hakemisto, johon nämä [Docker-Composen](https://docs.docker.com/compose/) asetus- ym. tiedostot tallennetaan. Tämä voi sijaita esim. kotihakemistossa ja tässä asennuksessa luodaan hakemisto nimeltään `docker-data` kotihakemistoon eli komento menee

`mkdir docker-data`

Seuraavaksi luodaan `docker-data` -hakemistoon kansio `homeassistant`, jonne [Docker-Compose](https://docs.docker.com/compose/) tallentaa tarvittavat tiedostot eli

`cd docker-data`

`mkdir homeassistant`

Sitten siirrytään kansioon

`cd homeassistant`

Tämän jälkeen luodaan `homeassistant` -kansioon [Docker-Composen](https://docs.docker.com/compose/) asetustiedosto eli

`nano docker-compose.yaml`

Tähän tiedostoon kopioidaan alla olevat tiedot eli

```
version: '3'
services:
  homeassistant:
    container_name: homeassistant
    image: "ghcr.io/home-assistant/home-assistant:stable"
    volumes:
      - /home/pi/docker-data/homeassistant/:/config
      - /etc/localtime:/etc/localtime:ro
    restart: unless-stopped
    privileged: true
    network_mode: host
```

Tämän jälkeen ajetaan vielä komento

`docker-compose up -d`

Kun [Docker-Compose](https://docs.docker.com/compose/) on hakenut tarvittavat paketit ja on käynnistynyt, niin sen jälkeen meillä on asennus valmiina. Tämän jälkeen jatketaan asennusta nettiselaimen kautta eli mennään osoitteeseen `http://x.x.x.x:8123`, jossa x.x.x.x on oman tietokoneesi IP-osoite, johon [Home Assistant](https://www.home-assistant.io/) on asennettu.

Mikäli sinulla on käytössä [Z-Wave](https://en.wikipedia.org/wiki/Z-Wave) tai [Zigbee](https://en.wikipedia.org/wiki/Zigbee) -mokkula, täytyy `docker-compose.yaml` -tiedostoon lisätä vielä seuraavat rivit eli

```
version: '3'
  services:
    homeassistant:
    ...
    devices:
      - /dev/ttyUSB0:/dev/ttyUSB0
```

[Home Assistantin](https://www.home-assistant.io/) päivitys hoituu jatkossa ajamalla komento `docker-compose pull` ja `docker-compose up -d` tässä samassa hakemistossa, jossa sijaitsee `docker-compose.yaml` \-tiedosto.

