---
title: "Näin rakennat oman kotiautomaatiojärjestelmän RaspberryPi:n ja Home Assistantin avulla"
date: "2023-02-01"
categories: 
  - "docker"
  - "docker-compose"
  - "duplicati"
  - "homeassistant"
  - "kotiautomaatio"
  - "mariadb"
  - "mqtt"
  - "raspberrypios"
  - "ruuvitag"
  - "ruuvitag-discovery"
  - "yleinen"
  - "zigbee"
  - "zigbee2mqtt"
  - "zwave"
tags: 
  - "docker"
  - "docker-compose"
  - "duplicati"
  - "homeassistant"
  - "kotiautomaatio"
  - "mariadb"
  - "mqtt"
  - "raspberrypi"
  - "raspberrypios"
  - "ruuvitag"
  - "ruuvitag-discovery"
  - "sqlite"
  - "zigbee"
  - "zigbee2mqtt"
  - "zwave"
---

Seuraavaksi ajattelin vetää yhteen aikaisempia kirjoituksia ja tehdä yhteenvedon siitä, miten kuka tahansa voi rakentaa oman kotiautomaatiojärjestelmän [RaspberryPi](https://www.raspberrypi.com/):n ja [Home Assistantin](https://www.home-assistant.io/) avulla.

Asennuksessa käyn läpi kaksi eri vaihtoehtoa eli vaihtoehto 1, joka on helppo asennus tai vaihtoehto 2, joka on haastavampi tapa. Tässä kirjoituksessä keskitytään enemmän vaihtoehtoon 2.

Mikäli [Home Assistantin](https://www.home-assistant.io/) pystyttää vaihtoehdon 1 mukaisesti, niin tällöin ei juurikaan tarvitse [Linux](https://en.wikipedia.org/wiki/Linux) -tuntemusta, mutta jos haluaa tehdä asioita [pääte](https://en.wikipedia.org/wiki/Terminal_emulator) -tasolla, niin tällöin on kuitenkin hyvä tietää jotakin [yaml](https://en.wikipedia.org/wiki/YAML) -kielestä. Tosin minullakaan ei ollut tästä sen enempää tietämystä, kun ensimmäisen kerran asensin [Home Assistantin](https://www.home-assistant.io/), mutta aikaa myöden tässä on sitä oppinut.

Jos taas on tietämystä [Linuxin](https://en.wikipedia.org/wiki/Linux) perusteista tai on ainakin halu oppia niitä, niin [Home Assistantin](https://www.home-assistant.io/) voi pystyttää helposti vaihtoehdon 2 mukaan eli tässä kirjoituksessa keskitytään enemmän tähän.

Tarvikkeet, joilla pääsee alkuun, ovat seuraavat:

- [RaspberryPi](https://www.raspberrypi.com/products/) -tietokone, versio 3, 3+ tai 4

- Raspiin sopiva virtalähde
    - HUOM! tavallinen kännykkälaturi ei ole suositeltava

- SD -muistikortti 32 Gb
    - HUOM! versiot 3+ ja 4 voivat buutata suoraan myös ulkoiselta SSD-levyltä

- verkkokaapeli, mutta yhteys toimii myös WLAN:in kautta
    - HUOM! WLAN asetukset täytyy tehdä jo [RaspberryPi Imager](https://www.raspberrypi.com/software/) -sovelluksessa

- toinen tietokone, jos yhteys otetaan [SSH](https://en.wikipedia.org/wiki/Secure_Shell):n kautta

- Näppäimistö, hiiri ja näyttö, mikäli ei oteta yhteyttä [SSH](https://en.wikipedia.org/wiki/Secure_Shell):n kautta

- Lisäksi myös jokin [Zigbee](https://en.wikipedia.org/wiki/Zigbee)\- tai [Zwave](https://en.wikipedia.org/wiki/Z-Wave) -mokkula, mikäli haluaa liittää järjestelmään näitä laitteita

## Vaihtoehto 1, helppo tapa

Ensimmäinen ja helpompi vaihtoehto pystyttää [Home Assistant](https://www.home-assistant.io/), on käyttää valmista käyttöjärjestelmää. [Home Assistantin](https://www.home-assistant.io/) käyttöjärjestelmän tarkempia asennusohjeita ja levykuvan voi noutaa [täältä](https://www.home-assistant.io/installation/). [Home Assistantin](https://www.home-assistant.io/) voi asentaa myös suoraan [RaspberryPi Imagerin](https://www.raspberrypi.com/software/) avulla, johon linkki [tässä](/posts/raspberrypiosn-asentaminen-ja-kayttoonotto/). Eli yhteenvetona on, että aluksi kirjoitetaan muistikortille käyttöjärjestelmän levykuva ja sen kortti kiinni Raspiin. Tämän jälkeen virrat päälle ja odottamaan, että käyttöjärjestelmä käynnistyy.

Käynnistymisen jälkeen mennään nettiselaimella ko. koneelle eli `http://x.x.x.x:8123`, jossa `x.x.x.x` on tämän koneen IP-osoite, jolle [Home Assistant](https://www.home-assistant.io/) on asennettu.

## Vaihtoehto 2, hiukan haastavampi tapa

Toisessa vaihtoehdossa käyn läpi sen toteutustavan, miten itse olen ottanut [Home Assistantin](https://www.home-assistant.io/) käyttöön eli asennetaan se [RaspberryPiOS](https://www.raspberrypi.com/software/) -käyttäjärjestelmään [Docker-Composen](https://docs.docker.com/compose/) avulla. Tämän asennustavan olen valinnut puhtaasti siitä syystä, että voin käyttää Raspia myös muuhun tarkoitukseen, kuin pelkästään [Home Assistantin](https://www.home-assistant.io/) pyörittämiseen.

#### 1\. RaspberryPiOS -käyttöjärjestelmän asennus

Ensimmäisenä asennamme [RaspberryPiOS](https://www.raspberrypi.com/software/) -käyttöjärjestelmän muistikortille ja tähän olen tehnyt ohjeen, joka löytyy [tämän](/posts/raspberrypiosn-asentaminen-ja-kayttoonotto/) linkin takaa. Asennuksen jälkeen laitetaan muistikortti Raspiin ja käynnistetään kone. Käynnistämisen jälkeen otetaan yhteys koneeseen SSH:n avulla tai vaihtoehtoisesti jos käytetään näyttöä, näppäimistöä ja hiirtä, niin yhteys on tällöin valmiina.

Koneen käynnistymisen jälkeen ajetaan seuraavat komennot, jotka tarkistavat ja asentavat järjestelmän uusimmat päivitykset eli

`sudo apt update && sudo apt upgrade -y`

#### 2\. Dockerin ja Docker-Composen asennus

Minulla [Home Assistant](https://www.home-assistant.io/) on asennettu [Docker-Composen](https://docs.docker.com/compose/) avulla eli seuraavaksi asennetaan [RasperryPiOS](https://www.raspberrypi.com/software/) -käyttöjärjestelmään [Docker](https://www.docker.com/) ja [Docker-Compose](https://docs.docker.com/compose/). Tähän löytyvät ohjeet [täältä](/posts/dockerin-ja-docker-composen-asennus-raspberrypios-kayttojarjestelmaan/).

#### 3\. Home Assistantin asennus Docker-Composen avulla

Sen jälkeen, kun [Docker](https://www.docker.com/) ja [Docker-Compose](https://docs.docker.com/compose/) on asennettu, niin seuraavaksi asennetaan [Home Assistant](https://www.home-assistant.io/) [Docker-Composen](https://docs.docker.com/compose/) avulla. Tähän olen tehnyt ohjeen, joka löytyy tämän [linkin](/posts/home-assistantin-asennus-docker-composen-avulla/) takaa.

Kun [Home Assistant](https://www.home-assistant.io/) on asentunut ja otettu käyttöön, seuraavaksi otetaan yhteys selaimen kautta samalla tavalla kuin vaihtoehto 1:ssä kirjoitettiin.

#### 4\. MariaDB:n käyttöön ottaminen SQLiten sijaan (ei pakollista)

[Home Assistant](https://www.home-assistant.io/) käyttää oletuksena [SQLite](https://sqlite.org/index.html) -tietokantaa ja pienissä kokonaisuuksissa se toimii hyvin. Mikäli järjestelmään tulee vähänkään enemmän laitteita, niin tällöin suosittelen ottamaan käyttöön [SQL](https://en.wikipedia.org/wiki/SQL) -tietokannan kuten esim. [MariaDB](https://mariadb.org/). Tämä siksi, että järjestelmän vikaherkkyys kasvaa [SQLite](https://sqlite.org/index.html) -tietokannan kanssa ja myöhemmin alkaa tulla sitten ongelmia. Ohjeet [MariaDB](https://mariadb.org/):n käyttöönottamiseksi löytyvät [tämän](/posts/mariadb-tietokannan-kayttoonotto-home-assistantissa/) linkin takaa.

#### 5\. Home Assistantin varmuuskopiointi (ei pakollista)

[Home Assistantista](https://www.home-assistant.io/) kannattaa myös ottaa varmuuskopiot aika ajoin ja tämä on ehkä yksi miinuspuoli, että varmuuskopiointi ja sen palautus ei toimi [Dockerin](https://www.docker.com/) tai [Docker-Composen](https://docs.docker.com/compose/) asennuksen kanssa kunnolla. Varmuuskopion voi tehdä [Home Assistantin](https://www.home-assistant.io/) kautta, mutta sen palauttaminen ei suoraan onnistu tätä kautta, vaan se täytyy tehdä esim. päätteen avulla.

Itse olen hoitanut varmuuskopioinnin asentamalla tälle samalle Raspille [Duplicati](https://www.duplicati.com/) -serverin, joka hoitaa [Home Assistantin](https://www.home-assistant.io/) varmuuskopioinnin. Tähän löytyy kirjoitus [tämän](/posts/docker-composen-avulla-asennetun-home-assistantin-varmuuskopiointi-duplicatin-avulla/) linkin takaa.

#### 6\. Muita asennuksia, joita olen tehnyt Home Assistantin yhteyteen

Muita asennuksia, joita olen tehnyt [Home Assistantin](https://www.home-assistant.io/) yhteyteen, ovat esim. [Mosquitto](https://mosquitto.org/) -brokerin -asennus, jonka avulla yhdistän mm. kaikki [Zigbee](https://en.wikipedia.org/wiki/Zigbee)\-, [Zwave](https://en.wikipedia.org/wiki/Z-Wave)\- ja [RuuviTag](https://ruuvi.com/fi/) -anturit järjestelmään käyttäen [MQTT](https://mqtt.org/) -protokollaa. [Mosquitto](https://mosquitto.org/) -brokerin asennuksen ohjeet löytyvät [täältä](/posts/mosquitto-brokerin-asennus-kayttaen-docker-composea/).

[RuuviTag](https://ruuvi.com/fi/) -antureiden lisäämisen järjestelmään olen hoitanut [ruuvitag-discovery](https://github.com/balda/ruuvitag-discovery) -ohjelmistoa käyttäen eli myös [RuuviTagit](https://ruuvi.com/fi/) lisätään järjestelmään [MQTT](https://mqtt.org/) -protokollaa käyttäen. Ohjeet tähän löytyvät [täältä](/posts/ruuvitag-antureiden-lisaaminen-home-assistantiin-ruuvitag-discoveryn-avulla-mqtt-protokollaa-kayttaen/).

[Zigbee](https://en.wikipedia.org/wiki/Zigbee) -laitteet olen lisännyt järjestelmään [Zigbee2MQTT](https://www.zigbee2mqtt.io/):n avulla eli myös nämä laitteeet yhdistyvät [MQTT](https://mqtt.org/) -protokollan avulla [Home Assistantiin](https://www.home-assistant.io/). Ohjeet tähän löytyvät [täältä](/posts/zigbee2mqtt-asentaminen-docker-composen-avulla/).

Lisäksi [blogeista](/posts/) löytyy kirjoituksia liittyen mm. sähkön hinnan seuraamiseen, autolämmityksen tekemiseen ja avoimen lähdekoodin virtuaaliavustimen käyttöön ottamiseen eli näitä voi halutessaan lukea sivustolta.

Tervetuloa lukemaan ja toivottavasti näistä olisi teille lukijoille apua. Mikäli koet niin sivuston linkkiä saa jakaa eteenpäin.

