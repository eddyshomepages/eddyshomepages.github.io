---
title: "Caddy web-serverin asennus RaspberryPiOS -käyttöjärjestelmään"
date: "2022-08-09"
tags: 
  - "apache2"
  - "bullseye"
  - "caddy"
  - "debian"
  - "dna"
  - "dy.fi"
  - "elisa"
  - "letsencrypt"
  - "nextcloud"
  - "owncloud"
  - "raspberrypios"
  - "wordpress.org"
  - "zerossl"
---

Tässä blogissa on tarkoitus käydä läpi [Caddy](https://caddyserver.com/) web-serverin asennus [RaspberryPiOS](https://www.raspberrypi.com/software/) -käyttöjärjestelmään, josta minulla on käytössä Bullseye -versio (Debian 11).

Myös tämän sivuston pohjana käytetään Caddy web-serveriä ja syy miksi päädyin käyttämään Caddya, on sen keveys ja helppo konfigurointi. Minulla on myös jonkin verran kokemusta [Apache2](https://httpd.apache.org/):sta, joka minulla oli käytössä, kun aikoinani asentelin [OwnCloud](https://owncloud.com/)/[Nextcloud](https://nextcloud.com/) -palvelimia omaan käyttööni, mutta Apache2:een verrattuna Caddy on mielestäni huomattavasti helpompi konffata.

[Caddy](https://caddyserver.com/) web-server on myös siitä vekkuli, että se tarjoaa automaattisesti sertifikaatin joko [Let's Encrypt](https://letsencrypt.org/fi/):in tai [ZeroSSL](https://zerossl.com/):n kautta sekä asettaa https-yhteyden oletuksena päälle ja ohjaa liikenteen automaattisesti portista 80 porttiin 443 eli suojattuun https-yhteyteen. Lisäksi [Caddy](https://caddyserver.com/) huolehtii myös siitä, että sertifikaatti pysyy automaattisesti ajan tasalla. Toimiakseen tämä tarvitsee nettiyhteydeltä sen, että portit 80 ja 443 ovat auki eli esim. [Elisan](https://elisa.fi/kauppa/nettiliittymat/kiinteat-laajakaistat) yhteydellä tämä toimii, mutta [DNA](https://tuki.dna.fi/org/dna-fi/d/avoimet-portit-oarm/):lla ovat nämä portit operaattorin toimesta suljettuna ja niitä ei saa mitenkään auki ellei sitten käytä [IPv6](https://fi.wikipedia.org/wiki/IPv6)\-protokollaa.

Jotta sitten saat ohjattua liikenteen vielä oikeaan osoitteeseen, tarvitsee käyttää dynaamista DNS-palvelua, joka minulla on kotimainen [dy.fi](https://www.dy.fi/) DNS-palvelu. Tämä palvelu on ilmainen ja on tarkoitettu vain suomalaisille käyttäjille.

### Caddyn asennus

Caddyn asennus onnistuu Debian 11 Bullseye -versiolle (ohje toimii myös [RaspberryPiOS](https://www.raspberrypi.com/software/) ja [Armbian](https://www.armbian.com/) Bullseye -versioilla) tehdyn [ohjeen](https://caddyserver.com/docs/install#debian-ubuntu-raspbian) mukaisesti seuraavasti

```
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

Tämän jälkeen meillä on Caddy asennettuna ja käynnistettynä. Caddy web-serverin tilan voi tarkistaa komennolla

```
sudo systemctl status caddy
```

Em. komennon jälkeen pitäisi tulla jotakuinkin alla olevan kuvan mukainen ilmoitus, josta näemme, että Caddy on käynnissä.

![](/images/caddy-web-serverin-asennus-raspberrypios-kayttojarjestelmaan/kuva1.png)

Jos avaamme selaimella sivuston `http://x.x.x.x` (x.x.x.x on koneen IP-osoite, johon Caddy on asennettu), niin näemme sivun

![](/images/caddy-web-serverin-asennus-raspberrypios-kayttojarjestelmaan/kuva2.png)

_Kuva: Caddy toimii!_

Tämä näkymä on selaimessa oletuksena Caddyn asennuksen jälkeen ja kertoo siitä, että asennus on onnistunut.

### Palomuurin asennus ja konffaus

Tässä vaiheessa viimeistään on myös hyvä tarkastaa ja tarvittaessa asentaa palomuuri, mikäli sitä ei ole asennettu, eli sen asennus tapahtuu komennolla

```
sudo apt install ufw
```

Ennen kuin palomuuri otetaan käyttöön, avataan siitä tarvittavat portit eli

```
sudo ufw allow 22
sudo ufw allow http && sudo ufw allow https
```

Nämä avatut portit ovat 22 (ssh), 80 (http) ja 443 (https). Portti 22 avattiin sen vuoksi, että kun palomuuri otetaan käyttöön, niin ssh-yhteys ei katkea. Palomuuri saadaan käyttöön komennolla

```
sudo ufw enable
```

Palomuurin tila saadaan tarkastettua komemmolla

```
sudo ufw status
```

### Caddyn konffaus

Seuraavaksi lähdemme luomaan omaa nettisivustoa ja aluksi luodaan hakemisto, johon web-serverin tiedostot tallennetaan eli tässä tapauksessa meillä olisi käytössä web-osoite `www.esimerkki.fi`. Nimen voit valita sen mukaan, mikä sinulle tulee oman sivuston osoitteeksi.

```
sudo mkdir /var/www/html/esimerkki.fi
```

Luodaan testisivusto `index.html` edellä luotuun hakemistoon

```
sudo nano /var/www/html/esimerkki.fi/index.html
```

Ja kirjoitetaan tiedostoon alla oleva teksti ja tallennetaan tiedosto

```
<!doctype html><head><title>Caddy Test Page</title></head><body><h1>Hello, World!</h1></body></html>
```

Tämän jälkeen muutetaan vielä hakemiston käyttöoikeudet oikeaksi komennolla

```
sudo chown -R www-data:www-data /var/www/html/esimerkki.fi
```

Seuraavaksi konfiguroidaan Caddyn konffitiedosto

```
sudo nano /etc/caddy/Caddyfile
```

![](/images/caddy-web-serverin-asennus-raspberrypios-kayttojarjestelmaan/kuva3.png)

Tiedostoa muokataan muuttamalla riviä `root * /usr/share/caddy` muotoon `root * /var/www/html/esimerkki.fi`

![](/images/caddy-web-serverin-asennus-raspberrypios-kayttojarjestelmaan/kuva4.png)

Tallennuksen jälkeen käynnistetään vielä Caddy uudestaan eli

```
sudo systemctl restart caddy
```

Seuraavaksi kun avaamme taas selaimessa sivuston `http://x.x.x.x` , niin näemme uuden aikaisemmin luodun sivuston.

![](/images/caddy-web-serverin-asennus-raspberrypios-kayttojarjestelmaan/kuva5.png)

Eli nyt meillä on [Caddy](https://caddyserver.com/) asennettuna ja konffattuna avaamaan oman aiemmin luotu nettisivu. Seuraavaksi lähdemme asentamaan [WordPress.org](https://wordpress.org/) -blogialustaa, mutta tästä tarkemmin sitten seuraavassa kirjoituksessa.

