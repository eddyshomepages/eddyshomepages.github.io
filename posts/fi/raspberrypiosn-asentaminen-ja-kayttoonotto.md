---
title: "RaspberryPiOS:n asentaminen ja käyttöönotto"
date: "2023-01-13"
tags: 
  - "apertis"
  - "balena-etcher"
  - "batocera"
  - "chrony"
  - "gladysassistant"
  - "homeassistant"
  - "homebridge"
  - "lakka"
  - "libreelec"
  - "linux"
  - "mainsailos"
  - "manjaro"
  - "noobs"
  - "nymea"
  - "octopi"
  - "oktoklipperpi"
  - "openhab"
  - "osmc"
  - "raspberrymatic"
  - "raspberrypi"
  - "raspberrypi-imager"
  - "raspberrypios"
  - "recalbox"
  - "retropie"
  - "risc-os-pi"
  - "simplypi"
  - "ssh"
  - "ubuntu"
  - "volumio"
---

Minulla on käytössä [RaspberryPi](https://www.raspberrypi.com/) -tietokoneita monessa eri tarkoituksessa ja yleensä niissä on käyttöjärjestelmänä [RaspberryPiOS](https://www.raspberrypi.com/software/). Tähän liittyen ajattelinkin käydä läpi sen asentamista ja käyttöönottoa.

Aikaisemmin [RaspberryPiOS](https://www.raspberrypi.com/software/) ja sen edeltäjän Raspbianin sai asennettua `image` -tiedostosta esim. [Balena Etcher](https://www.balena.io/etcher/) -sovelluksella, mutta nykyisin se on ainakin hankalampaa, koska asetuksien teko käyttöjärjestelmälle on muuttunut vanhaan verrattuna. Nykyisin asennus onkin helpoin tehdä käyttäen [RaspberryPi Imager](https://www.raspberrypi.com/software/) -sovellusta, josta on tehty omat versiot Linuxille, Windowsille ja macOS-käyttikselle.

[RaspberryPi Imagerin](https://www.raspberrypi.com/software/) avulla pystyy asentamaan [RaspberryPiOS](https://www.raspberrypi.com/software/) -käyttöjärjestelmän myös ulkoiselle kiintolevylle, kuten SSD -levylle. Tämän jälkeen, kun kytkee ulkoisen SSD -levyn Raspin USB -porttiin, niin Raspi käynnistyy suoraan käyttöjärjestelmään ilman, että tarvitaan muistikorttia. Tämä siis Raspberry Pi 3+ ja 4 versioissa. Versiossa 3 pystyy myös ottamaan käynnistyksen käyttöön, mutta se vaatii vähän työtä, koska järjestelmän `/boot/config.txt` -tiedostoon täytyy tehdä muutoksia. Näitä vanhemmat Raspit eivät tue käynnistystä ulkoiselta kiintolevyltä tai massamuistilta.

### RaspberryPiOS:n asennus muistikortille

Asennuksen jälkeen käynnistetään [RaspberryPi Imager](https://www.raspberrypi.com/software/), jolloin avautuu alla oleva ikkuna

![](/images/raspberrypiosn-asentaminen-ja-kayttoonotto/kuva1.webp)

_Kuva: RaspberryPi Imager aloitusvalikko_

`Operating System` -kohdasta voidaan valita monipuolisesti erilaisia käyttöjärjestelmiä, joita [RaspberryPiOS](https://www.raspberrypi.com/software/):n lisäksi ovat [Ubuntu](https://ubuntu.com/download/raspberry-pi), [Manjaro Arm Linux](https://wiki.manjaro.org/index.php/Manjaro-ARM), [Apertis](https://www.apertis.org/) sekä [Risc OS Pi](https://www.riscosopen.org/content/downloads/raspberry-pi). Nämä muut käyttöjärjestelmät löytyvät `Other general-purpose OS` -kohdasta.

![](/images/raspberrypiosn-asentaminen-ja-kayttoonotto/kuva2.webp)

Sovelluksesta voidaan valita myös erilaisia `media player` -käyttöjärjestelmiä kuten [LibreElec](https://libreelec.tv/), [OSMC](https://osmc.tv/) tai [Volumio](https://volumio.com/en/) ja nämä löytyvät kohdasta `Media Player OS`.

Mikäli pitää vanhoista Emulaattoreista, löytyy näihinkin valmiita käyttöjärjestelmiä kuten [Lakka.tv](https://www.lakka.tv/), [Recalbox](https://www.recalbox.com/) tai [Retropie](https://retropie.org.uk/), tosin [Batocera](https://batocera.org/) puuttuu, mutta eiköhän sekin kohta valikosta löydy. Nämä löytyvät valikosta `Emulation and Game OS`.

Lisäksi löytyy vielä paljon muitakin distroja, kuten 3D -tulostukseen [OktoKlipperPi](https://github.com/guysoft/OctoKlipperPi), [SimplyPi](https://github.com/SimplyPrint/SimplyPi), [Mainsail OS](https://docs.mainsail.xyz/setup/mainsail-os) ja [OctoPi](https://octoprint.org/download/) sekä kotiautomaatiojärjestelmiä kuten kuten mm. [Home Bridge](https://homebridge.io/), [Gladys Assistant](https://gladysassistant.com/), [openHAB](https://www.openhab.org/), [Home Assistant](https://www.home-assistant.io/), [RaspberryMatic](https://raspberrymatic.de/) ja [nymea](https://nymea.io/).

Minulla on kyseessä RaspberryPi 3 -tietokone, jota on tarkoitus käyttää palvelimena eli minulle riittää `Raspberry Pi OS (other)` -kohdasta löytyvä `RaspberryPiOS Lite (64-bit)` -versio.

![](/images/raspberrypiosn-asentaminen-ja-kayttoonotto/kuva3.webp)

Käyttöjärjestelmän version valinnan jälkeen valitaan kohdasta `Storage` tallennuspaikka eli minulla `Transcend USB Device`

![](/images/raspberrypiosn-asentaminen-ja-kayttoonotto/kuva4.webp)

Ennen kuin tallennetaan levykuva muistikortille, niin avataan kuitenkin `Ratas` -kohdasta asetukset

![](/images/raspberrypiosn-asentaminen-ja-kayttoonotto/kuva5.webp)

`Asetukset` -kohdasta voidaan asettaa koneelle _hostname_, ottaa käyttöön _SSH -palvelin_ (erittäin suositeltavaa), asettaa _käyttäjätunnus_ ja _\-salasana_, tehdä _langattamon WIFI -verkon asetukset_ ja tehdä _lokaatio -asetukset_. Sen jälkeen, kun nämä asetukset on tehty, tallennetaan muutokset ja kirjoitetaan levykuva muistikortille painamalla `Write` -nappia. Kun tallennus on tehty ja tulee alla olevan kaltainen ilmoitus, voidaan muistikortti ottaa pois koneesta ja laittaa se Raspiin.

![](/images/raspberrypiosn-asentaminen-ja-kayttoonotto/kuva6.webp)

### RaspberryPi:n käynnistys ja asetuksien teko

Seuraavaksi laitetaan muistikortti kiinni Raspiin ja annetaan koneen käynnistyä rauhassa. Seuraavaksi voidaan tarkistaa esim. modeemista, että mikä on koneen IP-osoite. Linuxin puolella yhteys saadaan otettua `päätteen (terminal)` kautta, mutta myös Windowsin `komentokehote` tukee SSH:n käyttöä. Eli yhteys Raspiin saadaan antamalla esim. `komentokehotteessa` käsky `ssh pi@x.x.x.x`. Tämän jälkeen Raspi kysyy halutaanko muodostaa yhteys, johon tulee vastata `yes` (ensimmäinen kirjautuminen) ja antaa sen jälkeen asetuksissa määritetty salasana.

Itse olen huomannut, että jostakin syystä [RaspberryPiOS](https://www.raspberrypi.com/software/) ei osaa alussa päivittää kellonaikaa oikeaksi, jonka vuoksi myöskään päivityksien asennus ei onnistu. Koneen päivämäärä ja aika saa tarkastettua komennolla `timedatectl` ja mikäli kellonaika/päiväys näyttää mitä sattuu sekä rivillä `System clock synchronized:` lukee `no`, niin tällöin kellonaika asetuksia täytyy korjata. Itse olen nykyisin tehnyt sen siten, että olen korvannut oletus `ntp` -palvelimen `chrony` -nimisellä `ntp` -palvelimella.

Tämän asennus onnistuu komennolla `sudo apt install chrony`, jonka jälkeen järjestelmä haluaa asentaa/poistaa paketteja ja tähän voidaan vastata `yes`. Seuraavaksi tarkistetaan `chronyn` asetukset komennolla `sudo nano /etc/chrony/chrony.conf`. Asetustiedostoon laitetaan alla olevat rivit, jotka tarkoittavat sitä, että järjestelmä käyttää Suomen [NTP pool](https://en.wikipedia.org/wiki/NTP_pool) -palvelimia.

```
server 0.fi.pool.ntp.org iburst
server 1.fi.pool.ntp.org iburst
server 2.fi.pool.ntp.org iburst
server 3.fi.pool.ntp.org iburst
```

Lopuksi vielä tallennetaan muutokset, käynnistetään `chrony` uudestaan sekä tehdään siitä automaattisesti käynnistyvä eli annetaan komennot

```
sudo systemctl restart chrony
sudo systemctl enable chrony
```

Tämän jälkeen voidaan vielä tarkistaa komennolla `timedatectl`, että onko kellonaika asetukset kunnossa eli rivillä `System clock synchronized:` pitäisi olla `yes` sekä päivämäärän ja kellonajan pitäisivät olla nyt synkronoitu oikeaksi.

Lopuksi tarkistetaan ja asennetaan vielä järjestelmään viimeisimmät päivitykset ajamalla komento `sudo apt update && sudo apt upgrade -y`.

Nyt meillä on [RaspberryPiOS](https://www.raspberrypi.com/software/) -käyttis asennettu ja käyttöönotettu. Seuraavaksi voidaan vaikka selata aikaisemmin kirjoittamiani [blogeja](#posts) ja miettiä, että mitä koneelle seuraavaksi asentaisi.

