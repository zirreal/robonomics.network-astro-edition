export default {
  products:[
    {
      code: 'altruist',
      title: $tr('Outdoor sensor “Altruist“'),
      text: $tr(`A smart sensor that collects environmental data and integrates it into a decentralized sensor map.`),
      cases: $tr('Become a provider of environmental data to your friends and neighbors in the area. Access truly decentralized measurements of air quality, noise, temperature, and other environmental conditions on the sensor map.'),
      casesImages: ['altruist-cases-1.webp', 'altruist-cases-2.webp', 'altruist-cases-3.webp', 'altruist-cases-4.webp'],
      titleLink: '/devices/altruist'
    },
    {
      code: 'server',
      title: $tr('Home server with Web3 cloud'),
      text: $tr('The most open-source smart home server, powered by RISC-V, with a Web3 cloud replacing Google servers under the hood.'),
      cases: $tr('Smart WI-FI MQTT devices with open-source firmware Tasmota on the board fully compatible with Home Assistant.'),
      casesImages: ['risc-v-cases-1.webp', 'risc-v-cases-2.webp', 'risc-v-cases-3.webp', 'risc-v-cases-4.webp'],
      titleLink: '/devices/risc-v'
    },
    {
      code: 'hikikomori',
      title: $tr('Smart Tamagotchi “Hikikomori“'),
      text: $tr('A microcontroller development board designed to integrate with Web3 systems. It can be your smart home tamagotchi, a gaming controller, an educational tool - anything you design!'),
      cases: $tr('Connect your smart home and smart clothing to the Hikikomori to monitor sensor data—right at your fingertips. Literally.'),
      titleLink: '/devices/hikikomori'
    },
    {
      code: 'energy-monitor',
      title: $tr('Energy monitor with USB-C'),
      text: $tr('A non-invasive device designed for DIN rail mounting in electrical panels, tracks electricity consumption and generation.'),
      titleLink: '/devices/energy-monitor'
    },
  ],
}