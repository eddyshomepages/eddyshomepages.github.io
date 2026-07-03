---
title: "Modifying a rain gauge to work in a Zigbee network"
date: "2023-06-20"
tags: 
  - "433-mhz"
  - "elektroniikka"
  - "homeassistant"
  - "kotiautomaatio"
  - "mqtt"
  - "raingauge"
  - "reed-rele"
  - "sademittari"
  - "tipping-bucket"
  - "utility_meter"
  - "zigbee"
  - "zigbee2mqtt"
---

Next I thought I would write about a topic that, in addition to [Home Assistant](https://www.home-assistant.io/), also relates a bit to [electronics](https://en.wikipedia.org/wiki/Electronics). The idea is to modify a rain gauge so that it can be connected to a [Zigbee](https://en.wikipedia.org/wiki/Zigbee) network. I got the inspiration for this when I read about a similar modification on the [Home Assistant](https://www.home-assistant.io/) community forum, link here [https://community.home-assistant.io/t/diy-zigbee-rain-gauge/255379](https://community.home-assistant.io/t/diy-zigbee-rain-gauge/255379). As a small word of warning, a [soldering iron](https://en.wikipedia.org/wiki/Soldering_iron) is needed for this modification.

#### What is needed?

As supplies, you need some rain gauge — mine is this [MTX Basic wireless rain gauge](https://www.motonet.fi/fi/tuote/8601352/MTX-Basic-langaton-sadevesimittari) (NOTE! this is not a paid advertisement) — and a door and window sensor that can be connected to a [Zigbee](https://en.wikipedia.org/wiki/Zigbee) network, such as [Aqara](https://www.aqara.com/eu/door_and_window_sensor.html), which I use. This MTX rain gauge works connected to a 433 MHz network, but I didn't have one in use at the cottage, which is why I modified this gauge to work in a [Zigbee](https://en.wikipedia.org/wiki/Zigbee) network.

This MTX rain gauge, like many other gauges on the market, works so that inside the gauge there is a kind of seesaw cup ([tipping bucket](https://en.wikipedia.org/wiki/Rain_gauge#Tipping_bucket_rain_gauge)), which controls the [reed switch](https://en.wikipedia.org/wiki/Reed_switch) in the rain gauge as the cup fills with water. In other words, the rainfall is calculated by counting the opening and closing of the [reed switch](https://en.wikipedia.org/wiki/Reed_switch) as pulses, in the same way as happens in door and window sensors — when the door closes, the switch closes, and when the door opens, the switch opens. This modified rain gauge works the same way, i.e. we count the pulses it gives and let [Home Assistant](https://www.home-assistant.io/) then handle the conversion to millimeters.

#### The implementation in a nutshell

First, open the rain gauge and remove the old circuit board so that the wires of the existing [reed switch](https://en.wikipedia.org/wiki/Reed_switch) remain visible (in this picture the circuit board has already been removed and the wires connected to the door and window sensor)

![](/images/sadevesimittarin-tuunaus-zigbee-verkkoon-sopivaksi/kuva1.webp)

_Picture: Rain gauge with the original circuit board removed_

Next, open the door and window sensor and remove its [reed switch](https://en.wikipedia.org/wiki/Reed_switch) by desoldering it from the circuit board, and solder the wires of the rain gauge's [reed switch](https://en.wikipedia.org/wiki/Reed_switch) in its place

![](/images/sadevesimittarin-tuunaus-zigbee-verkkoon-sopivaksi/kuva2.webp)

_Picture: The rain gauge's reed switch wires soldered in place of the door sensor's reed switch_

Below is a picture of the finished implementation before the package is closed

![](/images/sadevesimittarin-tuunaus-zigbee-verkkoon-sopivaksi/kuva3.webp)

_Picture: Rainfall sensor ready_

#### Changes to Home Assistant

Finally, connect the rain gauge to [Home Assistant](https://www.home-assistant.io/) (if not already done) — I add the gauge to [Home Assistant](https://www.home-assistant.io/) via [Zigbee2MQTT](https://www.zigbee2mqtt.io/), so it becomes visible through the [MQTT](https://mqtt.org/) integration. I have named the device "raingauge", so for me the device shows up as _binary\_sensor.raingauge\_contact_.

Next, create two new sensors in [Home Assistant](https://www.home-assistant.io/), i.e. add the lines below to the _configuration.yaml_ file

```
sensor:
  - platform: history_stats
    name: Raingauge counter
    entity_id: binary_sensor.raingauge_contact #door sensor
    state: 'off'
    type: count
    start: '{{ now().replace(hour=0, minute=0, second=0) }}'
    end: '{{ now() }}'

  - platform: template
    sensors:
      rainfall_today:
        friendly_name: Rainfall today
        unit_of_measurement: mm
        icon_template: mdi:water
        value_template: >-
          {% set count = states('sensor.raingauge_counter') | int %}
          {% set mm_per_pulse = 0.330024 %}
          {% set mm = count * mm_per_pulse %}
          {{ mm|round(1, 'floor') }}
```

#### Calibrating the rain gauge

Calibrating the rain gauge can be done as follows (also explained on the [community forum](https://community.home-assistant.io/t/diy-zigbee-rain-gauge/255379)) — first measure the surface area of the rain gauge and how many pulses 10 ml of water causes. Calculations below

- the size of the rain gauge is 17.2 cm x 9.6 cm

- 1 mm of rain in the gauge is then 0.1 x 17.2 x 9.6 = 16.512 ml

- 10 ml of water in the rain gauge causes 5 pulses, i.e. 2 ml / pulse

- this gives a rainfall per pulse of 16.512 / 10 / 5 = 0.33024 mm / pulse

So with the calculation above we get the total daily rainfall, but if we also want to calculate more precisely e.g. hourly, weekly etc. rainfall amounts, the calculation formulas for these must still be added to the [Home Assistant](https://www.home-assistant.io/) _configuration.yaml_ file — here we can use [Home Assistant's](https://www.home-assistant.io/integrations/utility_meter/) _utility\_meter_ integration.

```
utility_meter:
# rainfall per hour
  rainfall_hour:
    source: sensor.rainfall_today
    cycle: hourly
# rainfall per week
  rainfall_week:
    source: sensor.rainfall_today
    cycle: weekly
# rainfall per month
  rainfall_month:
    source: sensor.rainfall_today
    cycle: monthly
# rainfall per year
  rainfall_year:
    source: sensor.rainfall_today
    cycle: yearly
```

Finally, information about the rainfall amounts can be added to the [Home Assistant](https://www.home-assistant.io/) dashboard, i.e. add an _entities_ card as shown below

![](/images/sadevesimittarin-tuunaus-zigbee-verkkoon-sopivaksi/kuva4.webp)

_Picture: Home Assistant entities card_