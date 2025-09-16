--- 
title: "MariaDB-tietokannan käyttöönotto Home Assistantissa"
date: "2022-09-10"
tags:
  - "docker"
  - "docker-compose"
  - "homeassistant"
  - "kotiautomaatio"
  - "mariadb"
  - "pymysql"
  - "sqlite"
  - "wordpress.org"
---

Seuraavaksi meillä olisi tarkoituksena käydä läpi hieman [Home Assistantin](https://www.home-assistant.io/) tietokantaa, joka on oletuksena [SQLite](https://www.sqlite.org/index.html) -tietokanta. Tämä tietokanta toimii hyvin pienissä järjestelmissä, mutta kun sensoreita ja muuta systeemiä alkaa olla enemmän käytössä, niin siinä vaiheessa voi tulla ongelmia vastaan. [MariaDB](https://mariadb.org/) -tietokanta on järkevää ottaa käyttöön jo heti alussa, niin siihen ei sitten tarvitse palata enää myöhemmin.

[MariaDB](https://mariadb.org/):n asennusta käytiin läpi myös aikaisemmassa [kirjoituksessa](#post/wordpress-org-php-ja-mariadb-asennus-caddy-web-serverille), jossa käsiteltiin [WordPress.org](https://wordpress.org/):n asennusta. Asennus etenee samaan tapaan, kuin [WordPress.org](https://wordpress.org/):n asennuksen yhteydessä eli lähtökohtana meillä on, että olemme siis jo asentaneet [MariaDB](https://mariadb.org/) ja ottaneet sen käyttöön.

Tämä asennus on tehty [Home Assistantin](https://www.home-assistant.io/) [Docker-Compose](https://docs.docker.com/compose/) -version kanssa, mutta se toiminee myös muussakin asennuksessa. Mikäli [Home Assistant](https://www.home-assistant.io/) on asennettu valmiin [levykuvan](https://www.home-assistant.io/installation/) kautta, niin tällöin lisäosista löytyy valmiina lisäosa [MariaDB](https://mariadb.org/) -tietokannan käyttöönottoa varten.

Aluksi luomme [Home Assistanttia](https://www.home-assistant.io/) varten tietokannan ja käyttäjän eli aluksi aluksi ajamme komennon

```
mysql -u root -p
```
Seuraavaksi luomme tietokannan `homeassistant`, käyttäjän `hauser` sekä päivitämme tietokannan oikeudet eli annetaan alla olevat komennot

```
CREATE DATABASE homeassistant;
CREATE USER ‘hauser’ IDENTIFIED BY ‘salasana’;
GRANT ALL PRIVILEGES on homeassistant.* TO 'hauser'@'localhost' IDENTIFIED BY 'salasana';
FLUSH PRIVILEGES;
exit;
```

Salasanaksi tulee tietysti valita jokin parempi salasana kuin esimerkissä käytetty `salasana`.

Seuraavaksi teemme tarvittavat muutokset [Home Assistantin](https://www.home-assistant.io/) puolelle eli lisäämme `configuration.yaml` -tiedostoon alla olevat rivit

```
recorder:
  db_url: mysql+pymysql://hauser:salasana@localhost/homeassistant?charset=utf8mb4
  purge_keep_days: 10
```

Edellä `purge_keep_days: 10` tarkoittaa sitä, että tallennamme tietokantaan tiedot viimeiseltä 10 vuorokaudelta. Tätä voi halutessaan muuttaa ja tarkempia asetusvaihtoehtoja, kuten esimerkiksi joidenkin tiettyjen sensorien pois jättäminen historiatiedoista, löytyy tämän seuraavan [linkin](https://www.home-assistant.io/integrations/recorder) takaa.

Voimme myös tehdä tietokannasta sensorin, joka kertoo tietokannan koon, lisäämällä `sensor:` -kohtaan alla olevat rivit

```
  - platform: sql
    db_url: mysql+pymysql://hauser:salasana@localhost/homeassistant
    queries:
      - name: DB size
        query: 'SELECT table_schema "database", Round(Sum(data_length + index_length) / 1024 / 1024, 1) "value" FROM information_schema.tables WHERE table_schema="home_assistant" GROUP BY table_schema;'
        column: 'value'
        unit_of_measurement: MB
```

Seuraavan kerran, kun päivitämme [Docker-Composen](https://docs.docker.com/compose/) avulla asennetun [Home Assistantin](https://www.home-assistant.io/), niin meille tulee käynnistyksen jälkeen todennäköisesti virheilmoitus `The recorder could not start`, joka johtuu siitä, että [Home Assistantin] [Docker] -versiossa ei ole asennettuna `pymysql` -tiedostoa. Tämä tilanne saadaan korjattua seuraavasti eli aluksi menemme [Home Assistantin](https://www.home-assistant.io/) dockeriin sisälle komennolla

```
docker exec -it homeassistant bash
```

Asennetaan `pymysql` -tiedosto komennolla

```
pip3 install pymysql
```

Lopuksi käynnistetään vielä [Home Assistant](https://www.home-assistant.io/) uudestaan, jonka jälkeen [MariaDB](https://mariadb.org/) -tietokannan pitäisi taas toimia normaalisti.

