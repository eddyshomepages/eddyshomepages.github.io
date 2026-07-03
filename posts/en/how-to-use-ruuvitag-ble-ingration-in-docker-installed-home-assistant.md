---
title: "How to use RuuviTag ble ingration in docker installed Home Assistant"
date: "2023-07-30"
tags: 
  - "docker"
  - "docker-compose"
  - "duplicati"
  - "homeassistant"
  - "homeautomation"
  - "linux"
  - "node.js"
  - "ruuvitag"
  - "ruuvitag-ble"
  - "ruuvitag-discovery"
---

Here is my first blog post translated from Finnish to English. The original post was published on 30.7.2023 in Finnish.

I previously had my [RuuviTag](https://ruuvi.com/ruuvitag/) sensors connected to [Home Assistant](https://www.home-assistant.io/) using a piece of software called [RuuviTag Discovery](https://github.com/balda/ruuvitag-discovery/), about which I also wrote a [story](#post/ruuvitag-antureiden-lisaaminen-home-assistantiin-ruuvitag-discoveryn-avulla-mqtt-protokollaa-kayttaen) back in the day. Lately, however, this configuration has started to act up more and more. This is apparently due to updates in the [node.js](https://nodejs.org/en) packages, with which [Ruuvitag Discovery](https://github.com/balda/ruuvitag-discovery) no longer works properly.

For this reason, I started thinking about how it would make sense to connect the sensors to [Home Assistant](https://www.home-assistant.io/), since I don't have, for example, a [Ruuvi Gateway](https://ruuvi.com/gateway/) in use. However, [Home Assistant](https://www.home-assistant.io/) nowadays has a [RuuviTag BLE](https://www.home-assistant.io/integrations/ruuvitag_ble) integration, so I started to find out how the sensors could be added to the system using it.

#### Changes to the host system

I have [Home Assistant](https://www.home-assistant.io/) installed in a container using [Docker Compose](https://docs.docker.com/compose/), so first I had to install the necessary packages such as _BlueZ_ on the _host_ system, add the line _bluetooth:_ to the _configurations.yaml_ file, and finally restart [Home Assistant](https://www.home-assistant.io/).

Nothing happened, however, until I realized to read the [Home Assistant](https://www.home-assistant.io/) documentation more carefully regarding the [Bluetooth](https://www.home-assistant.io/integrations/bluetooth) integration. The solution was found in the section _Additional requirements by install method_, which mentions that in a system installed with [Docker](https://www.docker.com/), the _host_ system must have _BlueZ_ and the _D-Bus socket_ in use, and they must also be available to [Home Assistant](https://www.home-assistant.io/) inside the container. In other words, this is fixed by adding the following line under the _volumes:_ section in the _docker-compose.yaml_ file

```
  - /run/dbus:/run/dbus:ro
```

Before restarting the [Home Assistant](https://www.home-assistant.io/) container, this is the latest point at which you should take a backup of [Home Assistant](https://www.home-assistant.io/). In my case, what happened was that after the system restarted, all the old history data etc. had disappeared and [Home Assistant](https://www.home-assistant.io/) started completely from a clean slate. This of course brought a bit of extra work, as the system had to be restored from old backups, but it went well nonetheless.

The data reset was most likely due to the fact that I accidentally added this _/run/dbus:/run/dbus:ro_ line to the end of the _docker-compose.yaml_ file in a new _volumes_ section, which for some reason reset all the data.

#### Backing up Home Assistant

Backing up [Home Assistant](https://www.home-assistant.io/) can be done in several ways, and I have it handled automatically with a browser-based application called [Duplicati](https://www.duplicati.com/), about which I once wrote [this](#post/docker-composen-avulla-asennetun-home-assistantin-varmuuskopiointi-duplicatin-avulla) story. A backup of the system can also be made manually via the terminal, as I did in this case — in other words, a copy of the [Home Assistant](https://www.home-assistant.io/) folder is created. This is done via the terminal by giving the following command (you must of course be in the correct directory where the command is given)

```
sudo cp -r homeassistant homeassistant_backup
```

After the backup, the [Home Assistant](https://www.home-assistant.io/) container is restarted with the command

```
sudo docker-compose up -d
```

Next, wait a moment for [Home Assistant](https://www.home-assistant.io/) to start up again. After this, [Home Assistant](https://www.home-assistant.io/) directly offers the [Bluetooth](https://www.home-assistant.io/integrations/bluetooth) integration to be taken into use, so let's enable it. Next, [Home Assistant](https://www.home-assistant.io/) also automatically offers [RuuviTag](https://ruuvi.com/ruuvitag/) sensors to be taken into use. So now [Home Assistant](https://www.home-assistant.io/) automatically finds the [RuuviTag](https://ruuvi.com/ruuvitag/) sensors within range and suggests adding them to the system.

Based on my own experience, the sensors have stayed in use well without problems. However, if it happens that [Home Assistant](https://www.home-assistant.io/) does not find the [RuuviTag](https://ruuvi.com/ruuvitag/) sensors, the next thing to do is to update the firmware of the [RuuviTags](https://ruuvi.com/ruuvitag/) to the latest version. Updating the firmware usually fixes the situation at the latest.