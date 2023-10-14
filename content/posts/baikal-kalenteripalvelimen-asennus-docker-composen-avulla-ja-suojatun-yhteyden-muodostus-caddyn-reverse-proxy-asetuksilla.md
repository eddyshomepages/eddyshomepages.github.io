---
title: "Baïkal -kalenteripalvelimen asennus Docker-Composen avulla ja suojatun yhteyden muodostus Caddyn reverse proxy asetuksilla"
date: "2022-09-01"
categories: 
  - "baikal"
  - "caddy"
  - "docker"
  - "docker-compose"
  - "linux"
tags: 
  - "baikal"
  - "caddy"
  - "caldav"
  - "cardav"
  - "debian"
  - "docker-compose"
  - "linux"
  - "webdav"
---

Tässä kirjoituksessa on tarkoituksena käydä läpi [Baïkal](https://sabre.io/baikal/) -kalenteripalvelimen asennus [Docker-Composelle](https://docs.docker.com/compose/) ja määrittää [Caddy](https://caddyserver.com/)\-webserverille reverse proxy asetukset siten, että myös kalenteripalvelimella on käytössä sama sertifikaatti kuin [Caddy](https://caddyserver.com/) -webserverillä.

Oma kalenteripalvelin on näppärä, jos ei halua käyttää [Googlen](https://en.wikipedia.org/wiki/Google_Calendar) omaa kalenteria, vaan haluaa kalenterin, jonka tiedot on tallennettu omalle palvelimelle eikä esim. Googlen palvelimelle. Omalle palvelimelle asennettaessa täytyy tietysti muistaa tarvittavat varmuuskopiot, jotta tiedot eivät katoa, jos kone esim. hajoaa. Itselläni on käytössä oma sekä myös perheelle yhteinen kalenteri, johon tallennetaan yhteiset menot yms. jolloin ne ovat kaikkien katseltavissa.

[Baïkal](https://sabre.io/baikal/) -kalenteripalvelin käyttää [CalDAV](https://en.wikipedia.org/wiki/CalDAV) -protokollaa, joka on [WebDAV](https://en.wikipedia.org/wiki/WebDAV) -protokollan laajennus. Myös suosituissa [OwnCloud](https://owncloud.com/) / [Nextcloud](https://nextcloud.com/) -pilvipalveluissa, jotka käyttävät [WebDAV](https://en.wikipedia.org/wiki/WebDAV) -protokollaa, on valmiiksi integroituna kalenteripalvelin. Myös nämä kalenteripalvelut toimivat samalla periaatteella kuin [Baïkal](https://sabre.io/baikal/) sillä erotuksella, että Baïkalissa ei ole webbikalenterimahdollisuutta.

Itse hallinnoitavia kalenteri -palvelimia on myös muitakin kuten esim. [Radicale](https://radicale.org/v3.html), jota olen myös käyttänyt ja asentanut omaan käyttöön, mutta nykyisellään [Baïkal](https://sabre.io/baikal/) on vakiintunut käyttöön.

### Baïkalin asennus

[Baïkalin](https://sabre.io/baikal/) asennus [Docker-Compose](https://docs.docker.com/compose/) ympäristöön alkaa sillä, että luodaan [Baïkalille](https://sabre.io/baikal/) oma hakemisto samaan tapaan kuin [Home Assistantin](https://fasted.dy.fi/index.php/2022/08/home-assistantin-asennus-docker-composen-avulla/) asennuksen kanssa, johon tallennetaan `docker-compose.yaml` -tiedosto sekä muut tarvittavat asetustiedostot. Minun tapauksessa tämä tiedosto on nimeltään `docker-data` ja sijaitsee kotihakemistossa eli aluksi siirrymme hakemistoon `docker-data` ja luomme sinne `baikal` -nimisen hakemiston.

```
cd docker-data
mkdir baikal
```

Seuraavaksi avataan `docker-compose.yaml` editorilla (minulla `nano`) ajamalla komento `nano docker-compose.yaml` ja tallennetaan sinne alla olevat tiedot.

```
# Docker Compose file for a Baikal server

version: "2"
services:
  baikal:
    image: ckulka/baikal:nginx
    restart: always
    ports:
      - "5232:80"
    volumes:
      - /home/pi/docker-data/baikal/config:/var/www/baikal/config
      - /home/pi/docker-data/baikal/data:/var/www/baikal/Specific

volumes:
  config:
  data:
```

Kun muutokset on tehty poistutaan editorista ja tallennetaan muutokset. Riviltä "`image: chulka/baikal:nginx`" nähdään, että tämä versio [Baïkalista](https://sabre.io/baikal/) on asennettu [nginx](https://www.nginx.com/) -webserverin päälle ja valitsin sen sen vuoksi, että se on kooltaan pienempi kuin [apache](https://httpd.apache.org/) -versio. Mikäli kuitenkin haluaa käyttää [apache](https://httpd.apache.org/) -versiota, niin myös tämä on valittavissa, tällöin `nginx` tilalle muutetaan `apache`. Lisää tietoa eri versioista saa github-sivulta [https://github.com/ckulka/baikal-docker](https://github.com/ckulka/baikal-docker).

Toinen huomio on, että olen ohjannut portin `5232` dockerin porttiin `80`. Olen tehnyt tämän sen vuoksi, että minulla tämä portti `80` on jo varattuna muuhun käyttöön. Tällöin täytyy vain muistaa ohjata myös modeemista käsin portti `5232` tälle koneelle, johon [Caddy](https://caddyserver.com/) -webserveri on asennettu. Mutta portti voisi olla myös esim. tämä portti `80`.

Olen myös merkinnyt rivin `443:443` pois käytöstä juuri sen vuoksi, että käytämme suojatun yhteyden muodostamiseen [Caddy](https://caddyserver.com/) -webserverin [reverse proxy](https://caddyserver.com/docs/quick-starts/reverse-proxy) -toimintoa, jolla saamme määritettyä suojatun yhteyden kalenteri -palvelimeen.

Asennuksen valmistuttua [Baïkal](https://sabre.io/baikal/) käynnistetään komennolla `docker-compose up -d`. Mikäli käynnistyksen yhteydessä tulee alla olevan mukainen virheilmoitus, niin kannatta aluksi käynnistää `docker` uudestaan komennolla `sudo systemctl restart docker` ja kokeilla sen jälkeen käynnistää [Baïkal](https://sabre.io/baikal/) uudestaan komennolla `docker-compose up -d`.

```
Error while fetching server API version: UnixHTTPConnectionPool(host='localhost', port=None): Read timed out. (read timeout=60)
```

Tässä vaiheessa voidaan tarkastaa, että käynnistyykö [Baïkal](https://sabre.io/baikal/), jotta saadaan tehtyä tarvittavat käyttäjäasetukset Baïkaliin. Eli mennään selaimella sivustolle `x.x.x.x:5232` ja mikäli sivustolla näkyy alla olevan mukainen virheilmoitus, tarkoittaa se sitä, että näiden hakemistojen käyttöoikeudet eivät ole kunnossa ja ne pitää korjata.

![](/images/baikal-kalenteripalvelimen-asennus-docker-composen-avulla-ja-suojatun-yhteyden-muodostus-caddyn-reverse-proxy-asetuksilla/kuva1.png)

Eli seuraavaksi meidän täytyy mennä Dockeriin "sisälle" antamalla komento

```
docker exec -it baikal_baikal_1 bash
```

Komennon jälkeen olemme Dockerissa [Baïkalin](https://sabre.io/baikal/) "kontin" sisällä ja seuraavaksi mennään hakemistoon `` `/var/www/baikal/` `` sekä tarkistetaan hakemistojen käyttöoikeus komennolla `ls -l`. Tällä komennolla saamme näkyviin käyttöoikeudet, jotka minulla ovat alla olevan mukaiset eli `config` -hakemistossa on `root` -käyttöoikeudet, jotka pitää muuttaa

![Baïkalin hakemistojen käyttöoikeudet ennen korjausta](images/baikal-kalenteripalvelimen-asennus-docker-composen-avulla-ja-suojatun-yhteyden-muodostus-caddyn-reverse-proxy-asetuksilla/kuva2.png)

Käyttöoikeudet saadaan muutettua oikeaksi komennolla

`chmod -R nginx:nginx config`

Nyt meillä pitäisi olla käyttöoikeudet asetettuna oikein kuten alla näkyy

![Baïkalin hakemistojen käyttöoikeudet korjauksen jälkeen](images/baikal-kalenteripalvelimen-asennus-docker-composen-avulla-ja-suojatun-yhteyden-muodostus-caddyn-reverse-proxy-asetuksilla/kuva3.png)

Seuraavaksi poistutaan "kontista" komennolla `exit` ja käynnistetään [Baïkal](https://sabre.io/baikal/) uudestaan komennolla `docker-compose up -d`.

### Baïkalin asetusvelho

Tämän jälkeen, kun avaamme uudestaan selaimella sivuston `x.x.x.x:5232`, niin meille pitäisi avautua alla olevan mukainen ikkuna

![Baïkalin asetusvelho](images/baikal-kalenteripalvelimen-asennus-docker-composen-avulla-ja-suojatun-yhteyden-muodostus-caddyn-reverse-proxy-asetuksilla/kuva4.png)

Seuraavaksi asetetaan aikavyöhyke oikeaksi, asetetaan `admin` -käyttäjän salasana ja tallennetaan muutokset. Tämän jälkeen avautuu uusi ikkuna

![Baïkalin tietokannan asetukset](images/baikal-kalenteripalvelimen-asennus-docker-composen-avulla-ja-suojatun-yhteyden-muodostus-caddyn-reverse-proxy-asetuksilla/kuva5.png)

Mikäli näkyviin tulee alla olevan näköinen virheilmoitus, niin `Specific` -hakemistosta puuttuu `db` -hakemisto, joka meidän tulee vielä luoda

![Baïkalin tietokannan virheilmoitus johtuen puuttuvasta kansioista](images/baikal-kalenteripalvelimen-asennus-docker-composen-avulla-ja-suojatun-yhteyden-muodostus-caddyn-reverse-proxy-asetuksilla/kuva6.png)

Eli palaamme takaisin "konttiin" komennolla `docker exec -it baikal_baikal_1 bash`, jossa luodaan hakemistoon `/var/www/baikal/Specific` uusi hakemisto `db` sekä annetaan hakemistolle oikeat käyttöoikeudet eli

```
cd /var/www/baikal/Specific
mkdir db
chown -R nginx:nginx db
```

Lopuksi poistutaan "kontista" komennolla `exit` ja päivitetään selaimen ikkuna. Nyt kaikki pitäisi olla kunnossa ja pääsemme jatkamaan eteenpäin

![Baïkalin tietokannan onnistunut asetus](images/baikal-kalenteripalvelimen-asennus-docker-composen-avulla-ja-suojatun-yhteyden-muodostus-caddyn-reverse-proxy-asetuksilla/kuva7.png)

Eli seuraavaksi painetaan nappia "`Start using Baïkal`" ja kirjaudutaan `admin` -tunnuksilla sisään

![Baïkalin admin -käyttäjän kirjautumisikkuna](images/baikal-kalenteripalvelimen-asennus-docker-composen-avulla-ja-suojatun-yhteyden-muodostus-caddyn-reverse-proxy-asetuksilla/kuva8.png)

Kirjautumisen jälkeen avautuu näkymä

![Baïkalin kojelauta](images/baikal-kalenteripalvelimen-asennus-docker-composen-avulla-ja-suojatun-yhteyden-muodostus-caddyn-reverse-proxy-asetuksilla/kuva9.png)

Kohdassa "`Users and resources`" luodaan käyttäjät

![Baïkalin käyttäjien luonti-ikkuna](images/baikal-kalenteripalvelimen-asennus-docker-composen-avulla-ja-suojatun-yhteyden-muodostus-caddyn-reverse-proxy-asetuksilla/kuva10.png)

Käyttäjän luomisen jälkeen meille on luotuna oletus -kalenteri ja -osoitekirja. Huom! myös sähköpostiosoite tarvitsee antaa käyttäjätietoja luodessa.

![Baïkalin käyttäjäikkuna](images/baikal-kalenteripalvelimen-asennus-docker-composen-avulla-ja-suojatun-yhteyden-muodostus-caddyn-reverse-proxy-asetuksilla/kuva11.png)

Nyt meillä on [Baïkal](https://sabre.io/baikal/) -kalenteripalvelin käytössä ja viimeiseksi tehdään vielä muutokset [Caddy](https://caddyserver.com/) -webserverille, jotta saadaan suojattu yhteys kalenteripalvelimeen.

### Caddyn reverse proxy asetukset

[Caddyn](https://caddyserver.com/) asetukset tehdään asetustiedostoon `/etc/caddy/Caddyfile` ja lisätään sinne alla olevat rivit, joilla ohjataan liikenne kalenteripalvelimelle. Tämä IP-osoite `x.x.x.x` on sen tietokoneen sisäverkon IP-osoite, jolle [Baïkal](https://sabre.io/baikal/) -kalenteripalvelin on asennettu ja `esimerkki.fi` on se web-sivuston osoite, joka luotiin Caddyn asennuksen yhteydessä.

```
#Baikal kalenteri
esimerkki.fi:5232 {
                reverse_proxy x.x.x.x:5232
}
```

Seuraavaksi käynnistetään vielä [Caddy](https://caddyserver.com/) uudestaan eli ajetaan komento

```
sudo systemctl restart caddy
```

Eli nyt kun avaamme nettiselaimessa osoitteen `https://esimerkki.fi:5232`, niin meille avautuu suojattu https -yhteys Baïkal -kalenteripalvelimen kirjautumisikkunaan. Kalenterin ja osoitekirjan osoitteen saan näkymään "`info`" -näppäimesta, kun avaa käyttäjän tiedot. Yleensä osoite on muotoa `https://esimerkki.fi:5232/dav.php/calendars/<kalenterin nimi>/default`.

