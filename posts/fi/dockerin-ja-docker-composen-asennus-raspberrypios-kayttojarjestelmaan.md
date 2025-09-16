---
title: "Dockerin ja Docker-Composen asennus RaspberryPiOS -käyttöjärjestelmään"
date: "2022-08-02"
tags:
  - "baikal"
  - "docker"
  - "docker-compose"
  - "duplicati"
  - "homeassistant"
  - "matrix-synapse"
  - "raspberrypios"
---


Olen alkanut itse nyt enemmän ja enemmän käyttämään Dockeria ja Docker-Composea ja niiden avulla olen mm. asentanut [HomeAssistantin](https://www.home-assistant.io/), [Matrix Synapse](https://matrix.org/docs/projects/server/synapse) -palvelimen, [Baikal](https://sabre.io/baikal/) -kalenteripalvelimen sekä [Duplicati](https://github.com/duplicati/duplicati) -varmuuskopiopalvelimen käyttöön, mutta palataan näihin erikseen toisessa kirjoituksessa ja käydään tässä vähän läpi Dockerin ja Docker-Composen asennusta RaspberryPiOS -käyttöjärjestelmään.

Lähtökohtaisesti meillä on siis valmiiksi asennettuna RaspberryPiOS -käyttöjärjestelmä RaspberryPi -tietokoneelle, jonka asennusta en tässä käy läpi tarkemmin, koska asentamiseen löytyvät hyvät ohjeet [RaspberryPi](https://www.raspberrypi.com/software/) -sivustolta.

Ennen Dockerin asennusta kuitenkin asennetaan viimeisimmät päivitykset käyttöjärjestelmään seuraavalla komennolla

```
sudo apt update && sudo apt upgrade
```

Dockerin asennus aloitetaan hakemalla asennusskripti komennolla 

```
curl -fsSL https://get.docker.com -o get-docker.sh
```

Seuraavaksi asennetaan Docker suorittamalla asennusskripti

```
sudo sh get-docker.sh
```

Dockerin asennuksen jälkeen lisätään RaspberryPiOS -käyttöjärjestelmän oletuskäyttäjä `pi` ryhmään `docker` komennolla

```
sudo usermod -aG docker pi
```

Dockerin versio voidaan tarkastaa komennolla

```
docker version
```

Sekä tarkemmat tiedot Dockerista komennolla

```
docker info
```

Paras tapa tarkastaa, että Docker on asentunut kunnolla, on asentaa `hello-world` -kontti komennolla

```
docker run hello-world
```

Mikäli `hello-world` -kontti asentui oikein ilman virheilmoituksia, niin tällöin meillä on kaikki valmiina Docker-Composen asennusta varten.

#### Docker Composen asennus

Docker Compose voidaan asentaa eri tavoin, mutta tässä tapauksessa asennamme sen `pip3` avulla. Tämä vaatii, että sinulla on asennettuna `python3` sekä lisäksi myös `python3-pip` -paketit. Tätä varten tarvittavat paketit saadaan asennettua komennolla

```
sudo apt-get install libffi-dev libssl-dev python3-dev python3 python3-pip -y
```

Docker Compose saadaan asennettua komennolla

```
pip3 install docker-compose
```

Docker-Composen asennettu versio voidaan tarkastaa komennolla

```
docker-compose --version
```
Ja lopuksi on vielä tärkeää ajaa komento

```
sudo systemctl enable docker
```
Tämä varmistaa, että Docker käynnistyy automaattisesti myös sen jälkeen, kun kone käynnistetään uudelleen.
