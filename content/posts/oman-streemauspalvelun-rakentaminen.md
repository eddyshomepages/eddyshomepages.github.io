---
title: "Oman streemauspalvelun rakentaminen"
date: "2022-11-01"
categories: 
  - "debian"
  - "emby"
  - "linux"
  - "raspberrypios"
tags: 
  - "caddy"
  - "debian"
  - "emby"
  - "raspberrypios"
---

Minulla on ollut jo vuosia mielessä, että pitäisi tehdä omalle musiikille striimaus-palvelu, koska minullekin on kertynyt vuosien varrella paljonkin CD:tä, joita on tullut muutettua [MP3](https://en.wikipedia.org/wiki/MP3) ja [MP4](https://en.wikipedia.org/wiki/MP4_file_format) -musiikkimuotoon eli .m4a muotoon. Voisihan sitä kuunnella musiikkia myös maksullisista palveluista, mutta ajattelin nyt kertoa tämmöisestäkin vaihtoehdosta eli tässä kirjoituksessa käydään läpi [Emby](https://emby.media/index.html) -mediaserverin asennus- ja käyttöön ottaminen, joka on mielestäni suoraviivainen ja helppo tehdä.

[Emby](https://emby.media/index.html) on tarkoitettu oman median hallitsemiseen omalla palvelimella ja toimii esimerkiksi mainiosti omassa sisäverkossa ja ulkoverkossa palvelun saa toimimaan [Emby Premiere](https://emby.media/premiere.html) -tilin avulla. Vaihtoehtoisesti yhteyden ulkopuolelta saa myös toimimaan [Caddy](https://caddyserver.com/) -webserverin [reverse proxy](https://caddyserver.com/docs/quick-starts/reverse-proxy#reverse-proxy-quick-start):n avulla tai sitten ottamalla sisäverkkoon VPN -yhteys eli pienellä säätämisellä yhteys kodin ulkopuolelta onnistuu myös ilman [Emby Premiere](https://emby.media/premiere.html) -tiliä.

[Embyllä](https://emby.media/index.html) voi hallita musiikin lisäksi myös videoita sekä Live TV lähetyksiä, joka tosin vaatii maksullisen [Emby Premiere](https://emby.media/premiere.html) -tilin. Minun on tarkoitus hallita toistaiseksi ainoastaan musiikki -kokoelmaani, johon ilmainen vaihtoehto riittää siis mainiosti.

Minä asennan [Embyn](https://emby.media/index.html) RaspberryPi 3 -tietokoneelle siten, että kone boottaa ulkoiselta SSD -levyltä ilman muistikortteja. Käyttöjärjestelmänä Raspissa on [RaspberryPiOS](https://www.raspberrypi.com/software/). Varmuuskopioinnin teen verkkolevyasemalla käyttäen [NFS](https://en.wikipedia.org/wiki/Network_File_System) (Network File System) -protokollaa.

### Embyn asentaminen

[Embyn](https://emby.media/index.html) asentaminen aloitetaan ajamalla ensin tarvittavat käyttöjärjestelmän päivitykset eli ajetaan komennot

```
sudo apt update
sudo apt upgrade
```

Mikäli tarjolla on päivityksiä, niin asennetaan ne aluksi ennen kuin jatketaan.

Seuraavaksi tarkistetaan vielä järjestelmän tiedot, jotta voidaan hakea oikea versio eli ajetaan käsky

```
uname -a
```

Käskyllä saadaan seuraavat tiedot eli

![](/images/oman-streemauspalvelun-rakentaminen/kuva1.png)

Ympyröidystä kohdasta nähdään, että meillä on kyseessä tavallinen 32-bit käyttöjärjestelmä. Seuraavaksi haetaan oikea [Embyn](https://emby.media/index.html) paketti, joka löytyy [Embyn sivustolta](https://emby.media/linux-server.html) eli meillä käyttöjärjestelmänä on [RaspberryPiOS](https://www.raspberrypi.com/software/), jolloin valitaan alasvetovalikosta vaihtoehdoksi `Debian`. Jotta asennus saadaan suoritettua, ajetaan seuraavat käskyt

```
wget https://github.com/MediaBrowser/Emby.Releases/releases/download/4.7.8.0/emby-server-deb_4.7.8.0_armhf.deb
sudo dpkg -i emby-server-deb_4.7.8.0_armhf.deb
```

Tämän jälkeen voimmekin avata selaimessa osoitteet `http://x.x.x.x:8096`, jossa `x.x.x.x` on taas sen koneen IP-osoite, jolle [Emby](https://emby.media/index.html) on asennettu. Eli meille avautuu alla olevan näköinen näkymä

![](/images/oman-streemauspalvelun-rakentaminen/kuva2.png)

_Kuva: Embyn konffausikkuna_

Aluksi valitaan haluttu kieli, jonka jälkeen annetaan ensimmäinen käyttäjätunnus ja tunnukselle salasana. Käyttäjätunnuksia voidaan luoda lisää palvelimella kirjautumisen jälkeen.

![](/images/oman-streemauspalvelun-rakentaminen/kuva3.png)

_Kuva: Embyn käyttäjän luonti_

Seuraavaksi valitaan hakemisto, johon on musiikki yms. mediat ovat tallennettu

![](/images/oman-streemauspalvelun-rakentaminen/kuva4.png)

_Kuva: Embyn mediakirjaston hakemiston asetus_

Seuraavaksi valitaan oletuskieli meta-datalle

![](/images/oman-streemauspalvelun-rakentaminen/kuva5.png)

_Kuva: Embyn meta-datan oletuskieli_

Seuraavaksi konfiguroidaan etäyhteyttä eli mennään oletusasetuksella eteenpäin

![](/images/oman-streemauspalvelun-rakentaminen/kuva6.png)

_Kuva: Embyn etäyhteyden konfigurointi_

Lopuksi vielä luetaan tiedot yksityisyysasetuksista ja käyttöehdoista ennen hyväksymistä

![](/images/oman-streemauspalvelun-rakentaminen/kuva7.png)

_Kuva: Embyn yksityisyysasetukset ja käyttöehdot_

Tämän jälkeen ollaankin sitten valmiita

![](/images/oman-streemauspalvelun-rakentaminen/kuva8.png)

_Kuva: Embyn konfigurointi on nyt valmis_

Lopuksi painetaan vielä `Finish` -näppäintä. Ikkunasta löytyvät myös linkit asiakas-sovelluksiin, jotka voidaan asentaa ja yhdistää palvelimeen.

Seuraavaksi päästään kirjautumaan sovellukseen ja aloittamaan sen käyttö

![](/images/oman-streemauspalvelun-rakentaminen/kuva9.png)

_Kuva: Embyn kirjautumisikkuna_

Nyt ei muuta kuin kuuntelemaan musiikkia sovelluksen kautta.

