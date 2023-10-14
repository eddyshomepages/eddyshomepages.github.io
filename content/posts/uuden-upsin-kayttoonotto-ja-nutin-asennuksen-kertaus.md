---
title: "Uuden UPS:in käyttöönotto ja NUT:in asennuksen kertaus"
date: "2022-07-16"
categories: 
  - "debian"
  - "linux"
  - "raspberrypios"
  - "ups"
tags: 
  - "armbian"
  - "debian"
  - "nut"
  - "raspberrypios"
  - "ups"
---

Tuli jokin aika sitten hankittua uusi [GreenCell](https://greencell.global/en/236-ups-and-agm-accumulators):in UPS vanhan tilalle, joka on tarkoitus viedä mökille suojaamaan Home Assistant (asennettu RaspberryPi -pikkutietokoneelle) sähkökatkojen varalta, joita siellä tuntuu vähän väliä olevan.

Ensimmäiseksi uuden UPS:in on annettu latautua täyteen ennen käyttöön ottoa. Minulla on jo aikaisemmin asennettu palvelinkoneelle NUT-server ([Network UPS Tools)](https://networkupstools.org/) hoitamaan kommunikointia UPS:in kanssa, mutta nyt täytyy päivittää sen asetukset vastaamaan uutta UPS:ia. Samalla voidaan kerrata NUT-serverin asennus ja konfigurointi alusta alkaen.

Minulla on käytössä palvelinkoneella Debian-käyttöjärjestelmä eli NUT-serveri saadaan asennettua helposti ohjelmistolähteiden kautta.

Aluksi ajetaan kuitenkin komento

```
sudo apt update
```

Seuraavaksi asennetaan tarvittavat tiedostot eli ajetaan komento

```
sudo apt install nut nut-server nut-client
```

Asennuksen jälkeen pitäisi hakemistosta `/etc/nut` löytyä alla olevat tiedostot, joita meidän täytyy muokata.

![](/images/uuden-upsin-kayttoonotto-ja-nutin-asennuksen-kertaus/kuva1.png)

Ensimmäiseksi muokataan tiedostoa `ups.conf` komennolla `sudo nano /etc/nut/ups.conf` ja laitetaan tiedoston loppuun tiedot UPS:sta. Itselläni on GreenCell:n UPS, joten minulla tiedosto näyttää seuraavalta:

![](/images/uuden-upsin-kayttoonotto-ja-nutin-asennuksen-kertaus/kuva2.png)

Hakasulkuihin laitetaan UPS:n nimi, jotta NUT tietää millä nimellä se tunnistaa UPS:n. Ajurina Green Cellin UPS:ssa on yleensä `blazer_usb`, mutta vanhassa UPS:ssa ajurina oli `usbhid-ups`.

Seuraavaksi muokataan tiedostoa `upsmon.conf` komennolla `sudo nano /etc/nut/upsmon.conf` ja laitetaan sinne tarvittavat tiedot käyttäjistä. Käyttäjiä ovat ns. `master` -käyttäjä UPS:in komentamista varten sekä `monitor` -käyttäjä UPS:in tilan tarkastamista varten. Kohtaan `secret` laitetaan jokin vahva salasana. Tästä myös huomataan, miten hakasuluissa ollutta UPS:n nimeä käytetään eli `greencell@localhost`.

![](/images/uuden-upsin-kayttoonotto-ja-nutin-asennuksen-kertaus/kuva3.png)

Seuraavaksi muokataan tiedostoa `upsd.conf` komennolla `sudo nano /etc/nut/upsd.conf` ja asetaan tänne tarvittavat tiedot, jotta NUT-server voi toimia verkossa eli osoite ja portti.

![](/images/uuden-upsin-kayttoonotto-ja-nutin-asennuksen-kertaus/kuva4.png)

Tämän jälkeen muutetaan vielä tiedostoa `nut.conf` komennolla `sudo nano /etc/nut/nut.conf` ja määritetään NUT toimimaan serverinä eli

![](/images/uuden-upsin-kayttoonotto-ja-nutin-asennuksen-kertaus/kuva5.png)

Muokataan `hosts.conf` -tiedostoa komennolla `sudo nano /etc/nut/hosts.conf` lisäämällä sinne

![](/images/uuden-upsin-kayttoonotto-ja-nutin-asennuksen-kertaus/kuva6.png)

Viimeisesti tehdään vielä tarvittavat muutokset käyttäjiin eli muokataan tiedostoa `upsd.users` komennolla `sudo nano /etc/nut/upsd.users`, jotta NUT-serveri ja -asiakas osaavat pitää yhteyttä toisiinsa. Itselläni ne on asetettu seuraavasti eli `admin` -käyttäjä sekä `monitor` -käyttäjä

![](/images/uuden-upsin-kayttoonotto-ja-nutin-asennuksen-kertaus/kuva7.png)

Tämän jälkeen voidaan käynnistää tietokone uudestaan tai antaa seuraavat käskyt:

```
sudo upsdrvctl stop
sudo upsdrvctl start
sudo systemctl restart nut-server
sudo systemctl restart nut-client
sudo systemctl restart nut-monitor
```

Tämän jälkeen meillä pitäisi sitten olla NUT-server käytössä kommunikoimassa ja ohjaamassa UPS:ia.

## NUT-client asennus

NUT-server osaa sammuttaa myös verkossa olevat tietokoneet, kun akun varaus on mennyt tarpeeksi alas, mutta tätä varten asiakas-koneisiin tarvitsee asentaa NUT-client sovellus. Tämä tietysti sillä oletuksella, että asiakaskoneet on kytketty samaan UPS:iin.

Itselläni asiakaskoneina ovat kaksi RaspberryPi- ja yksi BananaPi -pikkutietokone. RaspberryPi koneissa on käyttöjärjestelmänä RaspberryPi OS ja BananaPi koneessa Armbian:in Bullseye -versio. Nämä molemmat pohjautuvat Debianiin, joten asennus niille tapahtuu samalla tavoin.

Aluksi ajetaan komento

```
sudo apt update
```

Seuraavaksi asennetaan tarvittavat ohjelmistot

```
sudo apt install nut-client
```

Seuraavaksi meiltä pitäisi löytyä hakemistosta `/etc/nut/` seuraavat tiedostot

![](/images/uuden-upsin-kayttoonotto-ja-nutin-asennuksen-kertaus/kuva8.png)

Tiedostossa `nut.conf` muutetaan NUT toimimaan asiakkaana eli muutetaan tiedoston lopussa kohta `MODE` seuraavanlaiseksi

![](/images/uuden-upsin-kayttoonotto-ja-nutin-asennuksen-kertaus/kuva9.png)

Tämän jälkeen lisätään tiedostoon `upsmon.conf` rivi, jotta NUT-client osaa ottaa yhteyttä NUT-serveriin

![](/images/uuden-upsin-kayttoonotto-ja-nutin-asennuksen-kertaus/kuva10.png)

Eli tässä `greencell` on UPS:n nimi ja IP-osoite on NUT-serverin osoite. Käyttäjä on `monitor` -käyttäjä ja tässä tapauksessa `upsmonuser`. Salasana on sama kuin asetettiin aiemmin NUT-serverin asetuksissa.

Tämän jälkeen käynnistetään kone uudestaan tai annetaan komento

```
sudo service restart nut-client
```

Nyt meillä on myös asiakaskone asetettu eli NUT-serveri osaa sammuttaa sen tarvittaessa, jos UPS:in akun varaus laskee liian alas.

