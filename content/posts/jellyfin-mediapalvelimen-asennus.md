---
title: "Jellyfin -mediapalvelimen asennus"
date: "2023-04-23"
categories: 
  - "debian"
  - "emby"
  - "jellyfin"
  - "linux"
tags: 
  - "android"
  - "androidtv"
  - "archlinux"
  - "bananapi"
  - "centos"
  - "debian"
  - "emby"
  - "fedora"
  - "gentoo"
  - "ios"
  - "kodi"
  - "linux"
  - "roku"
  - "sailfishos"
  - "ubuntu"
  - "webos"
---

Kirjoitin aikaisemmin tarinan [Emby](/posts/oman-streemauspalvelun-rakentaminen/) -mediaserverin asentamisesta ja nyt ajattelin kirjoittaa vaihtoehtoisesta ratkaisusta eli [Jellyfin](https://jellyfin.org/) -mediaserverin asentaminen. [Jellyfin](https://jellyfin.org/) on oma palvelimensa vaikka sen alkujuuret juontavatkin [Emby](https://emby.media/) -mediaserveriin eli toisin sanoen [Jellyfin](https://jellyfin.org/) on forkki [Emby](https://emby.media/) -mediaserveristä. [Jellyfin](https://jellyfin.org/) -mediaserverin kautta voi mm. katsoa videoita ja TV -tallennuksia, kuunnella musiikkia sekä katsella myös valokuvia eli sovellus on siinä mielessä monipuolinen.

#### Jellyfinin asennus

Minä asennan [Jellyfin](https://jellyfin.org/) -mediaserverin [BananaPi](https://www.banana-pi.org/en/banana-pi-sbcs/10.html) -tietokoneella ja katsotaan miten se siinä toimii. Eli aluksi ladataan [Jellyfin](https://jellyfin.org/) -sivustolta [asennus](https://jellyfin.org/downloads/server) -scripti, jolla asennus saadaan suoritettua eli aluksi kirjaudutaan [BananaPi](https://www.banana-pi.org/en/banana-pi-sbcs/10.html) -koneelle etänä [SSH](https://fi.wikipedia.org/wiki/SSH):n avulla. Aluksi kuitenkin tarkistetaan ja asennetaan päivitykset eli annetaan komento

```
sudo apt update && sudo apt upgrade
```

Seuraavaksi voidaan ajaa asennus -scripti eli annetaan komento

```
curl https://repo.jellyfin.org/install-debuntu.sh | sudo bash
```

Tämän jälkeen odotellaan hetki asennuksen suorittamista. Kun asennus on valmis, voidaan jatkaa [Jellyfinin](https://jellyfin.org/) asennusta selaimen kautta eli otetaan selaimella yhteyttä ko. koneeseen, johon [Jellyfin](https://jellyfin.org/) on asennettu eli `http://x.x.x.x:8096`. Tämän jälkeen avautuun alla olevan kaltainen ikkuna eli aluksi valitaan asennuskieli.

![](/images/jellyfin-mediapalvelimen-asennus/Kuva1.webp)

_Kuva 1: Jellyfin - asennuskielen valinta_

Seuraavaksi luodaan pääkäyttäjä.

![](/images/jellyfin-mediapalvelimen-asennus/Kuva2.webp)

_Kuva 2: Jellyfin - pääkäyttäjän luonti_

Seuraavana lisätään [Jellyfiniin](https://jellyfin.org/) mahdolliset mediakirjastot. Mediakirjastojen lisäys voidaan tehdä myös myöhemminkin sen jälkeen, kun asennukset on suoritettu.

![](/images/jellyfin-mediapalvelimen-asennus/Kuva3.webp)

_Kuva 3: Jellyfin - mediakirjaston asetus_

Mediakirjaston tietojen antamisen jälkeen valitaan metatietojen kieli ja maa.

![](/images/jellyfin-mediapalvelimen-asennus/Kuva4.webp)

_Kuva 4: Jellyfin - metatietojen kieli- ja maa-asetus_

Kieliasetuksien jälkeen määritetään etäkäyttö eli voidaan sallia serverin etäkäyttö. Reitittimien porttien automaattista avaamista (UPnP) en suosittele sallittavaksi.

![](/images/jellyfin-mediapalvelimen-asennus/Kuva5.webp)

_Kuva 5: Jellyfin - etäkäytön määritys_

Tämän jälkeen asennus on valmis ja [Jellyfin](https://jellyfin.org/) -mediaserveri on valmis käyttöön otettavaksi.

![](/images/jellyfin-mediapalvelimen-asennus/Kuva6.webp)

_Kuva_ 6: Jellyfin - asennus on valmis

Lopuksi voidaan kirjautua järjestelmään sisään ja aluksi kannattaa luoda tavallinen käyttäjä, jolla käyttää [Jellyfin](https://jellyfin.org/) -mediaserveriä.

![](/images/jellyfin-mediapalvelimen-asennus/Kuva7.webp)

_Kuva 7: Jellyfin - kirjautumisikkuna_

[Jellyfiniin](https://jellyfin.org/downloads) löytyy useita eri clienttejä eri alustoille kuten [Linux](https://fi.wikipedia.org/wiki/Linux), [Android](https://fi.wikipedia.org/wiki/Android), [AndroidTV](https://fi.wikipedia.org/wiki/Android_TV), [iOS](https://fi.wikipedia.org/wiki/IOS), [Roku](https://en.wikipedia.org/wiki/Roku), [Kodi](https://fi.wikipedia.org/wiki/Kodi), [webOS](https://fi.wikipedia.org/wiki/WebOS) sekä myös [SailfishOS](https://sailfishos.org/) -käyttöjärjestelmälle. Myös palvelin -versiot löytyvät yleisimmille [Linux](https://fi.wikipedia.org/wiki/Linux) -jakeluille kuten [Debian](https://www.debian.org/), [Ubuntu](https://ubuntu.com/), [Arch](https://archlinux.org/), [Fedora](https://fedoraproject.org/), [CentOS](https://www.centos.org/), [Gentoo](https://www.gentoo.org/) sekä geneerinen- ja portable -versio [Linuxille](https://fi.wikipedia.org/wiki/Linux).

Itselläni on asennettuna [Sony Xperia 10 II](https://www.sony.fi/electronics/alypuhelimet/xperia-10m2) -puhelimeen [SailfishOS](https://sailfishos.org/) -käyttöjräjestelmä ja seuraaville kerroilla voin käydä hiukan läpi tätä käyttistä.

