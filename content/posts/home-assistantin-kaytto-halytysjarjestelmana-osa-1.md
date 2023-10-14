---
title: "Home Assistantin käyttö hälytysjärjestelmänä, osa 1"
date: "2023-01-23"
categories: 
  - "docker"
  - "docker-compose"
  - "hacs"
  - "halytysjarjestelma"
  - "homeassistant"
  - "kotiautomaatio"
  - "ups"
  - "zigbee"
  - "zwave"
tags: 
  - "alarmo"
  - "docker"
  - "docker-compose"
  - "github"
  - "homeassistant"
  - "nodemcu"
  - "rfid"
  - "ups"
  - "zigbee"
  - "zwave"
---

Seuraavaksi ajattelin kirjoittaa [Home Assistantin](https://www.home-assistant.io/) käyttämisestä hälytysjärjestelmänä ja haluan myös heti jo tässä vaiheessa huomauttaa, että minä en kuitenkaan ota vastuuta siitä, jos joku henkilö tulee ja pääsee murtautumaan sisälle sen perusteella, että on järjestelmää rakentanut näiden minun ohjeiden mukaisesti.

[Home Assistant](https://www.home-assistant.io/) ei tietenkään ole kaupallisten versioiden veroinen lähinnä ehkä siksi, että laiteyhteydet voivat tekniikasta riippuen pätkiä, jolloin ne putoavat pois järjestelmästä. Mutta esim. laadukkaat [Zigbee](https://en.wikipedia.org/wiki/ZigBee)\- tai [Zwave](https://en.wikipedia.org/wiki/Z-Wave) -laitteet pitävät kyllä hyvin yhteydet yllä. Samoin tulee myös huolehtia siitä, että järjestelmän virransaanti on turvattu esim. [UPS](https://fasted.dy.fi/index.php/2022/07/uuden-upsin-kayttoonotto-ja-nutin-asennuksen-kertaus/):in avulla siinä vaiheessa, jos ja kun sähköt mahdollisesti menevät poikki.

Nämä em. seikat kun huomioi, niin mielestäni [Home Assistantia](https://www.home-assistant.io/) pystyy hyvinkin käyttämään hälytysjärjestelmän "keskusyksikkönä" hyväksyen kuitenkin sen tosiasian, että aivan kaupallisien versioiden toimintavarmuutta sillä ei välttämättä saada. Ja mikäli järjestelmästä haluaa saada mahdollisimman kattavan, niin se tietysti vaatii myös erilaisia antureita, liiketunnistimia, paloilmaisimia jne, mutta hyvälaatuisilla laitteilla järjestelmästä saa kuitenkin toimivan. Itse käytän [Home Assistantin](https://www.home-assistant.io/) kanssa pääasiassa [Zigbee](https://en.wikipedia.org/wiki/ZigBee)\- ja [Zwave](https://en.wikipedia.org/wiki/Z-Wave) -laitteita sekä [HACS](https://hacs.xyz/):in kautta saatavaa [Alarmo](https://github.com/nielsfaber/alarmo) -lisäosaa, mutta [Home Assistantiin](https://www.home-assistant.io/) saa myös itse koodattua tarpeelliset jutut ilman sitä.

HUOM! [HACS](https://hacs.xyz/) vaatii toimiakseen [Github](https://github.com/) -tilin, mutta mikäli sinulla ei sellaista ole, niin [Alarmon](https://github.com/nielsfaber/alarmo) saa asennettua myös manuaalisesti [Home Assistantin](https://www.home-assistant.io/) `custom_components` ominaisuutta hyödyntäen ja tarkemmin tietoja siitä löytyy [tekijän](https://github.com/nielsfaber/alarmo) Niels Faberin [Github](https://github.com/) -sivuilta.

Minulla itselläni [Home Assistantiin](https://www.home-assistant.io/) on yhdistetty vuotovahteja, palovaroittimia, ovitunnistimia, kameroita, sireeni sekä myös paljon muuta, joten näistä saa hyvän kombinaation hälytysjärjestelmän pohjaksi. Olen myös tehnyt mm. [NodeMCU](https://www.nodemcu.com/index_en.html) -kehityskortin ja [Joy-IT RFID -lukijan](https://joy-it.net/en/products/SBC-RFID-RC522) avulla lukijan, josta [RFID](https://en.wikipedia.org/wiki/RFID) -tagia käyttämällä saa laitettua hälyt päälle sekä myös otettua ne pois päältä. Ja lisäksi tietenkin täytyy myös ohjelmoida [Home Assistantiin](https://www.home-assistant.io/) tarvittavat automaatiot, jotta järjestelmä tietää mitä milloinkin täytyy tehdä.

#### HACS:in asennus

Minulla [Home Assistant](https://www.home-assistant.io/) on [asennettuna](https://fasted.dy.fi/index.php/2022/08/home-assistantin-asennus-docker-composen-avulla/) [Docker-Composen](https://docs.docker.com/compose/) avulla eli minun täytyy asentaa [HACS](https://hacs.xyz/) sen mukaisesti. Aluksi siis kirjaudumme Raspiin, johon [Home Assistant](https://www.home-assistant.io/) on asennettu ja menemme [Dockeriin](https://www.docker.com/) "sisälle" komennolla `docker exec -it homeassistant bash`. Seuraavaksi ladataan [HACS](https://hacs.xyz/):in asennus scripti komennolla `wget -O - https://get.hacs.xyz | bash -` ja annetaan scriptin hoitaa [HACS](https://hacs.xyz/):in asennus. Ennen kuin mennään eteenpäin, käynnistetään [Home Assistant](https://www.home-assistant.io/) vielä uudestaan, jonka jälkeen [HACS](https://hacs.xyz/) asennetaan [Home Assistantin](https://www.home-assistant.io/) integraatioiden kautta.

#### Alarmon asennus ja konfigurointi

Asennuksen jälkeen etsitään [HACS](https://hacs.xyz/)in ohjelmalähteistä [Alarmo](https://github.com/nielsfaber/alarmo) ja asennetaan se. Asennuksen jälkeen [Home Assistant](https://www.home-assistant.io/) tulee käynnistää uudestaan, jotta [Alarmo](https://github.com/nielsfaber/alarmo) aktivoituu. Tämän jälkeen [Alarmo](https://github.com/nielsfaber/alarmo) voidaan asentaa integraatioiden kautta eli haetaan sieltä käsin [Alarmo](https://github.com/nielsfaber/alarmo) ja asennetaan se. Asennuksen jälkeen [Alarmo](https://github.com/nielsfaber/alarmo) pitäisi tulla näkyviin vasemmalle sivupalkkiin eli valitaan se seuraavaksi. Tämän jälkeen tulee näkyviin neljä erilaista välilehteä, jotka ovat `General`, `Sensors`, `Codes` ja `Actions` (kuva alla).

![](/images/home-assistantin-kaytto-halytysjarjestelmana-osa-1/kuva1.webp)

`General` kohdasta voidaan asettaa erilaisia tiloja hälytysjärjestelmälle kuten esim. `Poissa-` ja `Kotona-`tila. `Poissa` -tilassa voidaan asettaa aktivoitumaan esim. kaikki ovi- ja liiketunnistimet, vuotovahdit, palovaroittimet jne, kun taas `Kotona` -tilassa voidaan aktivoida pelkästään ovitunnistimet, vuotovahdit ja palovaroittimet. Eli miten vain haluaa tehdä.

`Sensors` -kohdasta voidaan lisätä järjestelmään halutut anturit ja valita, että mitkä niistä aktivoituvat aina ja mitkä esim. vain silloin kun ollaan kotona.

`Codes` -kohdassa annetaan järjestelmän käyttäjät ja heille omat `pin` -koodit tai `salasanat`, joilla järjestelmän saadaan kytkettyä päälle ja pois. Samoin tässä voidaan määrittää, että hälytykset voidaan ottaa pois käytöstä vain koodilla ja että ne voidaan esim. ilman koodia laittaa päälle.

`Actions` -kohdassa määritetään toimenpiteet, joita järjestelmä tekee, kun esim. hälytysjärjestelmä on lauennut tai se ei mene jostain syystä päälle. Minulla esim. hälytysten mennessä päälle alkaa sireeni soimaan, ulkovalot välkkymään ja lisäksi tulee vielä puhelimeen ilmoitus asiasta. Tässä kohdassa voidaan myös määrittää muut ilmoitukset, joita järjestelmä lähettää esim. silloin kuin hälytysjärjestelmä on kytkeytymässä päälle.

Lisäksi myös [Home Assistantin](https://www.home-assistant.io/) automaatioissa voidaan [Alarmon](https://github.com/nielsfaber/alarmo) lisäksi määrittää erilaisia toimenpiteitä sen mukaan miten järjestelmä reagoi tietyissä tilanteissa kuten silloin, kun hälytysjärjestelmä on lauennut.

Eli tämä tällä kertaa ja käydään sitten seuraavissa kirjoituksissa läpi muita juttuja, joita [Alarmon](https://github.com/nielsfaber/alarmo) avulla voidaan tehdä samoin kuin mm. tätä [RFID](https://en.wikipedia.org/wiki/RFID) -lukijan rakentamista ja yhdistämistä [Home Assistantiin](https://www.home-assistant.io/).

