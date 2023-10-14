---
title: "Mycroft -virtuaaliavustimen asennus ja käyttöönotto"
date: "2022-12-26"
categories: 
  - "almond-genie"
  - "emby"
  - "home-assistant"
  - "kotiautomaatio"
  - "linux"
  - "mycroft"
  - "picroft"
  - "raspberrypios"
  - "virtuaaliavustin"
tags: 
  - "almond"
  - "emby"
  - "genie"
  - "homeassistant"
  - "kotiautomaatio"
  - "mycroft"
  - "picroft"
  - "raspberrypios"
  - "virtuaaliavustin"
---

Kirjoitin taannoin [Genie](https://wiki.almond.stanford.edu/) -[virtuaaliavustimen](/posts/almond-genie-virtuaaliavustimen-lisaaminen-home-assistantiin/) sekä [ääniohjauksen](/posts/aaniohjauksen-lisaaminen-almond-genie-virtuaaliavustimeen/) käyttöönotosta [Home Assistantin](https://www.home-assistant.io/) kanssa, mutta yrityksistä huolimatta en ole kuitenkaan saanut ratkaistua sijaintiongelmaa, joten päätin kokeilla myös toista avoimen lähdekoodin järjestelmää nimeltään [Mycroft](https://mycroft.ai/).

[Mycroft](https://mycroft.ai/) vaikuttaa lupaavalta siinäkin mielessä, että sillä pystyy [Home Assistantin](https://www.home-assistant.io/) lisäksi komentamaan mm. [Emby-media](https://emby.media/) -serveriä, jonka pystyttämisestä myös [kirjoittelin](/posts/oman-streemauspalvelun-rakentaminen/) aikaisemmin. [Mycroftin](https://mycroft.ai/) avulla pystyy myös mm. kuuntelemaan [Yle Areenan](https://areena.yle.fi/tv) kautta tuoreimmat kotimaan uutiset ja lisäksi siihen on saatavilla paljon muitakin lisätaitoja eli ns. Skills:ejä, joista löytyy enemmän tietoa Mycroftin [sivustolta](https://market.mycroft.ai/skills).

[Mycroftin](https://mycroft.ai/) pystyy asentamaan siten, että se toimii ainoastaan omassa kotiverkossa, mutta tällöin avustimen puhesyntetisaattorina ([TTS, Text to Speech engines](https://en.wikipedia.org/wiki/Speech_synthesis)) toimii [Mimic1](https://mycroft-ai.gitbook.io/docs/mycroft-technologies/mimic-tts/mimic-overview), joka on ääneltään aika robottimainen. Tosin se on nopea ja kevyt, kun taas uudempi [Mimic2](https://mycroft-ai.gitbook.io/docs/mycroft-technologies/mimic-tts/mimic-2), joka on oletuksena ja joka toimii täysin pilven kautta. Lisäksi on saatavilla myös uusin versio [Mimic3](https://mycroft-ai.gitbook.io/docs/mycroft-technologies/mimic-tts/mimic-3), joka toimii niin ikään Mimic1:n lailla omassa kotiverkossa, mutta se taas vaatii asennusalustalta enemmän tehoa, mutta esim. [RaspberryPi 4](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/):n kanssa sen pitäisi toimia hyvin. Lisää tietoa näistä löytyy tämän [linkin](https://mycroft-ai.gitbook.io/docs/mycroft-technologies/mimic-tts) takaa.

### Mycroftin asennus käyttäen Picroft -levykuvaa

Minulla oli käyttämättömänä yksi kpl [RaspberryPi 3](https://www.raspberrypi.com/products/raspberry-pi-3-model-b/) -tietokoneita, joten päätin kokeilla valmista [Picroft](https://mycroft-ai.gitbook.io/docs/using-mycroft-ai/get-mycroft/picroft) -levykuvaa, joka perustuu [RasberryPiOS](https://www.raspberrypi.com/software/):n Buster -versioon. Asennus oli hyvin suoraviivainen eli aluksi ladataan Picroftin [levykuva](https://mycroft-ai.gitbook.io/docs/using-mycroft-ai/get-mycroft/picroft) ja tallennetaan se muistikortille esim. [Balena Etcher](https://www.balena.io/etcher/) -sovelluksella. Tämän jälkeen laitetaan muistikortti Raspiin ja virrat päälle, jonka jälkeen käyttöjärjestelmä käynnistyy ja meillä pitäisi olla [Mycroftin](https://mycroft.ai/) asennus valmiina. Yleensä [Picroft](https://mycroft-ai.gitbook.io/docs/using-mycroft-ai/get-mycroft/picroft) löytää laitteet automaattisesti, kuten minulla, mutta joskus niiden kanssa voi tulla ongelmia.

[Mycroftin](https://mycroft.ai/) asennuksen lisäksi tarvitaan myös mikrofoni sekä kaiuttimet ja minulle on käytössä [Audio Technica ATR4697-USB](https://www.audio-technica.com/en-eu/atr4697-usb) -mikrofoni sekä kaiuttimena tällainen pieni Trustin valmistama [soundbar](https://www.trust.com/en/product/22946-arys-soundbar-for-pc), jotka molemmat sopivat olohuoneen tasolle ihan kivasti. Musiikin kuuntelua varten olen yhdistänyt [Picroftin](https://mycroft-ai.gitbook.io/docs/using-mycroft-ai/get-mycroft/picroft) stereoihin, jollon musiikit saa kuunneltua myös stereoiden kautta.

### Mycroftin käyttöön ottaminen

Ennen [Mycroftin](https://mycroft.ai/) käyttöönottoa luodaan [pilvipalveluun](https://home.mycroft.ai) käyttäjätunnus, jonka voi luoda esim. olemassa olevan Google-tilin avulla. Tilin luomisen jälkeen kirjaudutaan sisään, jolloin vasemmalla näkyy valikko `My Mycroft`, jonka alta valitaan kohta `Devices` (kuva alla)

![](/images/mycroft-virtuaaliavustimen-asennus-ja-kayttoonotto/kuva1.png)

_Kuva: My Mycroft -valikko_

![](/images/mycroft-virtuaaliavustimen-asennus-ja-kayttoonotto/kuva2.png)

_Kuva: Laitteen lisääminen_

Seuraavaksi painetaan kohdasta `Add Device`, jonka jälkeen avautuu alla olevan mukainen ikkuna

![](/images/mycroft-virtuaaliavustimen-asennus-ja-kayttoonotto/kuva3.png)

_Kuva: Laitteen lisäämisen ikkuna_

Tässä ikkunassa annetaan tarvittavat tiedot kuten oman kodin sijainti, laitteen nimi, laitteen sijainti, aikavyöhyke sekä myös kaikkein tärkein eli `Pairing Code`. `Pairing Code` saadaan laitteelta, johon asensimme [Picroft](https://mycroft-ai.gitbook.io/docs/using-mycroft-ai/get-mycroft/picroft) -käyttöjärjestelmän ja koodi saadaan siten, että sanotaan [Mycroftille](https://mycroft.ai/) `"Hey Mycroft, pair my device"`. Tämän jälkeen ääniavustin kertoo koodin (6 merkkiä) englanninkielisinä ja se sisältää numeroita ja kirjaimia.

HUOM. Vinkkinä, että mikäli koodin kuuleminen ei kunnolla onnistu, niin kirjaudu Picroftille SSH:n (SSH toimii myös Windowsin komentokehotteessa antamalla komento `ssh pi@x.x.x.x`, oletussalasana on `mycroft`) avulla ennen koodin pyytämistä, jolloin saat koodin näkyviin päättee kohdan `History` alapuolella.

![](/images/mycroft-virtuaaliavustimen-asennus-ja-kayttoonotto/kuva4.png)

_Kuva: Picroftiin kirjautuminen SSH:n avulla_

Picroftin parittamisen jälkeen laite näkyy `My Mycroft` -sivulla kohdan `Devices` alla seuraavasti:

![](/images/mycroft-virtuaaliavustimen-asennus-ja-kayttoonotto/kuva5.png)

_Kuva: Laitehallinta, jossa liitetyt laitteet näkyvät_

### Taitojen eli Skillsien asentaminen

[Mycroftilla](https://mycroft-ai.gitbook.io/docs/skill-development/voice-user-interface-design-guidelines) on jo valmiiksi asennettuja erilaisia taitoja eli `Skills`:ejä (jatkossa taito) ja niitä saa asennettua lisää antamalla [Mycroftille](https://mycroft.ai/) äänikomento `install <taidon nimi>` tai vaihtoehtoisesti SSH:n kautta komennolla `mycroft-msm install <taidon nimi>`. Esimerkiksi [Home Assistant](https://www.home-assistant.io/) -taito saadaan lisättyä [Mycroftiin](https://mycroft.ai/) antamalla äänikomento `install home assistant` tai SSH:n kautta komennolla `mycroft-msm install home assistant`.

#### Home Assistant -taidon asetukset

[Home Assistant](https://www.home-assistant.io/) -taidon asentamisen jälkeen täytyy vielä tehdä [Home Assistantin](https://www.home-assistant.io/) osalta tarvittavat asetukset, jotka löytyvät vasemmalta valikosta kohdasta `Skills` (kuva alla), johon asennetut taidot tulevat näkyviin

![](/images/mycroft-virtuaaliavustimen-asennus-ja-kayttoonotto/kuva6.png)

_Kuva: Skills -valikko_

Tämän jälkeen valitaan asennetuista taidoista [Home Assistant](https://www.home-assistant.io/), jolloin avautuu alla olevan mukainen ikkuna

![](/images/mycroft-virtuaaliavustimen-asennus-ja-kayttoonotto/kuva7.png)

_Kuva: Home Assistant skills -asetukset_

Täällä annetaan [Home Assistantin](https://www.home-assistant.io/) `IP-osoite` sekä `Long Lived Access Token`, joka pitää luoda [Home Assistantin](https://www.home-assistant.io/) `käyttäjä profiili` -kohdan kohdassa `Pitkäaikaiset käyttötunnussanomat`

![](/images/mycroft-virtuaaliavustimen-asennus-ja-kayttoonotto/kuva8.png)

_Kuva: Home Assistant - käyttäjäprofiili_

![](/images/mycroft-virtuaaliavustimen-asennus-ja-kayttoonotto/kuva9.png)

_Kuva: Home Assistant - Pitkäaikaiset käyttötunnussanomat_

Seuraavaksi valitaan kohta `Luo token` ja annetaan sille jokin nimi ja painetaan `OK`. Tämän jälkeen ikkunaan tulee koodi, joka kopioidaan ja lisätään [My Mycroftin](https://home.mycroft.ai/) [Home Assistant](https://www.home-assistant.io/) -taidon kohtaan `Long Lived Access Token`.

Tämän jälkeen voidaan kokeilla esimerkiksi sammuttaa valot antamalla [Mycroftille](https://mycroft.ai/) komento `Turn off <valaisimen nimi>`. Tässä täytyy taas huomioida, että [Home Assistantissa](https://www.home-assistant.io/) kannattaa nimetä valaisimet yms. englannin kielisenä, jolloin [Mycroft](https://mycroft.ai/) ymmärtää käskyt paremmin.

Lisää taidoista kuten myös muistakin asetuksista löytyy enemmän Mycroftin sivulta [https://mycroft-ai.gitbook.io/docs/skill-development/mycroft-skills-manager](https://mycroft-ai.gitbook.io/docs/skill-development/mycroft-skills-manager).

