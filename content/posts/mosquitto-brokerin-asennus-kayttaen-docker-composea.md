---
title: "Mosquitto-brokerin asennus käyttäen Docker-Composea"
date: "2022-09-13"
categories: 
  - "docker"
  - "docker-compose"
  - "home-assistant"
  - "linux"
  - "mqtt"
tags: 
  - "homeassistant"
  - "mosquitto"
  - "mosquitto-broker"
  - "ruuvitag"
  - "ruuvitag-discovery"
  - "zigbee"
  - "zigbee2mqtt"
  - "zwave"
  - "zwavejs2mqtt"
---

Seuraavaksi asennamme [mosquitto-brokerin](https://mosquitto.org/) [Docker-Composen](https://docs.docker.com/compose/) avulla. [Mosquitto-brokeria](https://mosquitto.org/) tarvitaan hoitamaan ns. "keskustelu" -yhteyttä, jotta voimme lisätä [Home Assistanttiin](https://www.home-assistant.io/) [zigbee](https://en.wikipedia.org/wiki/Zigbee)\-, [z-wave](https://en.wikipedia.org/wiki/Z-Wave)\- ja [ruuviTag](https://ruuvi.com/fi/) -laitteita käyttäen [Zigbee2MQTT](https://www.zigbee2mqtt.io/)\-, [Zwavejs2Mqtt](https://zwave-js.github.io/zwavejs2mqtt/#/)\- ja [RuuviTag Discovery](https://github.com/balda/ruuvitag-discovery) \-ohjelmistoja, jotka kommunikoivat käyttäen [MQTT](https://mqtt.org/) -protokollaa.

### Mosquitto-brokerin asennus

[Mosquitto-brokerin](https://mosquitto.org/) asennus menee aika lailla samaan tapaan kuin aikaisemmat [Docker-Composen](https://docs.docker.com/compose/) avulla tehdyt asennukset eli aluksi luodaan `mosquittoa` varten hakemisto [Docker-Composen](https://docs.docker.com/compose/) asennushakemistoon eli ajetaan seuraavat komennot

```
cd /home/pi/docker-data
mkdir mosquitto
cd mosquitto
```

Seuraavaksi luodaan `docker-compose.yaml` -tiedosto komennolla `nano docker-compose.yaml` ja kopioidaan tiedostoon seuraavat tiedot:

```
version: "3"
services:
  mosquitto:
    image: eclipse-mosquitto
    network_mode: host
    volumes:
      - /home/pi/docker-data/mosquitto/config:/mosquitto/config
      - /home/pi/docker-data/mosquitto/data:/mosquitto/data
      - /home/pi/docker-data/mosquitto/log:/mosquitto/log
```

Seuraavaksi meidän täytyy vielä luoda hakemistoon `/home/pi/docker-data/mosquitto/config` tiedosto nimeltään `mosquitto.conf` ja luodaan se komennolla `nano /home/pi/docker-data/mosquitto/config/mosquitto.conf` ja kopioidaan tiedostoon tiedot:

```
persistence true
persistence_location /mosquitto/data/
log_dest file /mosquitto/log/mosquitto.log
listener 1883
## Authentication ##
# allow_anonymous false
password_file /mosquitto/config/password.txt
```

Seuraavaksi luodaan vielä käyttäjä `mosquitto` komennolla

```
docker-compose exec mosquitto mosquitto_passwd -c /mosquitto/config/password.txt mosquitto
```

Tämän [mosquitto-broker](https://mosquitto.org/) jälkeen voidaan käynnistää komennolla

```
docker-compose up -d
```

Nyt meillä pitäisi olla [mosquitto-broker](https://mosquitto.org/) käynnissä ja seuraavaksi voidaan [Home Assistantissa](https://www.home-assistant.io/) ottaa käyttöön [mosquitto](https://www.home-assistant.io/docs/mqtt/broker/) -integraatio.

Seuraavissa kirjoituksissa käydään läpi tarkemmin [Zigbee2MQTT](https://www.zigbee2mqtt.io/), [Zwavejs2Mqtt](https://zwave-js.github.io/zwavejs2mqtt/#/) ja [Ruuvitag Discoveryn](https://github.com/balda/ruuvitag-discovery) asennuksia, joilla saamme lisättyä [Home Assistanttiin](https://www.home-assistant.io/) [zigbee](https://en.wikipedia.org/wiki/Zigbee)\-, [z-wave](https://en.wikipedia.org/wiki/Z-Wave)\- ja [ruuviTag](https://ruuvi.com/fi/) -sensorit yms. laitteet.

