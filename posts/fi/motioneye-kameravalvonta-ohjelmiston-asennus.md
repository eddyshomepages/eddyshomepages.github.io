---
title: "MotionEye kameravalvonta -ohjelmiston asennus"
date: "2023-05-21"
tags: 
  - "halytysjarjestelma"
  - "homeassistant"
  - "kotiautomaatio"
  - "linux"
  - "motioneye"
  - "python"
  - "raspberrypi"
  - "raspberrypios"
  - "rtsp"
---

Tässä kirjoituksessa ajattelin kirjoittaa [MotionEye](https://github.com/motioneye-project) -kameravalvonta -ohjelmiston asennuksesta [RaspberryPi 3](https://fi.wikipedia.org/wiki/Raspberry_Pi) -tietokoneelle. [MotionEye](https://github.com/motioneye-project) on myös siitä mukava, että se toimii [Home Assistantin](https://www.home-assistant.io/) kanssa hyvin yhteen ja kameroista saa tehtyä esim. liiketunnistimet [Home Assistantiin](https://www.home-assistant.io/) samalla, kun ne hoitavat kameran virkaa.

Toki näitä vastaavia kameravalvonta -ohjelmistoja on muitakin, kuten esim. [ZoneMinder](https://zoneminder.com/), [Shinobi](https://shinobi.video/) ja [Agent DVR](https://www.ispyconnect.com/download.aspx) (ent. iSpy), jotka toimivat myös hyvin [Home Assistantin](https://www.home-assistant.io/) kanssa.

[MotionEye](https://github.com/motioneye-project) -sovelluksen on alun perin kehittänyt [Calin Crisan](https://github.com/ccrisan), joka ei enää jatka ohjelmiston kehittämistä, vaan kehityksestä vastaa jatkossa uusi [tiimi](https://github.com/orgs/motioneye-project/people). Tällä hetkellä [MotienEye](https://github.com/motioneye-project):stä on tarjolla tosin vielä versio, joka käyttää vanhempaa [Python 2](https://www.python.org/download/releases/2.0/) -versiota, mutta jatkossa ohjelma on tarkoitus kääntää [Python 3](https://www.python.org/downloads/) -versiolle.[](https://github.com/motioneye-project)

[MotionEye](https://github.com/motioneye-project) -ohjelmistosta löytyy myös valmis levy-image [MotionEyeOS](https://github.com/motioneye-project/motioneyeos), jonka voi kopioida muistikortille, laittaa kortin kiinni Raspiin ja laittaa virrat päälle, niin sen jälkeen on kameravalvonta -palvelin valmiina käyttöön.

#### Järjestelmän päivittäminen ja tarvittavien sovellusten asentaminen

Minulla Raspi on myös muussa käytössä, joten asennan ohjelmiston erikseen järjestelmään. Asennukseen löytyvät tarkemmat asennusohjeet projektin [Wiki](https://github.com/motioneye-project/motioneye/wiki/Installation) -sivuilta, josta niitä voi tarkemmin katsoa. Minulle käyttiksenä on [RaspberryPiOS](https://www.raspberrypi.com/software/):n Bullseye -versio, jonka asentamisesta ja konffaamisesta löytyy vanha kirjoitus [täältä](https://fasted.dy.fi/index.php/2023/01/raspberrypiosn-asentaminen-ja-kayttoonotto/).

Ja vaikka minulla onkin käytössä Raspi, niin asennan [MotionEye](https://github.com/motioneye-project):n kuitenkin [Debian 11](https://www.debian.org/releases/bullseye/) (Bullseye) -asennusohjeen mukaisesti eli asennus menee [Wiki](https://github.com/motioneye-project/motioneye/wiki/Install-on-Debian-11-(Bullseye)) -sivuston perusteella aika lailla seuraavasti, mutta tarkistetaan ja asennetaan aluksi kuitenkin mahdolliset päivitykset komennolla

```
sudo apt update && sudo apt upgrade
```

Seuraavaksi asennetaan tarvittavat muut sovellukset eli annetaan komento

```
sudo apt install python2 curl motion ffmpeg v4l-utils python-dev-is-python2 python-setuptools libssl-dev libcurl4-openssl-dev libjpeg-dev zlib1g-dev libffi-dev libzbar-dev libzbar0
```

Seuraavaksi suljetaan ja poistetaan _motion_ -sovellus käytöstä komennoilla

```
sudo systemctl stop motion
sudo systemctl disable motion
```

Tämän jälkeen haetaan ja asennetaan [Pythoniin](https://pypi.org/project/pip/) _pip_ -niminen sovellus komennoilla

```
sudo curl https://bootstrap.pypa.io/pip/2.7/get-pip.py --output get-pip.py
sudo python2 get-pip.py
```

#### MotionEye:n asentaminen

Seuraavaksi asennetaan [MotionEye](https://github.com/motioneye-project) komennolla (komento asentaa automaattisesti myös muut tarvittavat paketit, joita ovat _tornado, jinja2, pillow_ ja _pycurl_)

```
sudo pip install motioneye
```

Asennuksen jälkeen tehdään vielä tarvittavat muutokset järjestelmään eli aluksi luodaan hakemisto _motioneye_ hakemistoon _/etc_ sekä kopioidaan hakemistoon _motioneye.conf_ \-tiedosto komennoilla

```
sudo mkdir -p /etc/motioneye
sudo cp /usr/local/share/motioneye/extra/motioneye.conf.sample /etc/motioneye/motioneye.conf
```

Seuraavaksi luodaan medialle oma hakemisto komennolla

```
sudo mkdir -p /var/lib/motioneye
```

Lopuksi vielä tehdään [MotionEye](https://github.com/motioneye-project/motioneye):stä automaattisesti käynnistyvä palvelin eli annetaan komennot

```
sudo cp /usr/local/share/motioneye/extra/motioneye.systemd-unit-local /etc/systemd/system/motioneye.service
sudo systemctl daemon-reload
sudo systemctl enable motioneye
sudo systemctl start motioneye
```

Tarvittaessa [MotionEye](https://github.com/motioneye-project) -sovelluksen saa päivitettyä komennolla

```
sudo pip install motioneye --upgrade
sudo systemctl restart motioneye
```

#### MotionEye:n konfigurointi

Nyt on [MotionEye](https://github.com/motioneye-project) asennettu ja seuraavaksi avataan [MotionEye](https://github.com/motioneye-project) -palvelin webbi-selaimessa eli tämä tapahtuu siten, että avataan selaimessa osoite _http://x.x.x.x:8765_, jossa _x.x.x.x_ on sen tietokoneen IP-osoite, johon [MotionEye](https://github.com/motioneye-project) on asennettu.

Järjestelmän kaikki konfigurointi sekä kameroiden lisääminen järjestelmään tapahtuu webbi-selaimen kautta ja [MotionEye](https://github.com/motioneye-project) tukee mm. Raspiin liitettävää omaa kameraa sekä erilaisia [IP](https://fi.wikipedia.org/wiki/Valvontakamera)\- kameroita, jotka lähettävät kuvaa [rtsp](https://fi.wikipedia.org/wiki/RTSP) -protokollaa käyttäen.

Kameroista löytyy hyvä tietokokanta iSpy -sivustolta osoitteesta [https://www.ispyconnect.com/cameras](https://www.ispyconnect.com/cameras) ja täältä melkein kannattaa katsoa oman kameran osalta kameran käyttämä protokolla ja striimin osoite.

Esimerkiksi D-linkin kameroihin löytyy nettisivulta [https://www.ispyconnect.com/camera/d-link](https://www.ispyconnect.com/camera/d-link) tieto, että esim. DCS 4701E -mallisen kameran käyttämä protokolla on [rtsp](https://fi.wikipedia.org/wiki/RTSP) ja striimin osoite _live3.sdp_ eli omassa verkossa tämä kamera pitäisi löytyä osoitteesta _rtsp://x.x.x.x/live3.sdp_.

Seuraavissa kirjoituksissa kerron sitten tarkemmin, että miten [MotionEye](https://github.com/motioneye-project) -järjestelmään liitetystä kamerasta saadaan tehtyä liiketunnistimen ja liitettyä se [Home Assistant](https://www.home-assistant.io/) -pohjaiseen hälytysjärjestelmään.

