---
title: "Almond-/Genie -virtuaaliavustimen lisääminen Home Assistantiin"
date: "2022-11-26"
categories: 
  - "almond-genie"
  - "docker"
  - "docker-compose"
  - "home-assistant"
  - "kotiautomaatio"
  - "node-js"
  - "ruuvitag"
  - "ruuvitag-discovery"
  - "virtuaaliavustin"
tags: 
  - "almond"
  - "amazon-alexa"
  - "genie"
  - "genie-server"
  - "google-assistant"
  - "homeassistant"
  - "kotiautomaatio"
  - "virtuaaliavustin"
---

Seuraavaksi ajattelin kirjoittaa [virtuaaliavustimen](https://fi.wikipedia.org/wiki/Luokka:Virtuaaliavustajat) käyttöön ottamisesta [Home Assistantissa](https://www.home-assistant.io/). [Home Assistantin](https://www.home-assistant.io/) saa konffattua käyttämään [Google Assistantin](https://assistant.google.com/) tai [Alexan](https://www.amazon.com/smart-home-devices/b?ie=UTF8&node=9818047011) kautta suoritettavia äänikomentoja, mutta ajattelin kokeilla, miten avoin vaihtoehto [Almond](https://www.home-assistant.io/integrations/almond)/[Genie](https://genie.stanford.edu/) toimii. Käytän jatkossa virtuaaliavustimesta nimeä [Genie](https://genie.stanford.edu/) vaikka [Home Assistantissa](https://www.home-assistant.io/) puhutaankin yleisesti [Almondista](https://www.home-assistant.io/integrations/almond/).

[Genie](https://genie.stanford.edu/) -virtuaaliavustin on [Stanford Open Virtual Assistant Labin](https://oval.cs.stanford.edu/) kehittämä avoin ja yksityisyyttä suojeleva virtuaaliassistentti. [Genietä](https://genie.stanford.edu/) on mahdollista käyttää myös pilvipohjaisena, mutta minä ajattelin kokeilla standalone -versiota, jonka voi asentaa omalle palvelimelle.

[Geniestä](https://genie.stanford.edu/) löytyy suoraan valmis lisäosa [Home Assistantin](https://www.home-assistant.io/) lisäosakaupasta, josta sen asennus onnistuisi helposti. Minulla [Home Assistant](https://www.home-assistant.io/) on kuitenkin asennettuna [Docker Composen](https://docs.docker.com/compose/) avulla, joten lisäosakauppa ei ole käytössä eli tämä tietää hiukan haasteellisempaa asennusta. Tarkemmin [Genien](https://genie.stanford.edu/) asentamisesta löytyy tietoa [Stanford University Open Virtual Assistant Lab](https://oval.cs.stanford.edu/):in Github sivulta, johon linkki [tässä](https://github.com/stanford-oval/genie-server#running-almond-server).

Suositeltava tapa asentaa [Genie](https://genie.stanford.edu/) olisi käyttää [Dockerin](https://www.docker.com/) vaihtoehtoista [Podman](https://podman.io/) -containeria. Ongelmaksi tulee se, että [Genie](https://genie.stanford.edu/) -serveristä ei löydy vaihtoehtoa Raspberry Pi:lle eli jäljelle jää vaihtoehto asentaa [Genie](https://genie.stanford.edu/) kehittäjä-versiosta. Minulla on jo valmiiksi asennettuna [nodejs](https://nodejs.org/en/), jota käytettiin [RuuviTagien](https://fasted.dy.fi/index.php/2022/09/ruuvitag-antureiden-lisaaminen-home-assistantiin-ruuvitag-discoveryn-avulla-mqtt-protokollaa-kayttaen/) asennuksen yhteydessä, joten sen asennusta ei tarvitse nyt erikseen suorittaa.

Asennus aloitetaan asentamalla tarvittavat paketit komennolla `sudo apt install nodejs gettext build-essential make g++ graphicsmagick zip unzip libpulse-dev`.

Seuraavaksi luodaan kopio GitHub -hakemistosta komennolla `git clone https://github.com/stanford-oval/genie-server` ja siirrytään ko. hakemistoon komennolla `cd genie-server`.

Lopuksi ajetaan komento `npm ci`, joka asentaa [Genie](https://genie.stanford.edu/) -serverin. Asentamisen jälkeen annetaan vielä komento `npm start`, joka käynnistää palvelimen.

Seuraavaksi kokeillaan, että palvelin toimii eli mennään selaimella osoitteeseen `http://x.x.x.x:3000`, jossa `x.x.x.x` on sen koneen IP-osoite, johon [Genie](https://genie.stanford.edu/) -server on asennettu. Aluksi luodaan palvelimelle salasana, jonka jälkeen kirjaudutaan palvelimelle sisään. Kirjautumisen jälkeen avautuu alla olevan mukainen ikkuna, josta nähdään myös muutama [Genielle](https://genie.stanford.edu/) annettu käsky.

![](/images/almond-genie-virtuaaliavustimen-lisaaminen-home-assistantiin/kuva1.png)

_Kuva: Almond eli Genie -server_

Nyt meillä on siis [Genie](https://genie.stanford.edu/) -server käynnissä ja seuraavaksi tehdään siitä automaattisesti käynnistyvä palvelu. Aluksi annetaan komento `sudo nano /etc/systemd/system/almond.service` ja lisätään sinne alla olevat rivit

```
[Unit]
Description=Almond-standalone server

[Service]
Type=simple
Restart=always
User=pi
WorkingDirectory=/home/pi/genie-server
ExecStart=/usr/bin/npm start

[Install]
WantedBy=multi-user.target
```

Seuraavaksi annetaan vielä komennot

```
sudo systemctl enable almond
sudo systemctl start almond
```

### Genie -serverin asetukset Home Assistantissa

Seuraavaksi tehdään [Home Assistantiin](https://www.home-assistant.io/) tarvittavat muutokset eli lisätään `configuration.yaml` -tiedostoon seuraavat rivit ja käynnisteään [Home Assistant](https://www.home-assistant.io/) uudestaan

```
#configuration.yaml
almond:
  type: local
  host: http://127.0.0.1:3000
```

Käynnistämisen jälkeen voidaan kokeilla [Genien](https://genie.stanford.edu/) ([Home Assistantissa](https://www.home-assistant.io/) [Almond](https://www.home-assistant.io/integrations/almond/)) toimintaa painamalla [Home Assistantin](https://www.home-assistant.io/) oikeasta ylälaidasta mikrofonikuvaketta

![](/images/almond-genie-virtuaaliavustimen-lisaaminen-home-assistantiin/kuva2.png)

_Kuva: Home Assistant virtuaaliavusti_men _käynnistyskuvake_

Tämän jälkeen meille avautuu virtuaaliavustajan ikkuna eli alalaidasta nähdään, että avustimena toimii [Almond](https://www.home-assistant.io/integrations/almond/)

![](/images/almond-genie-virtuaaliavustimen-lisaaminen-home-assistantiin/kuva3.png)

_Kuva: Home Assistant virtuaaliavustin_

Huomiona [Geniestä](https://genie.stanford.edu/), että se toimii englannin kielisenä samoin kuin [Google Assistant](https://assistant.google.com/) tai [Alexa](https://www.amazon.com/smart-home-devices/b?ie=UTF8&node=9818047011). [Genien](https://genie.stanford.edu/) sanavarasto ei tietenkään ole niin laaja kuin näissä kaupallisissa versioissa, mutta laitteiden komentaminen onnistuu myös tällä oikein mainiosti. Käytössä tulee huomoida, että mm. kytkimet ja sensorit on nimetty selkeästi, jotta virtuaaliavustin osaa niitä komentaa. [Genien](https://genie.stanford.edu/) komennoista löytyy tarkempi listaus palvelimen yläreunan `Cheatsheets` -kohdasta.

Seuraavassa kirjoituksessa kerron tarkemmin ääniohjauksen käyttöönotosta [Genien](https://genie.stanford.edu/) kanssa, mutta palataan tähän sitten myöhemmin.

