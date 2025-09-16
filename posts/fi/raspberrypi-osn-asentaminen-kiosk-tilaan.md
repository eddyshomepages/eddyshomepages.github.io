---
title: "RaspberryPi OS:n asentaminen kiosk -tilaan"
date: "2023-03-15"
tags: 
  - "dns"
  - "dy.fi"
  - "hotspot"
  - "kiosk"
  - "openvpn"
  - "raspberrypios"
  - "ssh"
  - "vpn"
---

Seuraavaksi ajattelin kirjoittaa asiasta, joka tuli vastaani jokin aika sitten eli miten [RaspberryPi OS](https://www.raspberrypi.com/software/):n saa asetettua [kiosk](https://en.wikipedia.org/wiki/Interactive_kiosk) -tilaan ja saako käyttöjärjestelmän asetettua sellaiseen tilaan, että näppäimistön ja hiiren avulla ei päästä käsiksi käyttöjärjestelmään.

Mikäli järjestelmään halutaan saada yhteys, mutta näppäimistön ja hiiren käyttö on estetty, niin tällöin täytyy miettiä jokin muu yhteystapa ja jäljelle jää oikeastaan ottaa yhteys koneeseen joko etänä tai paikan päällä esim. siten, että laite luo ympärilleen [hotspotin](https://en.wikipedia.org/wiki/Wi-Fi_hotspot), jonka WI-FI -verkkoon sitten yhdistetään ja kirjaudutaan koneelle esim. [SSH](https://en.wikipedia.org/wiki/Secure_Shell):n avulla.

Mikäli yhteys halutaan ottaa kokonaan etänä, niin tällöin pitäisi käyttää jonkinlaista etätyöympäristöä tai asentaa Raspille [VPN](https://en.wikipedia.org/wiki/Virtual_private_network)\-palvelin. Valmiiden etäyhteyssovellusten kuten [TeamViewerin](https://www.teamviewer.com/en/) tms. käyttö ei taas välttämättä toimi, koska laite on [kiosk](https://en.wikipedia.org/wiki/Interactive_kiosk) -tilassa ja varsinaista työpöytää ei ole käytössä. Voin olla tässä myös väärässäkin, koska en ole ehtinyt tähän oikein vielä perehtyä.

[RaspberryPi OS](https://www.raspberrypi.com/software/):lle pystyy asentamaan [OpenVPN](https://openvpn.net/) -palvelimen helposti asentamalla se esim. [PiVPN](https://pivpn.io/):n avulla, joka on käytännössä valmis scripti, joka asentaa Raspille [OpenVPN](https://openvpn.net/) -palvelimen. Tällöin täytyy olla kuitenkin tiedossa laitteen ulkoinen IP-osoite, jotta yhteys voidaan ottaa. Raspille voidaan tietysti konffata esim. 4G -mokkula, jonka liittymässä olisi julkinen IP-osoite käytössä, mutta tällöin tarvittaisiin vielä lisäksi jokin DNS-palvelu, jonka avulla laitteelle saataisiin ulkoinen nettisoite. Näitä ilmaisia DNS palveluita kyllä löytyy kuten esim. [DynDNS](https://account.dyn.com/) jne. sekä suomalainen [dy.fi](https://www.dy.fi/) -palvelu, joka minulla on käytössä.

#### RaspberryPiOS asentaminen kiosk -tilaan

Aloitetaan kuitenkin asennus asentamalla aluksi [RaspberryPi OS](https://www.raspberrypi.com/software/) muistikortille ja tähän löytyi ohjeet aikaisemmasta kirjoituksesta, johon linkki [tässä](.)/posts/fi/raspberrypiosn-asentaminen-ja-kayttoonotto/).

Seuraavaksi laitetaan muistikortti koneeseen ja käynnistetään kone. Odotellaan hetki ja tarkistetaan vaikka modeemin kautta, että mikä on tullut laitteelle IP-osoitteeksi. Tämän jälkeen kirjaudutaan [SSH](https://en.wikipedia.org/wiki/Secure_Shell):n avulla laitteelle sisään eli annetaan komento

```
ssh pi@x.x.x.x
```

Tässä tapauksessa käyttäjänä on `pi` ja `x.x.x.x` on koneen IP-osoite. Seuraavaksi asennetaan mahdolliset päivitykset koneelle eli annetaan komento

```
sudo apt update && sudo apt upgrade
```

Päivityksien jälkeen asennetaan `Xserver`, jotta [Chromium](https://www.chromium.org/chromium-projects/) saadaan käynnistymään eli annetaan komento

```
sudo apt-get install --no-install-recommends xserver-xorg x11-xserver-utils xinit openbox
```

Seuraavaksi asennetaan paketit `chromium` ja `unclutter` komennolla

```
sudo apt-get install --no-install-recommends chromium-browser unclutter
```

Eli `chromium` asennetaan minimi paketeilla ja `unclutter` on taas sovellus, jolla saadaan piilotettua hiiren kuvake näytöltä.

Tässä vaiheessa voitaisiin asentaa myös esim. `lightdm` tms. ja asettaa järjestelmä kirjautumaan automaattisesti työpöydälle, mutta tehdään asia hiukan toisella tavalla.

Seuraavaksi ajetaan komento `sudo raspi-config` ja asetetaan jäjestelmän kirjautumaan automaattisesti konsoliin eli aluksi valitaan kohta _1\. System Options_

![](/images/raspberrypi-osn-asentaminen-kiosk-tilaan/kuva1.webp)

_Kuva: raspi-config - system options_

Seuraavaksi valitaan kohta _S5. Boot / Auto Login_

![](/images/raspberrypi-osn-asentaminen-kiosk-tilaan/kuva2.webp)

_Kuva: raspi-config - boot / auto login_

Ja lopuksi valitaan vielä kohta _B2. Console Autologin_

![](/images/raspberrypi-osn-asentaminen-kiosk-tilaan/kuva3.webp)

_Kuva: raspi-config - console autologin_

Tämän jälkeen poistutaan sovelluksesta ja käynnistetään kone uudestaan (tätä tarjotaan automaattisesti vaihtoehdoksi).

Käynnistyksen jälkeen otetaan taas uusi yhteys SSH:n kautta ja annetaan komento `nano /home/pi/.bash_profile` ja lisätään tiedostoon seuraavat rivit eli tarkoittaen sitä, kun kone tunnistaa käynnistyksen yhteydessä näytön, niin sen jälkeen käynnistetään graafinen työpöytä komennolla `startx`.

```
if [ -z $DISPLAY ] && [ $(tty) = /dev/tty1 ]
then
  startx
fi
```

Tämän jälkeen suljetaan ja tallennetaan tiedosto sekä annetaan komento `nano /home/pi/.xinitrc` ja lisätään tänne seuraavat rivit

```
!/usr/bin/env sh
xset -dpms
xset s off
xset s noblank

unclutter &
chromium-browser https://fasted.dy.fi --window-size=1920,1080 --window-position=0,0 --start-fullscreen --kiosk --incognito --noerrdialogs --disable-translate --no-first-run --fast --fast-start --disable-infobars  --disable-features=TranslateUI --disk-cache-dir=/dev/null --overscroll-
history-navigation=0 --disable-pinch
```

Näillä `xset` komennoilla estetään näytönsäästäjän meneminen päälle ja järjestelmän meneminen automaattisesti standby -tilaan ja annetaan [chromiumille](https://www.chromium.org/chromium-projects/) komennot

Tämän jälkeen voidaan käynnistää kone uudestaan, jolloin se käynnistyy [kiosk](https://en.wikipedia.org/wiki/Interactive_kiosk) -tilassa ja em. mukaisesti se avaa tämän sivuston eli osoitteen [https://fasted.dy.fi](https://fasted.dy.fi).

#### Laitteen muut asetukset kuten USB-porttien poistaminen käytöstä

Lopuksi vielä poistetaan USB-portit käytöstä eli se saadaan tehty komennolla

```
echo '1-1' | sudo tee /sys/bus/usb/drivers/usb/unbind
```

Portit saadaan palautettua käyttöön komennolla

```
echo '1-1' | sudo tee /sys/bus/usb/drivers/usb/bind
```

Mikäli halutaan poistaa myös verkkoliitäntä pois käytöstä, niin tällöin voidaan antaa komento

```
sudo ifconfig eth0 down
```

Verkkoliitäntä saadaan palautettua käyttöön komennolla

```
sudo ifconfig eth0 up
```

Nämä edelle mainitut toimenpiteet komoutuvat siinä vaiheessa, kun kone käynnistetään uudelleen eli meidän tarvitsee muokata tiedostoa `/etc/rc.local` eli annetaan komento

```
sudo nano /etc/rc.local
```

Ja lisätään tiedoston loppuun ennen riviä `exit 0` rivit

```
echo '1-1' | sudo tee /sys/bus/usb/drivers/usb/unbind
#sudo ifconfig eth0 down
```

HUOM! Mikäli verkkoliitäntä poistetaan käytöstä, niin tulee muistaa asettaa WI-Fi -yhteys päälle mikäli verkkoyhteyttä tarvitaan. Nyt verkkoliitäntää ei oteta pois käytöstä, joten rivin alkuun on laitettu # -merkki.

Mikäli myös `bluetooth` halutaan poistaa käytöstä, niin muokataan tiedostoa `/boot/config.txt` komennolla

```
sudo nano /boot/config.txt
```

Ja lisätään tiedoston loppuun rivi

```
dtoverlay=disable-bt
```

Näiden muutoksien jälkeen yhteys voidaan ottaa enää [SSH](https://en.wikipedia.org/wiki/Secure_Shell):n kautta eli nyt laite on suojattu mahdolliselta muokkaukselta eli laitteelle ei pääse käsiksi esim. kytkemällä siihen erillien näppäimistö tai hiiri.

