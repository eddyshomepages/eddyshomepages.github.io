---
title: "Mitä olen vuosien aikana puuhaillut"
date: "2022-07-13"
tags: 
  - "agendvr"
  - "armbian"
  - "bananapi"
  - "caddy"
  - "debian"
  - "docker"
  - "domoticz"
  - "esphome"
  - "homeassistant"
  - "jabber"
  - "kotiautomaatio"
  - "linux"
  - "linux-mint-debian-edition"
  - "matrix"
  - "mqtt"
  - "openhab"
  - "openvpn"
  - "raspberrypi"
  - "raspberrypios"
  - "redhat"
  - "rfxcom"
  - "ruuvitag"
  - "slackware"
  - "ssh"
  - "syncthing"
  - "tvheadend"
  - "wordpress.org"
  - "xmpp"
  - "yleinen"
  - "zwave"
  - "zigbee"
  - "zigbee2mqtt"
  - "zwavejs2mqtt"
---

Kertokoon tämä ensimmäinen kirjoitus hiukan siitä, että mitä kaikkea on tullutkaan puuhailtua vuosien varrella.

Eli viimeiset reilut parikymmentä vuotta olen oikestaan enemmän toiminut Linuxin kanssa kuin Windowsin kanssa. Linuxin ensimmäiset asennukset taisivat olla [RedHat](https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux):in versio 7 ja [Slackware Linux](http://www.slackware.com/):in versio 8. Tämän jälkeen, kun pääsin sisälle Linuxiin, on se ollut pääsääntöisesti käytössä ja Windowsin käyttö ollut enemmän työkäyttöä. Nykyisin opiskelun myötä on tullut syvennyttyä paremmin myös Windowsin maailmaan ja sekin on nykyisellään hyvin hallussa.

Omaan käyttöön on nykyisellään vakiintunut Debian ja sen eri versiot. Kannettavalle tietokoneelle on asennettu [Linux Mint Debian Edition](https://linuxmint.com/download_lmde.php) ja palvelinkoneella on puhdas versio [Debian](https://www.debian.org/):ista, joka on tosin vielä vanhempi Buster. Näille pikkutietokoneille, kuten [RaspberryPi](https://www.raspberrypi.org/) ja [BananaPi](https://www.banana-pi.org/) on myös asennettu Debianin johdannaiset [Raspberry Pi OS](https://www.raspberrypi.com/software/) ja [Armbian](https://www.armbian.com/).

Linuxin kanssa on tullut opeteltua ja asennettua jos jonkinlaista, kuten tämä palvelinkone, joka toimii mm. varmuuskopio-, DigiTV- ja kameravalvonnan palvelimena. RaspberryPi -koneita on käytössä mm. kotiautomaatiojärjestelmän pohjana, kalenteripalvelimena ja pikaviestipalvelimena.

Palvelinkoneen käyttöjärjestelmänä on [Debian](https://www.debian.org/):in Buster-versio, jota päivitän ja säädän [SSH](https://www.linux.fi/wiki/SSH):n välityksellä päätteessä samoin kuin myös nämä [RaspberryPi](https://www.raspberrypi.org/) ja [BananaPi](https://www.banana-pi.org/) -pikkutietokoneet. Palvelimella käyttöjärjestelmä on asennettu omalla kiintolevylle ja tallennustilana on neljä 1 Tt kiintolevyä, jotka on asennettu RAID5 -pakkaan. Tällä on saatu tallennustilaa n. 3Tt ja lisäksi parempi vikasietoisuus eli yksi kiintolevy neljästä voi hajota ja tiedot ovat vielä kuitenkin palautettavissa.

Palvelinkoneen, puhelimen ja kannettavan tietokoneen välinen tiedostojen synkronointi hoituu näppärästi [Syncthing](https://syncthing.net/):in avulla, josta löytyy lähdekoodin lisäksi ohjelmistoversiot Androidille, Windowsille, Macille, Linux:lle, eri BSD-pohjaisille käyttiksille sekä myös itseä lähellä sydäntä olevalle SailfishOS-käyttöjärjestelmälle. Palvelinkone toimii myös [OpenVPN](https://openvpn.net) -palvelimena, johon etäyhteys hoituu turvallisesti puhelimella tai kannettavalla tietokoneella.

DigiTV-palvelimen ohjelmistoksi on asennettu [Tvheadend](https://tvheadend.org/), johon on kytketty 3 kpl usb DigiTV -tikkuja. Tällä pystyy tallentamaan ainakin kolmea kanavaa saman aikaisesti ja lisäksi pystyy etänä ajastamaan ja katsomaan tallennuksia.

Kameravalvonnan ohjelmistona toimii [AgentDVR](https://www.ispyconnect.com/), johon on kytketty kaksi kpl kameroita. Nämä on yhdistetty myös kotiautomaatiojärjestelmään, joka toimii samalla myös hälytysjärjestelmänä.

Nämä kotisivut toimivat RaspberryPi 2 -tietokoneella, jonka käyttöjärjestelmänä on [Raspberry Pi OS](https://www.raspberrypi.com/software/) (aiemmin tunnettiin nimellä Raspbian), web-palvelimena [Caddy](https://caddyserver.com/) ja blogialustana [Wordpress.org](https://wordpress.org/). Web-palvelimen ohjelmistoksi valikoitui [Caddy](https://caddyserver.com/) -server, joka on helppo asentaa ja se ei vie paljoa palvelimen resursseja. [Caddy](https://caddyserver.com/) on myös helppokäyttöinen ja se asentaa sekä päivittää automaattisesti myös sertifikaatin omalle sivustolle. Lisäksi [Caddy](https://caddyserver.com/) toimii myös ns. reverse proxynä eli sen kautta saan ohjattua verkkoliikenteen omalle kalenteripalvelimelle, jolloin sama sertifikaatti toimii myös kalenterin kanssa.

Muina "projekteina" olen tehnyt [Jabber/XMPP](https://www.jabber.org/) -pikaviestipalvelimen raspin päälle, jonka ohjelmistona käytin [Prosody IM](https://prosody.im/):iä. Prosody on keveytensä lisäksi myös helppo asentaa ja ottaa käyttöön. [Jabber/XMPP](https://www.jabber.org/) -pikaviestiprotokollalle on saatavilla paljon erilaisia pikaviestisovelluksia, joista itse käytin [Conversation](https://conversations.im/):ia, jossa on olemassa valmiina viestien suojaus [OMEMO](https://en.wikipedia.org/wiki/OMEMO) -protokollaa käyttäen. Nykyisin [Jabber/XMPP](https://www.jabber.org/) on jo jäänyt pois käytöstä ja tilalle on tullut [Matrix](https://matrix.org/) -pikaviestit. Palvelimen -ohjelmistona käytän [Synapse](https://matrix.org/docs/projects/server/synapse) -palvelin ohjelmistoa, johon löytyy hyvät ohjeet asennukseen. Eli [Matrix](https://matrix.org/):in kautta minua voi tavoitella [@esa:fasted.dy.fi](http://@esa:fasted.dy.fi).

Kotiautomaatio järjestelmien osalta puuhailin aiemmin paljon [Domoticz](https://www.domoticz.com/):in kanssa, mutta nyttemmin käyttöön on vakiintunut [Home Assistant](https://www.home-assistant.io/). Joskus on tullut myös kokeiltua [openHAB](https://www.openhab.org/):ia, mutta sen käyttämisen koin jotenkin kömpelöksi ja hankalaksi. Nykyinen kokoonpano on Raspberry Pi 4, johon on kytketty mSata-massamuisti tallennustilaksi. Käyttöjärjestelmänä on [Raspberry Pi OS](https://www.raspberrypi.com/software/) ja [Home Assistant](https://www.home-assistant.io/) on asennettu [Docker Compose](https://docs.docker.com/compose/):n päälle "konttiin". Tällä on haettu sitä, että pystyn paremmin muokkaamaan myös käyttöjärjestelmää enkä ole sidoksissa [Home Assistant](https://www.home-assistant.io/):n käyttöjärjestelmään.

Nykyiseen kotiautomaatio -kokoonpanoon on kytketty [Zigbee](https://en.wikipedia.org/wiki/Zigbee) -palikoita [Zigbee2MQTT](https://www.zigbee2mqtt.io/):n avulla ja 433MHz-taajuudella toimivia antureita [RFXCOM](http://www.rfxcom.com/en_GB):n avulla, kaksi kappaletta [RuuviTag](https://ruuvi.com/fi/) -antureita, jotka lähettävät [RuuviTag-Discovery](https://github.com/balda/ruuvitag-discovery):n avulla tiedot [MQTT](https://mqtt.org/)\-protokollaa käyttäen Home Assistantiin. Lisäksi on myös useita [NodeMCU](https://www.nodemcu.com/index_en.html) ja [Wemos](https://www.wemos.cc/en/latest/index.html) -pohjaisia kehityskortteja, joille on asennettuna [ESPHome](https://esphome.io/) -firmware. [Zigbee2MQTT](https://www.zigbee2mqtt.io/) ja [RFXCOM](http://www.rfxcom.com/en_GB) on asennettu erilliselle RaspberryPi -koneelle, jotta kokoonpanon muuttuessa ei tarvitse parittaa kaikkia laitteita uudestaan. [Zigbee2MQTT](https://www.zigbee2mqtt.io/) lähettää niin ikään tiedot [Home Assistant](https://www.home-assistant.io/):n [MQTT](https://mqtt.org/) -protokollaa käyttäen ja [RFXCOM](http://www.rfxcom.com/en_GB) on kytketty käyttäen ser2net (serial to network) -ohjelmaa, joka mahdollistaa erilliselle tietokoneelle usb-väylän kautta kytketyn laitteen jakamisen verkon yli. [Z-Wave](https://en.wikipedia.org/wiki/Z-Wave) -palikat on liitetty Home Assistantiin [ZWaveJS2MQTT](https://zwave-js.github.io/zwavejs2mqtt/#/):n avulla.

