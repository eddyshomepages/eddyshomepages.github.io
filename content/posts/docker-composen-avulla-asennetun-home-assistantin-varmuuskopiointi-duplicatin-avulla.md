---
title: "Docker-Composen avulla asennetun Home Assistantin varmuuskopiointi Duplicatin avulla"
date: "2022-09-05"
categories: 
  - "docker-compose"
  - "duplicati"
  - "home-assistant"
  - "linux"
tags: 
  - "baikal"
  - "docker-compose"
  - "dropbox"
  - "duplicati"
  - "googledrive"
  - "homeassistant"
  - "onedrive"
  - "webdav"
---

Tässä kirjoituksessa minulla on tarkoitus käydä läpi [Docker-Composen](https://docs.docker.com/compose/) avulla asennetun [Home Assistantin](https://www.home-assistant.io/) varmuuskopiointia erillisen [Duplicati](https://www.duplicati.com/) -sovelluksen avulla. [Home Assistantin](https://www.home-assistant.io/) omakin varmuuskopiointi kyllä toimii, mutta esim. varmuuskopioinnin palautus ei toimi [Docker-Compose](https://docs.docker.com/compose/) asennuksessa, vaan vaihtoehtona on ainoastaan poistaa- tai ladata varmuuskopio.

[Duplicati](https://www.duplicati.com/) asennetaan samalle tietokoneelle kuin [Home Assistant](https://www.home-assistant.io/) ja sen voi asentaa [Docker-Composen](https://docs.docker.com/compose/) avulla tai vaihtoehtoisesti myös suoraan käyttöjärjestelmään, joista tarkemmin seuraavaksi.

### Duplicatin asennus Docker-Composen avulla

[Duplicatin](https://www.duplicati.com/) asennus [Docker-Composen](https://docs.docker.com/compose/) avulla onnistuu samaan tapaan, kuin teimme aikaisemmin [Home Assistantin](https://fasted.dy.fi/index.php/2022/08/home-assistantin-asennus-docker-composen-avulla/) ja [Baïkalin](https://fasted.dy.fi/index.php/2022/09/baikal-kalenteripalvelimen-asennus-docker-composen-avulla-ja-suojatun-yhteyden-muodostus-caddyn-reverse-proxy-asetuksilla/) kanssa. Aluksi luodaan [Docker-Composen](https://docs.docker.com/compose/) asetustiedostoon [Duplicatille](https://www.duplicati.com/) oma hakemisto, jonka jälkeen siirrytään luotuun hakemistoon eli

```
cd docker-data
mkdir duplicati
cd duplicati
```

Seuraavaksi avataan editorilla `docker-compose.yaml` -tiedosto eli annetaan komento `nano docker-compose.yaml` ja tallennetaan tiedostoon alla olevat tiedot

```
version: "2.1"
services:
  duplicati:
    image: ghcr.io/linuxserver/duplicati
    container_name: duplicati
    environment:
      - PUID=0
      - PGID=0
      - TZ=Europe/Helsinki
    volumes:
      - /home/pi/docker-data/duplicati/config:/config
      - /home/pi/docker-data/duplicati/backups/:/backups
      - /home/pi/docker-data/:/source:ro
    restart: always
    ports:
      - "8200:8200"
```

Tässä "`volumes`" -osiossa "`/config`" on hakemisto, johon tallentuvat konfigurointiin liittyvät tiedostot. Hakemisto "`/backups`" on hakemisto, johon tallentuvat paikallisesti tehdyt varmuuskopiot ja hakemisto "`/source`" on ns. lähdehakemisto, joka näkyy [Duplicatin](https://www.duplicati.com/) lähdetiedosto -ikkunassa kohdassa nimeltään "`Lähdetiedostot`". Tässä tapauksessa olen antanut lähdetiedostoksi sen hakemiston, johon on tallennettu kaikki [Docker-Composella](https://docs.docker.com/compose/) asennetut sovellukset.

![](/images/docker-composen-avulla-asennetun-home-assistantin-varmuuskopiointi-duplicatin-avulla/kuva1.png)

Tämän jälkeen suljetaan tiedosto ja tallennetaan muutokset. Seuraavaksi käynnistetään [Duplicati](https://www.duplicati.com/) komennolla `docker-compose up -d`.

Kun [Docker-Compose](https://docs.docker.com/compose/) on hakenut tarvittavat tiedot ja [Duplicati](https://www.duplicati.com/) on käynnistynyt, niin seuraavaksi voidaan käynnistää [Duplicatin](https://www.duplicati.com/) web-käyttöliittymä eli menemme selaimella osoitteeseen `http://x.x.x.x:8200`, jossa `x.x.x.x` on taas sen tietokoneen sisäverkon IP-osoite, johon [Duplicati](https://www.duplicati.com/) on asennettu.

### Duplicatin asennus suoraan käyttöjärjestelmään

Toisena vaihtoehtona on asentaa [Duplicati](https://www.duplicati.com/) suoraan käyttöjärjestelmään ja sekin onnistuu helposti. Aluksi haetaan asennuspaketti komennolla

```
wget https://updates.duplicati.com/beta/duplicati_2.0.6.3-1_all.deb
```

Seuraavaksi asennetaan haettu paketti komennolla

```
sudo dpkg -i duplicati_2.0.6.3-1_all.deb
```

Tämä antaa todennäköisesti virheilmoituksen puuttuvista paketeista

```
.......
E: Unmet dependencies. Try 'apt --fix-broken install' with no packages (or specify a solution).
```

Asia korjaantuu ajamalla komento `sudo apt --fix-broken install`, joka asentaa puuttuvat tiedostot.

Tämän jälkeen ajetaan uudestaan komento `sudo dpkg -i duplicati_2.0.6.3-1_all.deb`, jonka jälkeen meillä on [Duplicati](https://www.duplicati.com/) asennettuna.

[Duplicati](https://www.duplicati.com/) ei ole vielä käynnissä, joten se täytyy käynnistää ja asettaa käynnistymään automaattisesti. Ennen sitä tehdään kuitenkin muutos tiedostoon `/etc/default/duplicati` eli avataan tiedosto editorilla

`sudo nano /etc/default/duplicati`

Tähän tiedostoon täytyy tehdä seuraava muutos, jotta web-käyttöliittymä käynnistyy eli muutetaan alla oleva rivi

```
DAEMON_OPTS=""
```

muotoon

```
DAEMON_OPTS="--webservice-interface=any"
```

Tämän jälkeen laitetaan vielä [Duplicati](https://www.duplicati.com/) käynnistymään automaattisesti sekä käynnistetään palvelu

```
sudo systemctl enable duplicati
sudo systemctl start duplicati
```

Nyt meillä on [Duplicati](https://www.duplicati.com/) asennettuna suoraan käyttöjärjestelmään ja seuraavaksi voidaan avata selaimella [Duplicatin](https://www.duplicati.com/) web-käyttöliittymä eli avataan osoite `http://x.x.x.x:8200`.

Tarkemmin [Duplicatin](https://www.duplicati.com/) asetuksista voi lukea sivustolta [https://duplicati.readthedocs.io/en/latest/](https://duplicati.readthedocs.io/en/latest/), jossa on tarkemmin tietoa sovelluksen asetuksista.

Kohdassa "`Storage Providers`" on tietoja eri tallennusmahdollisuuksista kuten varmuuskopiointi paikallisesti tai sitten pilveen esim. [WebDAV](https://duplicati.readthedocs.io/en/latest/05-storage-providers/#webdav), [Dropbox](https://duplicati.readthedocs.io/en/latest/05-storage-providers/#dropbox), [Google Drive](https://duplicati.readthedocs.io/en/latest/05-storage-providers/#google-drive) tai [Microsoft OneDrive](https://duplicati.readthedocs.io/en/latest/05-storage-providers/#microsoft-onedrive-v2-microsoft-graph-api). Näitä mahdollisuuksia on monia ja niistä löytyy varmasti se hyvä vaihtoehto omaan käyttöön.

