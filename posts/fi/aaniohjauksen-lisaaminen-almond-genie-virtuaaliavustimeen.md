---
title: "Ääniohjauksen lisääminen Almond-/Genie -virtuaaliavustimeen"
date: "2022-09-12"
tags: 
  - "almond"
  - "genie"
  - "genie-client"
  - "genie-server"
  - "homeassistant"
  - "kotiautomaatio"
  - "raspberrypi"
  - "raspberrypios"
  - "virtuaaliavustin"
---

Edellisessä [kirjoituksessa](#post/almond-genie-virtuaaliavustimen-lisaaminen-home-assistantiin) kävimme läpi [Almond](https://www.home-assistant.io/integrations/almond)\-/[Genie](https://genie.stanford.edu/) -virtuaaliavustimen asentamista [Home Assistantin](https://www.home-assistant.io/) yhteyteen. Seuraavaksi olisi tarkoitus kokeilla, että miten myös ääniohjauksen saisi toimimaan [Almond](https://www.home-assistant.io/integrations/almond)\-/[Genie](https://genie.stanford.edu/) -virtuaaliavustimen kanssa. Ääniohjausta varten meidän tarvitsee asentaa [Genie-client](https://wiki.genie.stanford.edu/getting-started/installation-guide) -paketti, josta löytyy valmis `.deb` -paketti [Debian](https://www.debian.org/) pohjaisille käyttöjärjestelmille. Muille käyttöjärjetelmille [Genie-client](https://wiki.genie.stanford.edu/getting-started/installation-guide) täytyy asentaa lähdekoodin kautta.

Minulla on alustana [RaspberryPi](https://www.raspberrypi.org/) -tietokoneen [1\. Model B](https://www.sparkfun.com/products/retired/11546) -versio, joten [Genie-client](https://wiki.genie.stanford.edu/getting-started/installation-guide) -paketti asennetaan [RaspberryPi](https://www.raspberrypi.org/):lle tehdyn [ohjeen](https://wiki.genie.stanford.edu/getting-started/installation-guide/raspberry-pi-speaker) mukaisesti. [Genie-client](https://wiki.genie.stanford.edu/getting-started/installation-guide) on myös sen verran kevyt, että sen pystyy asentamaan [Raspberry Pi 1 Model B](https://www.sparkfun.com/products/retired/11546) -koneelle ja näin minulla on myös tarkoitus tehdä. Käyttöjärjestelmänä Raspille on asennettuna [RaspberryPiOS](https://www.raspberrypi.com/software/) -käyttöjärjestelmä. Lisäksi minulla on käytössä USB-väyläinen mikrofoni sekä kaiuttimet, jotka on yhdistetty Raspin 3,5 mm [jack](https://fi.wikipedia.org/wiki/Jakkiliitin) -liittimeen. Vaihtoehtoisesti Raspiin voisi liittää myös USB-väyläisen äänikortin, johon saisi kytkettyä sekä mikrofonin että äänen ulostulon kaiuttimille 3,5 mm [jack](https://fi.wikipedia.org/wiki/Jakkiliitin) -liittimillä.

### Genie-clientin asennus ja konfigurointi

Asennus aloitetaan aluksi valitsemalla oikea asennuspaketti ja meillä kyseessä on [Raspberry Pi 1 Model B](https://www.sparkfun.com/products/retired/11546), niin haetaan asennuspaketti komennolla `wget https://almond-static.stanford.edu/releases/raspios/bullseye/genie-client_0.1.0_armhf.deb`. Seuraavaksi asennetaan tarvittavat muut paketit komennolla `sudo apt install gstreamer1.0-alsa` , jonka jälkeen asennetaan [Genie-client](https://wiki.genie.stanford.edu/getting-started/installation-guide) komennolla `sudo apt install ./genie-client_0.1.0_armhf.deb`. Mikäli järjestelmä tarjoaa muita paketteja asennettavaksi, niin ne voi myös asentaa.

Nyt meillä asennettuna tarvittavat paketit, jonka jälkeen voidaan tehdä tarvittavat asetukset järjestelmään. Aluksi ajetaan komento `sudo nano /etc/pulse/default.pa` ja lisätään tietoston loppuun alla olevat rivit

```
load-module module-echo-cancel source_name=echosrc sink_name=echosink aec_method=speex
load-module module-role-ducking trigger_roles=voice-assistant ducking_roles=music volume=20% global=true
```

Lopuksi käynnistetään vielä kone uudestaan, jonka jälkeen voimme kokeilla, että miten [Genie-client](https://wiki.genie.stanford.edu/getting-started/installation-guide) toimii eli annetaan komento `genie-client`, jolloin [Genie-Clientin](https://wiki.genie.stanford.edu/getting-started/installation-guide) pitäisi käynnistyä. Kun [Genie-client](https://wiki.genie.stanford.edu/getting-started/installation-guide) on käynnistynyt, voidaan se yhdistää [Genie-serveriin](https://wiki.genie.stanford.edu/getting-started/installation-guide) seuraavasti eli aluksi kirjaudutaan [Genie-serverille](https://wiki.genie.stanford.edu/getting-started/installation-guide) ja valitaan oikeasta yläreunasta kohta `Configuration` (kuva alla).

![](/images/aaniohjauksen-lisaaminen-almond-genie-virtuaaliavustimeen/kuva1.png)

_Kuva: Genie-server_

`Configuration` -sivulla selataan loppuun kohtaan `External Clients`, josta saamme tarvittavat tiedot [Genie-clientille](https://wiki.genie.stanford.edu/getting-started/installation-guide)

![](/images/aaniohjauksen-lisaaminen-almond-genie-virtuaaliavustimeen/kuva2.png)

_Kuva: Genie-server asetukset_

Seuraavaksi avataan [Genie-clientin](https://wiki.genie.stanford.edu/getting-started/installation-guide) konffausikkuna eli mennään selaimella osoitteeseen `http://x.x.x.x:8000`, jolloin meillä avautuu alla olevan mukainen näkymä (ja `x.x.x.x` on taas sen koneen IP-soite, jolle [Genie-client](https://wiki.genie.stanford.edu/getting-started/installation-guide) on asennettu)

![](/images/aaniohjauksen-lisaaminen-almond-genie-virtuaaliavustimeen/kuva3.png)

_Kuva: Genie-client asetukset_

Tällä sivulla annamme kohtaan `URL` [Genie-serveriltä](https://wiki.genie.stanford.edu/getting-started/installation-guide) saatu URL-tieto, valitaan `Authentication Mode` -kohdan alasvetovalikosta `Genie Server (standalone)`, kopioidaan kohtaan `Access Token` serveriltä vastaava merkkisarja ja lopuksi annetaan vielä [Genie-clientille](https://wiki.genie.stanford.edu/getting-started/installation-guide) `Conversation ID` kohtaan nimi, jonka tulee olla eri clienteille oma. Ja lopuksi tallennetaan tiedot, jonka jälkeen [Genie-clientin](https://wiki.genie.stanford.edu/getting-started/installation-guide) asetukset ovat valmiit.

Lopuksi tehdään vielä tehdä [Genie-clientista](https://wiki.genie.stanford.edu/getting-started/installation-guide) automaattisesti käynnistyvä palvelu, joka tulee ajaa käyttäjänä eli aluksi annetaan komento `nano ~/.config/systemd/user/genie-client.service`, kopiodaan tiedostoon alla olevat rivit sekä lopuksi tallennetaan tiedot

```
[Unit]
Description=GenieClient
After=network.target

[Service]
ExecStart=/usr/bin/genie-client
Restart=always

[Install]
WantedBy=default.target
```

Seuraavaksi luodaan vielä tyhjä tiedosto `` `genie-client.timer` `` komennolla `touch ~/.config/systemd/user/genie-client.timer` ja ajetaan komennot

```
systemctl --user enable genie-client.service
systemctl --user start genie-client.service
```

Nyt meillä on virtuaaliavustimen yhteyteen luotu ääniohjaus eli seuraavaksi sitten vain opettelemaan ääniohjauskomentojen antamista. Virtuaaliavustimen saa herätettyä komennolla `Hey Genie`, jonka perään annetaan haluttu komento. Komennoista löytyy kattava yhteenveto [Genie-serverin](https://wiki.genie.stanford.edu/getting-started/installation-guide) `Cheatsheet` -kohdasta, kuva alla

![](/images/aaniohjauksen-lisaaminen-almond-genie-virtuaaliavustimeen/kuva4.png)

_Kuva: Genie-server Cheatsheet_

[Genie](https://wiki.genie.stanford.edu/en/getting-started/intro-genie) -virtuaaliavustin on mielestäni muutoin oikein hyvä, mutta ainakaan itse en ole vielä keksinyt, että miten saisin annettua sille sijaintitiedot sellaisessa muodossa, että järjestelmä sen ymmärtäisi. Olen itse ymmärtänyt, että tiedot pitäisi antaa englannin kielisenä, jotta se osaisi hakea sijainnin oikein. Mikäli sinulla on tästä tietoa, niin laita ihmeessä viestiä vaikka kommentilla, jolloin saadaan se myös muillekin tiedoksi.

