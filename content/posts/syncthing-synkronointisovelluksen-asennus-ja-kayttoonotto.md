---
title: "Syncthing synkronointisovelluksen asennus- ja käyttöönotto"
date: "2023-05-07"
categories: 
  - "debian"
  - "linux"
  - "syncthing"
tags: 
  - "android"
  - "bananapi"
  - "debian"
  - "freebsd"
  - "linux"
  - "macos"
  - "openpsd"
  - "sailfishos"
  - "solaris"
  - "syncthing"
  - "windows"
---

Seuraavaksi ajattelin kirjoittaa [Syncthing](https://syncthing.net/) -nimisestä synkronointisovelluksesta, jolla pystyy esim. synkronoimaan puhelimen valokuvat automaattisesti omalle tietokoneelle ilman, että tarvitsee juurikaan tietää/tuntea oman kotiverkon asetuksista mitään. Riittää, että molemmille laitteille on asennettu [Syncthing](https://syncthing.net/) ja laitteet on yhdistetty toimimaan yhdessä.

[Syncthing](https://syncthing.net/) on avoimen lähdekoodin sovellus ja sen toiminta perustuu [Block Exchange Protocollan 1. versioon](https://docs.syncthing.net/specs/bep-v1.html). Lisäksi [Synctingin](https://syncthing.net/) saa asetettua toimimaan, joko pelkästään omassa sisäverkossa tai vaihtoehtoisesti myös internetin yli. [Syncthing](https://syncthing.net/) myös salaa kaiken liikenteen käyttäen [TLS](https://fi.wikipedia.org/wiki/TLS):n versiota 1.2 tai uudempi sekä luo automaattisesti tarvittavat sertifikaatit, joten käyttäjän ei tarvitse tehdä muuta kuin asentaa sovellus ja käynnistää se. Loppu konfigurointi hoidetaan nettiselaimen kautta.

[Syncthingistä](https://syncthing.net/downloads/) löytyy versiot [macOS](https://fi.wikipedia.org/wiki/MacOS):lle, [Windows](https://fi.wikipedia.org/wiki/Microsoft_Windows):lle, [Linuxille](https://fi.wikipedia.org/wiki/Linux), [FreeBSD](https://fi.wikipedia.org/wiki/FreeBSD):lle, [Solarikselle](https://fi.wikipedia.org/wiki/Oracle_Solaris), [OpenBSD](https://fi.wikipedia.org/wiki/OpenBSD):lle, [Androidille](https://fi.wikipedia.org/wiki/Android) ja mm. [SailfishOS](https://fi.wikipedia.org/wiki/Sailfish_OS):lle.

#### Syncthingin asennus

Itse käytän [Syncthingiä](https://syncthing.net/) siten, että minulla [BananaPi](https://en.wikipedia.org/wiki/Banana_Pi) -tietokone toimii "keskuskoneena" ja jota kautta jaettavat tiedostot jaetaan eri tietokoneiden ja puhelimien kesken. Käyttöjärjestelminä minulla on käytössä [Debian](https://fi.wikipedia.org/wiki/Debian) -pohjaisia käyttöjärjestelmiä, joten [Syncthingin](https://syncthing.net/) asennuksen saa tehtyä suoraan ohjelmistolähteiden kautta antamalla komento `sudo apt install syncthing`, jota ennen kuitenkin tarkistetaan ja asennetaan päivitykset antamalla komento

```
sudo apt update && sudoa apt upgrade
```

Vaihtoehtoisesti [Syncthingin](https://syncthing.net/) voi asentaa myös käyttäen ohjelmistolähteenä [apt.syncthing.net](http://apt.syncthing.net) -ohjelmistolähdettä, mutta tällöin täytyy aluksi asentaa _release-key_ ja _stable_ -ohjelmistolähteet komennoilla

```
sudo curl -o /usr/share/keyrings/syncthing-archive-keyring.gpg https://syncthing.net/release-key.gpg

echo "deb [signed-by=/usr/share/keyrings/syncthing-archive-keyring.gpg] https://apt.syncthing.net/ syncthing stable" | sudo tee /etc/apt/sources.list.d/syncthing.list
```

Seuraavaksi asennetaan itse sovellus samalla komennolla kuin aikaisemmin eli annetaan komennot

```
sudo apt update
sudo apt install syncthing
```

#### Syncthin käynnistys ja asetukset

Seuraavaksi [Syncthing](https://syncthing.net/) voidaan käynnistää ja työpöydällä tämä tapahtuu aloitusvalikon kautta. Ainakin Linuxin puolella aloitusvalikkoon tulee kuvake [Syncthingin](https://syncthing.net/) käynnistämiseksi ja sen saa asetettua käynnistymään myös automaattisesti työpöydän asetuksien kautta.

Seuraavaksi avataan selain eli annetaan sen koneen IP-osoite, jolle [Syncthing](https://syncthing.net/) on asennettu eli minulla esimerkiksi tämä sama tietokone, jolloin osoite on _http://127.0.0.1:8384_ (tai vaihtoehtoisesti voidaan käyttää myös osoitetta _http://localhost:8384_).

[Syncthing](https://syncthing.net/) käyttää oletusporttina porttia _8384_, mutta tämän voi halutessaan muuttaa sovelluksen asetuksien kautta.

Eli avaamisen jälkeen selaimelle avautuu alla olevan kaltainen ikkuna

![](/images/syncthing-synkronointisovelluksen-asennus-ja-kayttoonotto/kuva1.webp)

_Kuva: Syncthing aloitusikkuna_

Tässä ikkunassa kohdassa _Kansiot_ näkyvät kaikki ne laitteen kansiot, jotka jaetaan kohdassa _Laitteet_ näkyvien laitteiden kanssa. Kohdassa _Tämä laite_ näkyy tämän kyseisen laitteen tiedot.

##### Lisää jaettavia kansioita

[Syncthing](https://syncthing.net/) tekee valmiiksi oletuksena _Sync_ -nimisen kansion, mutta mikäli halutaan jakaa muitakin kansioita, se voidaan tehdä valitsemalla _Lisää kansio_, jolloin avautuu alla oleva näkymä

![](/images/syncthing-synkronointisovelluksen-asennus-ja-kayttoonotto/kuva2.webp)

_Kuva: Syncthing, lisää kansio_

Kansiota lisätessä annetaan aluksi _kansion nimi_, _kansion ID_ (tulee yleensä automaattisesti) sekä _kansion polku_. Tässä huomataan, että oletuksena kansio luodaan kotihakemistoon eli hakemistopolku on tässä tapauksessa `/home/user/kansio`.

##### Lisää laitteita

Kansion asetuksien jälkeen voidaan lisätä uusia laitteita ja tämä tapahtuu painamalla kohdasta _Lisää laite_, jolloin avautuu alla olevan kaltainen ikkuna

![](/images/syncthing-synkronointisovelluksen-asennus-ja-kayttoonotto/kuva3.webp)

_Kuva: Syncthing, lisää laite_ _\- Yleinen_

Laitteen lisäämiseksi tarvitaan tieto lisättävän laitteen ID:stä ja tämä tieto saadaan avaamalla [Syncthing](https://syncthing.net/) lisättävän laitteen selaimessa.

Tämän jälkeen avataan oikeasta yläreunasta kohta _Muokkaa - Näytä ID_, jolloin näkyviin tulee QR -koodi sekä numero/kirjainsarja, jossa on kahdeksan kappaletta seitsemän merkkisiä numero/kirjain -yhdistelmiä.

Tämä merkkisarja tarvitaan, jotta uusi laite voidaan lisätä. [Syncthing](https://syncthing.net/) yleensä löytää samassa verkossa olevat laitteet automaattisesti ja ne näkyvät _Laitteen ID_ -kohdan alla, josta sitten voidaan valita oikea laite. Tämän jälkeen, kun laite on valittu, tulee nettisivun yläreunaan näkyviin kysymys, että saako tämä lisättävä laite yhdistää ja tähän voidaan vastata kyllä.

Seuraavaksi valitaan vielä kansiot, jotka halutaan jakaa eli alla minulla jaettavaksi tulisivat kansiot _Dokumentit_ sekä _Kuvat\_SailfishOS_.

![](/images/syncthing-synkronointisovelluksen-asennus-ja-kayttoonotto/kuva4.webp)

_Kuvat: Syncthing, lisää laite - Jakaminen_

Oikeasta ylerunasta kohdasta _Muokkaa - Asetukset_ voidaan kohdassa _Yleinen_ muuttaa esim. hakemistojen oletuspolkua. Tämä tapahtuu kohdasta _Oletuspolku kansioille_ eli tässä kohdassa määritetään oletuskansio, johon kansioon muiden laitteiden kanssa jaetut kansiot tallennetaan. Tässä tapauksessa oletuskansiona _~ (tilde)_ eli tämän tarkoittaa kotikansiota, joka tässä Linuxilla on _/home/user_.

![](/images/syncthing-synkronointisovelluksen-asennus-ja-kayttoonotto/kuva5.webp)

_Kuva: Syncthing asetukset, kohta Yleinen_

Kohdasta _GUI_ avautuu alla oleva näkymä ja tässä voidaan muokata mm. käyttöliittymän osoitetta ja porttia sekä ottaa käyttöön suojattu _https_ -yhteys käyttöliittymän kanssa.

![](/images/syncthing-synkronointisovelluksen-asennus-ja-kayttoonotto/kuva6.webp)

_Kuva: Syncthing asetukset, kohta GUI_

Asetuksien muista kohdista löytyy tietoja yhteyksistä ja täältä voidaan määrittää myös mahdolliset ohitetut laitteet tai -kansiot, mutta näihin ei ole yleensä tarvinnut tehdä muutoksia.

