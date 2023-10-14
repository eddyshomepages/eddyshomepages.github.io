---
title: "ESPHomen asennus päätteen kautta Linux käyttöjärjestelmään"
date: "2023-02-12"
categories: 
  - "devuan"
  - "docker"
  - "docker-compose"
  - "esphome"
  - "home-assistant"
  - "kotiautomaatio"
  - "linux"
  - "mqtt"
tags: 
  - "docker"
  - "docker-compose"
  - "esp32"
  - "esp8266"
  - "espeasy"
  - "esphome"
  - "homeassistant"
  - "kotiautomaatio"
  - "openmqttgateway"
  - "python"
  - "tasmota"
  - "wemos-d1"
---

Minulla on [Home Assistantin](https://www.home-assistant.io/) yhteydessä erilaisia antureita, joita olen tehnyt käyttäen [ESP32](https://www.espressif.com/en/products/socs/esp32), [ESP8266](https://www.espressif.com/en/products/socs/esp8266) ja [Wemos D1](https://www.wemos.cc/en/latest/d1/index.html) -mikrokontrollereita. Näitä minulla on mm. lukemassa sähkömittarin pulssia, erilaisina sensoreina kuten lämpötila, ilmankosteus, ilmanpaine, valoisuus tai mittaamassa auringon UV-säteilyä. Yhteistä näissä on se, että olen käyttänyt niissä [ESPHome](https://esphome.io/) -firmwarea.

[ESPHome](https://esphome.io/) on monipuolinen firmware ja se on myös tehty hyvin yhteensopivaksi [Home Assistantin](https://www.home-assistant.io/) kanssa. [ESPHomen](https://esphome.io/) asetukset tehdään `yaml` -tiedostoon samaan tapaa kuin voidaan tehdä myös [Home Assistantissa](https://www.home-assistant.io/). Lisäksi [Home Assistant](https://www.home-assistant.io/) löytää automaattisesti [ESPHome](https://esphome.io/) -laitteet ja vaihtoehtoisesti näissä voidaan myös käyttää [MQTT](https://mqtt.org/) -protokollaa. [ESPHomelle](https://esphome.io/) on olemassa myös muitakin firmware -vaihtoehtoja kuten [Tasmota](https://tasmota.github.io/docs/) ja [ESPEasy](https://www.letscontrolit.com/wiki/index.php/ESPEasy), [OpenMQTTGateway](https://docs.openmqttgateway.com/) sekä myös muita, mutta tässä ei käydä niitä läpi vaikka niitäkin olen näissä mikrokontrollereissa kokeillut.

#### ESPHomen asennus

Seuraavaksi mennään asiaan eli käydäään läpi [ESPHomen](https://esphome.io/) asennus päätteen kautta Linux -käyttöjärjestelmälle sekä se, miten firmwarea voidaan muokata ja miten se asennetaan mikrokontrolleri -kortille.

Minulla [Home Assistant](https://www.home-assistant.io/) on asennettuna [Docker-Composen](https://docs.docker.com/compose/) avulla, joten en voi käyttää tätä lisäosaa, joka olisi normaalisti käytössä [Home Assistantin](https://www.home-assistant.io/) omassa käyttöjärjestelmässä. Ja nyt kun [ESPHome](https://esphome.io/) asennetaan päätteen kautta, niin sen voi asentaa myös muillekin koneille kuin tälle koneelle, johon [Home Assistant](https://www.home-assistant.io/) on asennettu.

[ESPHomen](https://esphome.io/) voi asentaa myös [Windowsille](https://esphome.io/guides/installing_esphome.html#windows), mutta minä asennan sen kannettavaan tietokoneeseen, jonka käyttöjärjestelmänä on [Devuan](https://www.devuan.org/) Linux. [ESPHome](https://esphome.io/) voidaan asentaa myös [Docker-Composen](https://esphome.io/guides/getting_started_command_line.html#installation) avulla, mutta minä teen asennuksen perinteisesti päätteessä.

Aluksi täytyy kuitenkin tarkistaa, että mikä versio [Pythonista](https://www.python.org/) asennettu, koska [ESPHome](https://esphome.io/) vaatii tällä hetkellä versiota 3.9. Eli tarkistetaan asennettu versio komennolla

```
python3 --version
```

Mikäli versio on jotain muuta kuin 3.9.x alkuinen, niin tällöin [Python](https://www.python.org/) täytyy päivittää tai jos se puuttuu, niin tällöin se tulee asentaa. Minulla versio oli 3.9.2 eli asennus onnistuu. Seuraavaksi luodaan virtuaaliympäristö [ESPHomea](https://esphome.io/) varten antamalla seuraavat käskyt

```
python3 -m venv venv
source venv/bin/activate
```

Tämän jälkeen vielä varmistetaan, että `python3-pip` on asennettu eli annetaan komento

```
sudo apt install python3-pip
```

Seuraavaksi voidaankin sitten asentaa [ESPHome](https://esphome.io/) antamalla seuraava käsky

```
pip3 install esphome
```

HUOM! Tässä on tärkeää, että komento annetaan normaalina käyttäjänä, koska pääkäyttäjänä annettuna (`sudo` -komennolla) asennus voi rikkoa käyttöjärjestelmän. Seuraavaksi tarkistaan, että [ESPHome](https://esphome.io/) on asennettu eli annetaan komento

```
esphome version
```

Mikäli järjestelmä antaa virheilmoituksen `"Command not found"`, johtuu se todennäköisesti siitä, että [ESPHomen](https://esphome.io/) tietoja ei PATH -tiedostossa. Tämä voidaan tehdä komennolla `` `echo 'export PATH=$PATH:$HOME/.local/bin' >> $HOME/.bashrc` ``, jonka jälkeen pitää vielä kirjautua ulos ja takaisin sisään.

#### Firmwaren kääntäminen

Seuraavaksi luodaan oma hakemisto `esphome` -tiedostoille esim. kotikansioon komennolla `mkdir esphome`, jonka jälkeen siirrytään ko. kansioon komennolla `cd esphome`.

Tämän jälkeen voidaan sitten kääntää ensimmäinen firmware antamalla komento `esphome wizard testi.yaml`, joka ohjaa sinua tekemään firmwaren alkuasetukset neljässä eri vaiheessa.

Vaiheessa yksi [ESPHome](https://esphome.io/) pyytää antamaan nimen

![](/images/esphomen-asennus-paatteen-kautta-linux-kayttojarjestelmaan/kuva1.webp)

_Kuva: ESPHome vaihe 1_

Vaiheessa kaksi valitaan mikrokontrollerin tyyppi eli [ESP32](https://www.espressif.com/en/products/socs/esp32) tai [ESP8266](https://www.espressif.com/en/products/socs/esp8266)

![](/images/esphomen-asennus-paatteen-kautta-linux-kayttojarjestelmaan/kuva2.webp)

_Kuva: ESPHome vaihe 2_

Vaiheessa kolme annetaan WIFI-verkon tiedot eli SSID ja salasana

![](/images/esphomen-asennus-paatteen-kautta-linux-kayttojarjestelmaan/kuva3.webp)

__Kuva: ESPHome vaihe_ 3_

Lopuksi vaiheessa neljä annetaan [OTA](https://en.wikipedia.org/wiki/Over-the-air_update) -päivityksien salasana

![](/images/esphomen-asennus-paatteen-kautta-linux-kayttojarjestelmaan/kuva4.webp)

_Kuva: ESPHome vaihe 4_

Tämän jälkeen tehtyä tiedostoa voidaan muokata eli päätteessä annetaan komento

```
nano testi.yaml
```

Eli muodostettu tiedosto näyttää alla olevan mukaiselta

![](/images/esphomen-asennus-paatteen-kautta-linux-kayttojarjestelmaan/kuva5.webp)

_Kuva: ESPHome testi.yaml -tiedosto_

Seuraavaksi tiedostoa voidaan vielä muokata sen mukaiseksi, mitä mikrokontrollerilla on tarkoitus tehdä ja kun asetukset ovat valmiina, niin tämän jälkeen annetaan komento

```
esphome run testi.yaml
```

Tämä komento kääntää firmawaren ja asentaa sen mikrokontrolleri -kortille. Vaihtoehtoisesti voidaan myös antaa alla olevat komennot, jolloin ensimmäisellä komennolla [ESPHome](https://esphome.io/) kääntää koodin ja toisella komennolla lataa sen mikrokontrolleri -kortille

```
esphome compile testi.yaml
esphome upload testi.yaml
```

Ensimmäinen asennus täytyy kuitenkin tehdä USB -yhteydellä, mutta sen jälkeen päivitykset voidaan ajaa verkon yli suoraan laitteelle.

Seuraavissa tarinoissa voidaan sitten käydä läpi esim. [RFID](https://fi.wikipedia.org/wiki/RFID)\-tagin lukijan tekeminen ja sen yhdistäminen [Home Assistantin](https://www.home-assistant.io/) hälytysjärjestelmän kanssa.

