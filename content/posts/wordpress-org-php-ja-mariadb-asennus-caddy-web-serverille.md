---
title: "WordPress.org, PHP ja MariaDB asennus Caddy web-serverille"
date: "2022-08-16"
categories: 
  - "caddy"
  - "linux"
  - "mariadb"
  - "php"
  - "raspberrypios"
tags: 
  - "caddy"
  - "mariadb"
  - "php"
  - "raspberrypios"
  - "wordpress.org"
---

Edellisessä kirjoituksessa asensimme [Caddy](/posts/caddy-web-serverin-asennus-raspberrypios-kayttojarjestelmaan//) web-serveriä [RaspberryPiOS](https://www.raspberrypi.com/software/) -käyttöjärjestelmälle ja nyt olisi tarkoitus jatkaa asennusta asentamalla ja konffaamalla seuraavaksi [WordPress.org](https://wordpress.org/) sekä siihen liittyen asentaa myös [PHP](https://www.php.net/) ja [MariaDB](https://mariadb.org/) -palvelin.

### PHP:n asennus

Aluksi asennetaan PHP ja me asennamme siitä version 8.1. Ensimmäiseksi päivitetään ohjelmistolähteet ja asennetaan tarvittaessa päivitykset komennolla

```
sudo apt update && sudo apt upgrade
```

PHP:n voisi asentaa myös suoraan ohjelmistolähteistä, mutta tämä on vanhempi versio 7.4. Me käytämme kuitenkin [DEB.SURY.ORG](https://deb.sury.org/) -sivuston ohjelmalähteitä, josta saamme asennettua uudemman version PHP:stä.

Ohjelmistolähteiden päivityksen jälkeen asennetaan tarvittavat lisäpaketit ennen PHP:n asennusta eli ajetaan komento

```
sudo apt install lsb-release ca-certificates apt-transport-https software-properties-common gnupg2
```

Tämän jälkeen lisätään [DEB.SURY.ORG](https://deb.sury.org/) -sivuston ohjelmalähteet

```
echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/sury-php.list
```

Seuraavaksi haetaan pakettien PGP -allekirjoitusavain ja lisätään se järjestelmään

```
wget -qO - https://packages.sury.org/php/apt.gpg | sudo apt-key add -
```

Ennen asennusta päivitetään vielä pakettilähteet ajamalla komento `sudo apt update`, josta myös näemme, että ohjelmistolähteet ovat asentuneet kunnolla.

Seuraavaksi asennamme [PHP](https://www.php.net/):n version 8.1. ja [WordPress.org](https://wordpress.org/):in tarvitsemat lisäpaketit komennolla

```
sudo apt install php8.1 php8.1-cli php8.1-fpm php8.1-mysql php8.1-zip php8.1-dev php8.1-gd php8.1-mcrypt php8.1-mbstring php8.1-curl php8.1-xml php8.1-bcmath php8.1-intl php8.1-imagick php-pear
```

Mikäli järjestelmä tarjoaa vielä muita paketteja, niin ne voi myös asentaa. PHP:n asennetun version voi tarkistaa komennolla

```
php -v
```

### MariaDB:n asennus

[MariaDB](https://mariadb.org/)\-palvelimen asennus suoritetaan komennolla

```
sudo apt install mariadb-server`
```

Seuraavaksi käynnistämme [MariaDB](https://mariadb.org/)\-palvelimen ja asetamme sen käynnistymään myös koneen käynnistyksen yhteydessä

```
sudo systemctl start mariadb
sudo systemctl enable mariadb
```

Seuraavaksi ajamme komennon `sudo mysql_secure_installation` ja asetamme `root` \-käyttäjälle salasanan.

Seuraaviin kysymyksiin voimme vastata `kyllä` eli

> poistetaanko anonyymit käyttäjät  
> estetäänkö `root` -käyttäjän etäkirjautuminen  
> poistetaanko `testi`\-tietokanta sekä oikeudet tietokantaan  
> ladataanko `käyttöoikeus`\-taulukko uudestaan  

Tämän jälkeen meillä on MariaDB asennettu ja otettu käyttöön.

### MariaDB tietokantojen luonti ja WordPressin asennus

Seuraavaksi jatkamme [WordPress.org](https://wordpress.org/):in asennukseen, joka aloitetaan luomalla [MariaDB](https://mariadb.org/)\-serverille tarvittavat käyttäjät ja tietokannat eli ajamme komennon

```
mysql -u root -p
```

Aluksi luomme tietokannan, jonka voi nimetä kuten haluat

```
CREATE DATABASE wordpress;
```

Seuraavaksi luodaan käyttäjä ja annetaan tarvittavat käyttöoikeudet eli kohtiin `'kayttäja'` ja `'salasana`' voit antaa haluamasi käyttäjätunnuksen ja salasanan, mutta ilman skandinaavisia kirjaimia.

```
GRANT ALL PRIVILEGES on wordpress.* TO 'kayttajä'@'localhost' IDENTIFIED BY 'salasana';
```

Seuraavaksi päivitetään tietokannan käyttöoikeudet

```
FLUSH PRIVILEGES;
```

Ja poistutaan [MariaDB](https://mariadb.org/)\-serveriltä komennolla

```
exit;
```

Seuraavaksi mennään hakemistoon `/tmp` komennolla `cd /tmp` ja ladataan WordPress.org:in uusin versio eli

```
wget https://wordpress.org/latest.zip
```

Puretaan paketti komennolla

```
unzip latest.zip
```

Siirretään purettu kansio [Caddy](https://caddyserver.com/) web-serverin asennuksen yhteydessä luotuun hakemistoon `/var/www/html/esimerkki.fi` komennolla

```
sudo mv wordpress/ /var/www/html/esimerkki.fi/
```

Asetetaan vielä kansion käyttäjäoikeudet kuntoon

```
sudo chown -R www-data:www-data /var/www/html/esimerkki.fi/wordpress/
sudo chmod 0755 /var/www/html/esimerkki.fi/wordpress/
```

Siirrytään WordPressin hakemistoon

```
cd /var/www/html/esimerkki.fi/wordpress/
```

Seuraavaksi konfiguroidaan tietokannan tiedot

```
mv wp-config-sample.php wp-config.php
sudo nano wp-config.php
```

Tehdään tiedostoon seuraavat muutokset

```
define( 'DB_NAME', 'wordpress' );
define( 'DB_USER', 'kayttäja' );
define( 'DB_PASSWORD', 'salasana' );
define( 'DB_HOST', 'localhost' );
define( 'DB_CHARSET', 'utf8' );
define( 'DB_COLLATE', '' );
```
Seuraavaksi käydään sivustolla `[https://api.wordpress.org/secret-key/1.1/salt/](https://api.wordpress.org/secret-key/1.1/salt/)` , josta saadaan satunnaisesti luodut tiedot kohtiin

```
define( 'AUTH_KEY', 'put your unique phrase here' );
define( 'SECURE_AUTH_KEY', 'put your unique phrase here' );
define( 'LOGGED_IN_KEY', 'put your unique phrase here' );
define( 'NONCE_KEY', 'put your unique phrase here' );
define( 'AUTH_SALT', 'put your unique phrase here' );
define( 'SECURE_AUTH_SALT', 'put your unique phrase here' );
define( 'LOGGED_IN_SALT', 'put your unique phrase here' );
define( 'NONCE_SALT', 'put your unique phrase here' );
```

Viimeisenä tehdään vielä muutokset [Caddy](https://caddyserver.com/) web-serverin asetustiedostoon eli avataan `Caddyfile` -tiedosto ja muokataan se kuvan mukaiseksi

![](/images/wordpress-org-php-ja-mariadb-asennus-caddy-web-serverille/kuva1.png)

_Kuva: /etc/caddy/Caddyfile_

Vielä viimeiseksi ennen WordPressin configuroimista käynnistetään `Caddy` uudestaan eli

```
sudo systemctl restart caddy
```

### WordPress.org kielen valinta, käyttäjätunnus ja salasana

Seuraavaksi avaamme internet-sivuston, joka luotiin aikaisemmin ja suoritamme WordPressin konfiguroimisen loppuun sitä kautta eli `https://esimerkki.fi/` (tai mikä sinun sivuston nimi oli).

Sivuston avaamisen jälkeen pitäisi avautua `admin` -ikkuna, jossa aluksi valitaan WordPressin asennuskieli ja sen jälkeen asetetaan käyttäjätunnus sekä salasana.

Nyt meillä pitäisi olla asennettuna ja konffattuna [WordPress.org](https://wordpress.org/), [PHP8.1](https://deb.sury.org/) ja [MariaDB](https://mariadb.org/) eli seuraavaksi tuleekin sitten muokata sivusto omanlaiseksi ja asentaa tarvittavia lisäosia.

Itse otin aluksi käyttöön turvallisuuteen liittyviä lisäosia kuten kaksi-vaiheinen tunnistus, varmuuskopiointi sekä myös lisäosa, jolla voi turvautua brute-force hyökkäyksiä vastaan. Tämän jälkeen pystyykin sitten keskittymään muuhun sisältöön, asetuksiin ja lisäosiin, kun tietää, että sivusto on turvassa.

