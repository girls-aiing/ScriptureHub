import React, { useState, useEffect, useRef, useMemo } from 'react'

// ══════════════════════════════════════════════════════════════════
// MAP DATA
// ══════════════════════════════════════════════════════════════════

const MAPS = [
  // ─────────────────────────────────────────────────────────────
  // 1. TRAVELS OF PAUL
  // ─────────────────────────────────────────────────────────────
  {
    id:          'paul',
    title:       'Travels of Paul',
    icon:        '⚓',
    description: 'Follow the Apostle Paul across three missionary journeys that changed the world. From Antioch to Rome, trace every city where the Gospel was planted.',
    scripture:   'Acts 13 — 28',
    color:       '#2196f3',
    bgGradient:  'linear-gradient(135deg, rgba(33,150,243,0.12), rgba(156,39,176,0.06))',
    // SVG viewBox: 0 0 900 600  (Mediterranean region)
    // x/y are percentage positions within the map container
    journeys: [
      {
        id:    1,
        label: 'First Journey',
        color: '#f0c040',
        reference: 'Acts 13–14',
        cities: ['antioch-syria', 'seleucia', 'salamis', 'paphos', 'perga', 'antioch-pisidia', 'iconium', 'lystra', 'derbe'],
      },
      {
        id:    2,
        label: 'Second Journey',
        color: '#4caf50',
        reference: 'Acts 15–18',
        cities: ['antioch-syria', 'tarsus', 'lystra', 'troas', 'philippi', 'thessalonica', 'berea', 'athens', 'corinth', 'ephesus', 'caesarea', 'jerusalem'],
      },
      {
        id:    3,
        label: 'Third Journey',
        color: '#ff9800',
        reference: 'Acts 18–21',
        cities: ['antioch-syria', 'ephesus', 'troas', 'philippi', 'corinth', 'miletus', 'tyre', 'caesarea', 'jerusalem'],
      },
      {
        id:    4,
        label: 'Journey to Rome',
        color: '#e91e63',
        reference: 'Acts 27–28',
        cities: ['caesarea', 'myra', 'crete', 'malta', 'syracuse', 'rome'],
      },
    ],
    locations: [
      { id: 'antioch-syria',    name: 'Antioch (Syria)',    x: 68, y: 38, ref: 'Acts 13:1',  desc: 'The home base of Paul\'s missions. The first place where followers were called "Christians." Paul began all three missionary journeys from here.',  modern: 'Antakya, Turkey' },
      { id: 'seleucia',         name: 'Seleucia',           x: 67, y: 40, ref: 'Acts 13:4',  desc: 'The port city of Antioch. Paul and Barnabas sailed from here on the first missionary journey.',  modern: 'Samandağ, Turkey' },
      { id: 'salamis',          name: 'Salamis',            x: 60, y: 44, ref: 'Acts 13:5',  desc: 'The largest city on Cyprus. Paul and Barnabas preached in the Jewish synagogues here first.',  modern: 'Near Famagusta, Cyprus' },
      { id: 'paphos',           name: 'Paphos',             x: 56, y: 46, ref: 'Acts 13:6',  desc: 'Capital of Cyprus. Here Paul confronted the sorcerer Elymas and the proconsul Sergius Paulus believed — the first recorded Gentile convert on this journey.',  modern: 'Paphos, Cyprus' },
      { id: 'perga',            name: 'Perga',              x: 62, y: 36, ref: 'Acts 13:13', desc: 'A city in Pamphylia. John Mark left Paul and Barnabas here and returned to Jerusalem — a departure that later caused a sharp disagreement.',  modern: 'Murtina, Turkey' },
      { id: 'antioch-pisidia',  name: 'Antioch (Pisidia)',  x: 64, y: 32, ref: 'Acts 13:14', desc: 'Paul preached a powerful sermon here that drew nearly the whole city. When Jews rejected the message, Paul declared he would turn to the Gentiles.',  modern: 'Yalvaç, Turkey' },
      { id: 'iconium',          name: 'Iconium',            x: 66, y: 31, ref: 'Acts 14:1',  desc: 'Paul and Barnabas spoke so effectively that a great number of Jews and Greeks believed. But a plot to stone them forced them to flee.',  modern: 'Konya, Turkey' },
      { id: 'lystra',           name: 'Lystra',             x: 65, y: 30, ref: 'Acts 14:8',  desc: 'Paul healed a man lame from birth. The crowd called Paul and Barnabas gods! Later Paul was stoned and left for dead — but he got up and continued.',  modern: 'Near Hatunsaray, Turkey' },
      { id: 'derbe',            name: 'Derbe',              x: 67, y: 29, ref: 'Acts 14:20', desc: 'The furthest point of the first journey. Paul and Barnabas made many disciples here before retracing their steps to strengthen the churches.',  modern: 'Near Kerti Höyük, Turkey' },
      { id: 'tarsus',           name: 'Tarsus',             x: 66, y: 37, ref: 'Acts 21:39', desc: 'Paul\'s hometown and birthplace. A major city of Cilicia, known for its university. Paul was a Roman citizen by birth here.',  modern: 'Tarsus, Turkey' },
      { id: 'troas',            name: 'Troas',              x: 58, y: 28, ref: 'Acts 16:8',  desc: 'Here Paul received the famous "Macedonian vision" — a man calling him to come to Macedonia. This moment brought the Gospel to Europe for the first time.',  modern: 'Dalyan, Turkey' },
      { id: 'philippi',         name: 'Philippi',           x: 54, y: 24, ref: 'Acts 16:12', desc: 'The first European city to receive the Gospel. Lydia, a dealer in purple cloth, was the first European convert. Paul and Silas were imprisoned here and an earthquake freed them.',  modern: 'Filippoi, Greece' },
      { id: 'thessalonica',     name: 'Thessalonica',       x: 55, y: 25, ref: 'Acts 17:1',  desc: 'Paul preached here for three Sabbaths. Many believed but a mob formed and Paul had to flee by night. He later wrote two letters to this church.',  modern: 'Thessaloniki, Greece' },
      { id: 'berea',            name: 'Berea',              x: 54, y: 26, ref: 'Acts 17:10', desc: 'The Bereans were called "more noble" because they examined the scriptures daily to verify Paul\'s teaching. A model for all Bible students.',  modern: 'Veria, Greece' },
      { id: 'athens',           name: 'Athens',             x: 55, y: 30, ref: 'Acts 17:15', desc: 'Paul preached on Mars Hill (Areopagus) to Greek philosophers. He used their altar "To An Unknown God" as a starting point to proclaim Christ.',  modern: 'Athens, Greece' },
      { id: 'corinth',          name: 'Corinth',            x: 55, y: 31, ref: 'Acts 18:1',  desc: 'Paul stayed 18 months here — his longest stay in any city. He worked as a tentmaker with Aquila and Priscilla. He wrote Romans from here.',  modern: 'Corinth, Greece' },
      { id: 'ephesus',          name: 'Ephesus',            x: 60, y: 30, ref: 'Acts 19:1',  desc: 'Paul spent 3 years here — his longest ministry. The whole province of Asia heard the Word. A riot broke out when silversmiths feared losing business from idol sales.',  modern: 'Selçuk, Turkey' },
      { id: 'miletus',          name: 'Miletus',            x: 60, y: 31, ref: 'Acts 20:15', desc: 'Paul called the Ephesian elders here for a farewell address, knowing he would not see them again. One of the most emotional scenes in Acts.',  modern: 'Milet, Turkey' },
      { id: 'caesarea',         name: 'Caesarea',           x: 66, y: 42, ref: 'Acts 21:8',  desc: 'The Roman capital of Judea. Philip the evangelist lived here. Paul was imprisoned here for two years before appealing to Caesar.',  modern: 'Caesarea Maritima, Israel' },
      { id: 'jerusalem',        name: 'Jerusalem',          x: 67, y: 45, ref: 'Acts 21:17', desc: 'The holy city. Paul was arrested in the temple here. His arrest began the chain of events that eventually brought him to Rome.',  modern: 'Jerusalem, Israel' },
      { id: 'tyre',             name: 'Tyre',               x: 66, y: 43, ref: 'Acts 21:3',  desc: 'Disciples here warned Paul through the Spirit not to go to Jerusalem. Paul stayed seven days with the believers before continuing his journey.',  modern: 'Sur, Lebanon' },
      { id: 'myra',             name: 'Myra',               x: 62, y: 34, ref: 'Acts 27:5',  desc: 'Paul\'s ship stopped here on the journey to Rome. The centurion Julius found an Alexandrian ship sailing for Italy.',  modern: 'Demre, Turkey' },
      { id: 'crete',            name: 'Crete (Fair Havens)', x: 57, y: 36, ref: 'Acts 27:8',  desc: 'Paul warned the ship\'s captain not to sail from here — the season was dangerous. His warning was ignored, leading to the famous shipwreck.',  modern: 'Crete, Greece' },
      { id: 'malta',            name: 'Malta',              x: 48, y: 38, ref: 'Acts 28:1',  desc: 'After the shipwreck, Paul and all 276 passengers survived on this island. Paul was bitten by a viper but unharmed. He healed many on the island.',  modern: 'Malta' },
      { id: 'syracuse',         name: 'Syracuse',           x: 49, y: 34, ref: 'Acts 28:12', desc: 'Paul\'s ship stopped here for three days on the final leg to Rome.',  modern: 'Syracuse, Sicily, Italy' },
      { id: 'rome',             name: 'Rome',               x: 44, y: 26, ref: 'Acts 28:16', desc: 'The capital of the Roman Empire. Paul arrived here as a prisoner but lived in his own rented house for two years, freely preaching the Kingdom of God. The Gospel had reached the centre of the world.',  modern: 'Rome, Italy' },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 2. THE EXODUS ROUTE
  // ─────────────────────────────────────────────────────────────
  {
    id:          'exodus',
    title:       'The Exodus Route',
    icon:        '🏜️',
    description: 'Walk with Moses and two million Israelites from slavery in Egypt to the Promised Land. A 40-year journey of faith, failure, and faithfulness.',
    scripture:   'Exodus 12 — Deuteronomy 34',
    color:       '#f0c040',
    bgGradient:  'linear-gradient(135deg, rgba(240,192,64,0.12), rgba(255,152,0,0.06))',
    journeys: [
      {
        id:    1,
        label: 'Egypt to Sinai',
        color: '#f0c040',
        reference: 'Exodus 12–19',
        cities: ['rameses', 'succoth', 'etham', 'pi-hahiroth', 'red-sea', 'marah', 'elim', 'sin-desert', 'rephidim', 'sinai'],
      },
      {
        id:    2,
        label: 'Sinai to Kadesh',
        color: '#4caf50',
        reference: 'Numbers 10–14',
        cities: ['sinai', 'taberah', 'hazeroth', 'kadesh-barnea'],
      },
      {
        id:    3,
        label: '40 Years Wandering',
        color: '#ff9800',
        reference: 'Numbers 14–20',
        cities: ['kadesh-barnea', 'ezion-geber', 'kadesh-barnea'],
      },
      {
        id:    4,
        label: 'Into the Promised Land',
        color: '#e91e63',
        reference: 'Numbers 20 — Joshua 4',
        cities: ['kadesh-barnea', 'mount-hor', 'ezion-geber', 'moab', 'nebo', 'jericho'],
      },
    ],
    locations: [
      { id: 'rameses',      name: 'Rameses',         x: 22, y: 52, ref: 'Exodus 12:37', desc: 'The starting point of the Exodus. The Israelites had built this city as slaves. On the night of Passover, 600,000 men plus women and children left Egypt.',  modern: 'Qantir, Egypt' },
      { id: 'succoth',      name: 'Succoth',          x: 25, y: 53, ref: 'Exodus 12:37', desc: 'The first stop after leaving Egypt. The Israelites baked unleavened bread here because they had no time to let it rise — the origin of the Feast of Unleavened Bread.',  modern: 'Tell el-Maskhuta, Egypt' },
      { id: 'etham',        name: 'Etham',            x: 27, y: 54, ref: 'Exodus 13:20', desc: 'On the edge of the desert. Here the pillar of cloud by day and fire by night first appeared to guide Israel.',  modern: 'Edge of Sinai desert, Egypt' },
      { id: 'pi-hahiroth',  name: 'Pi-Hahiroth',     x: 28, y: 56, ref: 'Exodus 14:2',  desc: 'God told Moses to camp here, between Migdol and the sea. Pharaoh thought Israel was trapped. But God had a plan.',  modern: 'Near Suez Canal, Egypt' },
      { id: 'red-sea',      name: 'Red Sea Crossing', x: 30, y: 58, ref: 'Exodus 14:21', desc: 'Moses stretched out his hand and the sea parted. Israel walked through on dry ground. When the Egyptians followed, the waters returned and the entire army drowned. Israel sang the Song of Moses.',  modern: 'Gulf of Suez / Sinai' },
      { id: 'marah',        name: 'Marah',            x: 32, y: 58, ref: 'Exodus 15:23', desc: 'The water here was bitter and the people complained. God showed Moses a piece of wood to throw in — the water became sweet. A picture of the cross making bitter things sweet.',  modern: 'Ain Hawarah, Sinai' },
      { id: 'elim',         name: 'Elim',             x: 33, y: 59, ref: 'Exodus 15:27', desc: 'A beautiful oasis with twelve springs and seventy palm trees — one spring for each tribe, one tree for each elder. God provided rest and refreshment.',  modern: 'Wadi Gharandel, Sinai' },
      { id: 'sin-desert',   name: 'Desert of Sin',   x: 35, y: 61, ref: 'Exodus 16:1',  desc: 'The people complained about food. God sent manna from heaven every morning and quail in the evening. Manna fell for 40 years until they entered Canaan.',  modern: 'El-Markha Plain, Sinai' },
      { id: 'rephidim',     name: 'Rephidim',         x: 37, y: 63, ref: 'Exodus 17:1',  desc: 'No water again. Moses struck the rock and water gushed out. Here also, Amalek attacked Israel. As long as Moses held up his hands, Israel prevailed.',  modern: 'Wadi Feiran, Sinai' },
      { id: 'sinai',        name: 'Mount Sinai',      x: 38, y: 66, ref: 'Exodus 19:1',  desc: 'The mountain of God. Israel camped here for almost a year. God descended in fire and thunder. Moses received the Ten Commandments. The Tabernacle was built. The Law was given.',  modern: 'Jebel Musa, Sinai, Egypt' },
      { id: 'taberah',      name: 'Taberah',          x: 40, y: 62, ref: 'Numbers 11:3', desc: 'The people complained and fire from the Lord burned among them. Moses prayed and the fire died down. The place was named Taberah, meaning "burning."',  modern: 'Unknown, Sinai/Negev' },
      { id: 'hazeroth',     name: 'Hazeroth',         x: 41, y: 60, ref: 'Numbers 11:35', desc: 'Miriam and Aaron spoke against Moses because of his Cushite wife. God struck Miriam with leprosy. Moses prayed for her and she was healed after seven days.',  modern: 'Ain Khadra, Sinai' },
      { id: 'kadesh-barnea',name: 'Kadesh-Barnea',    x: 38, y: 54, ref: 'Numbers 13:26', desc: 'The twelve spies returned here with their report. Ten gave a bad report and the people wept all night. God declared that generation would wander 40 years — one year for each day of spying.',  modern: 'Ain el-Qudeirat, Negev, Israel' },
      { id: 'ezion-geber',  name: 'Ezion-Geber',      x: 40, y: 60, ref: 'Numbers 33:35', desc: 'A port on the Red Sea (Gulf of Aqaba). Israel camped here during the wilderness wanderings. Later Solomon built a fleet of ships here.',  modern: 'Aqaba, Jordan' },
      { id: 'mount-hor',    name: 'Mount Hor',        x: 39, y: 56, ref: 'Numbers 20:22', desc: 'Aaron the high priest died here at age 123. Moses removed Aaron\'s priestly garments and placed them on his son Eleazar. All Israel mourned for thirty days.',  modern: 'Jebel Harun, Jordan' },
      { id: 'moab',         name: 'Plains of Moab',   x: 44, y: 50, ref: 'Numbers 22:1',  desc: 'Israel camped here opposite Jericho before entering Canaan. Balak king of Moab hired Balaam to curse Israel — but God turned every curse into a blessing.',  modern: 'East of Jordan River, Jordan' },
      { id: 'nebo',         name: 'Mount Nebo',       x: 44, y: 49, ref: 'Deuteronomy 34:1', desc: 'Moses climbed here and God showed him the entire Promised Land. Moses died here at 120 years old, his eyes still clear and his strength undiminished. He was buried by God himself.',  modern: 'Jebel Neba, Jordan' },
      { id: 'jericho',      name: 'Jericho',          x: 43, y: 48, ref: 'Joshua 6:1',   desc: 'The first city conquered in Canaan. Israel marched around it for seven days. On the seventh day they shouted and the walls fell flat. The Promised Land had been entered.',  modern: 'Jericho, West Bank' },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 3. LIFE OF JESUS
  // ─────────────────────────────────────────────────────────────
  {
    id:          'jesus',
    title:       'Life & Ministry of Jesus',
    icon:        '✝️',
    description: 'Walk the land where Jesus walked. From His birth in Bethlehem to His resurrection in Jerusalem, explore every significant location in the Gospels.',
    scripture:   'Matthew, Mark, Luke & John',
    color:       '#e91e63',
    bgGradient:  'linear-gradient(135deg, rgba(233,30,99,0.1), rgba(156,39,176,0.06))',
    journeys: [
      {
        id:    1,
        label: 'Birth & Early Life',
        color: '#f0c040',
        reference: 'Matthew 1–2, Luke 1–2',
        cities: ['bethlehem', 'jerusalem-temple', 'egypt-flight', 'nazareth'],
      },
      {
        id:    2,
        label: 'Baptism & Temptation',
        color: '#2196f3',
        reference: 'Matthew 3–4',
        cities: ['nazareth', 'jordan-river', 'judean-desert'],
      },
      {
        id:    3,
        label: 'Galilean Ministry',
        color: '#4caf50',
        reference: 'Matthew 4–18, Mark 1–9',
        cities: ['nazareth', 'capernaum', 'sea-of-galilee', 'cana', 'nain', 'caesarea-philippi'],
      },
      {
        id:    4,
        label: 'Final Week & Resurrection',
        color: '#e91e63',
        reference: 'Matthew 21–28',
        cities: ['jericho-jesus', 'bethany', 'jerusalem-entry', 'gethsemane', 'golgotha', 'emmaus'],
      },
    ],
    locations: [
      { id: 'bethlehem',        name: 'Bethlehem',           x: 62, y: 60, ref: 'Luke 2:4',    desc: 'The birthplace of Jesus, fulfilling Micah 5:2. Born in a manger because there was no room in the inn. Angels announced His birth to shepherds in nearby fields.',  modern: 'Bethlehem, West Bank' },
      { id: 'jerusalem-temple', name: 'Jerusalem (Temple)',  x: 63, y: 58, ref: 'Luke 2:22',   desc: 'Jesus was presented at the temple as a baby. Simeon and Anna recognised Him as the Messiah. At age 12, Jesus stayed behind to discuss scripture with the teachers.',  modern: 'Jerusalem, Israel' },
      { id: 'egypt-flight',     name: 'Egypt',               x: 40, y: 62, ref: 'Matthew 2:14', desc: 'Joseph fled here with Mary and Jesus to escape Herod\'s massacre of infants. They stayed until Herod died, fulfilling Hosea 11:1: "Out of Egypt I called my son."',  modern: 'Egypt' },
      { id: 'nazareth',         name: 'Nazareth',            x: 63, y: 50, ref: 'Luke 2:51',   desc: 'Jesus grew up here for about 30 years. He was known as "Jesus of Nazareth." When He returned to preach, the people tried to throw Him off a cliff.',  modern: 'Nazareth, Israel' },
      { id: 'jordan-river',     name: 'Jordan River',        x: 65, y: 55, ref: 'Matthew 3:13', desc: 'Jesus was baptised here by John. The heavens opened, the Spirit descended like a dove, and the Father said "This is my beloved Son, in whom I am well pleased."',  modern: 'Jordan River, Israel/Jordan' },
      { id: 'judean-desert',    name: 'Judean Desert',       x: 63, y: 57, ref: 'Matthew 4:1',  desc: 'Jesus fasted 40 days and was tempted by Satan three times. He overcame every temptation with Scripture: "It is written." A model for spiritual warfare.',  modern: 'Judean Desert, Israel' },
      { id: 'capernaum',        name: 'Capernaum',           x: 65, y: 48, ref: 'Matthew 4:13', desc: 'Jesus\' ministry headquarters. He called Peter, Andrew, James, and John here. He healed Peter\'s mother-in-law, the centurion\'s servant, and many others. The synagogue ruins still exist today.',  modern: 'Kfar Nahum, Israel' },
      { id: 'sea-of-galilee',   name: 'Sea of Galilee',      x: 65, y: 49, ref: 'Matthew 14:25', desc: 'Jesus calmed the storm here. He walked on water. He fed 5,000 on its shores. He appeared to the disciples after the resurrection and restored Peter.',  modern: 'Lake Kinneret, Israel' },
      { id: 'cana',             name: 'Cana',                x: 63, y: 49, ref: 'John 2:1',    desc: 'Jesus performed His first miracle here — turning water into wine at a wedding. His mother Mary prompted Him. The master of the banquet said it was the best wine.',  modern: 'Kafr Kanna, Israel' },
      { id: 'nain',             name: 'Nain',                x: 63, y: 51, ref: 'Luke 7:11',   desc: 'Jesus raised a widow\'s only son from the dead here. He saw the funeral procession and had compassion. He touched the coffin and said "Young man, I say to you, get up!"',  modern: 'Nein, Israel' },
      { id: 'caesarea-philippi',name: 'Caesarea Philippi',   x: 66, y: 46, ref: 'Matthew 16:13', desc: 'Here Peter made the great confession: "You are the Christ, the Son of the living God." Jesus declared He would build His church on this rock. The Transfiguration likely occurred on nearby Mount Hermon.',  modern: 'Banias, Israel' },
      { id: 'jericho-jesus',    name: 'Jericho',             x: 64, y: 57, ref: 'Luke 19:1',   desc: 'Jesus passed through here on His way to Jerusalem. Zacchaeus climbed a tree to see Him. Jesus invited Himself to Zacchaeus\' house, and the tax collector repented and gave back fourfold.',  modern: 'Jericho, West Bank' },
      { id: 'bethany',          name: 'Bethany',             x: 63, y: 58, ref: 'John 11:1',   desc: 'Home of Mary, Martha, and Lazarus — Jesus\' closest friends. Jesus raised Lazarus from the dead here after four days in the tomb. Jesus wept here — the shortest verse in the Bible.',  modern: 'Al-Eizariya, West Bank' },
      { id: 'jerusalem-entry',  name: 'Jerusalem (Triumphal Entry)', x: 63, y: 58, ref: 'Matthew 21:1', desc: 'Jesus entered on a donkey, fulfilling Zechariah 9:9. The crowds spread cloaks and palm branches shouting "Hosanna!" He cleansed the temple of money changers.',  modern: 'Jerusalem, Israel' },
      { id: 'gethsemane',       name: 'Garden of Gethsemane', x: 63, y: 58, ref: 'Matthew 26:36', desc: 'Jesus prayed here in agony the night before the crucifixion: "Not my will, but yours be done." He was betrayed by Judas with a kiss and arrested. The disciples fled.',  modern: 'Mount of Olives, Jerusalem' },
      { id: 'golgotha',         name: 'Golgotha',            x: 63, y: 58, ref: 'Matthew 27:33', desc: 'The Place of the Skull — where Jesus was crucified. He hung on the cross for six hours. At the moment of His death, the temple curtain tore in two, the earth shook, and the dead rose.',  modern: 'Church of the Holy Sepulchre, Jerusalem' },
      { id: 'emmaus',           name: 'Emmaus',              x: 62, y: 58, ref: 'Luke 24:13',  desc: 'Two disciples walked here after the crucifixion, not recognising the risen Jesus walking beside them. When He broke bread, their eyes were opened. He vanished. They ran back to Jerusalem.',  modern: 'Possibly Abu Ghosh, Israel' },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 4. KINGDOMS OF ISRAEL
  // ─────────────────────────────────────────────────────────────
  {
    id:          'kingdoms',
    title:       'Kingdom of Israel & Judah',
    icon:        '👑',
    description: 'Understand the divided kingdom — how one nation became two, the key cities of each kingdom, and the path to exile.',
    scripture:   '1 Kings 12 — 2 Kings 25',
    color:       '#9c27b0',
    bgGradient:  'linear-gradient(135deg, rgba(156,39,176,0.1), rgba(233,30,99,0.06))',
    journeys: [
      {
        id:    1,
        label: 'United Kingdom',
        color: '#f0c040',
        reference: '1 Samuel — 1 Kings 11',
        cities: ['hebron', 'jerusalem-david', 'bethlehem-david'],
      },
      {
        id:    2,
        label: 'Northern Kingdom (Israel)',
        color: '#2196f3',
        reference: '1 Kings 12 — 2 Kings 17',
        cities: ['shechem', 'tirzah', 'samaria', 'dan', 'bethel-kingdom', 'jezreel'],
      },
      {
        id:    3,
        label: 'Southern Kingdom (Judah)',
        color: '#e91e63',
        reference: '1 Kings 12 — 2 Kings 25',
        cities: ['jerusalem-david', 'bethlehem-david', 'hebron', 'lachish', 'beersheba'],
      },
      {
        id:    4,
        label: 'Path to Exile',
        color: '#ff5722',
        reference: '2 Kings 17, 25',
        cities: ['samaria', 'nineveh', 'jerusalem-david', 'babylon'],
      },
    ],
    locations: [
      { id: 'jerusalem-david', name: 'Jerusalem',       x: 63, y: 58, ref: '2 Samuel 5:6',  desc: 'David captured Jerusalem from the Jebusites and made it his capital — the City of David. Solomon built the magnificent Temple here. It remained the capital of Judah until the Babylonian exile.',  modern: 'Jerusalem, Israel' },
      { id: 'hebron',          name: 'Hebron',          x: 62, y: 61, ref: '2 Samuel 2:1',  desc: 'David was first anointed king here and reigned for 7 years before capturing Jerusalem. Abraham, Isaac, Jacob, and their wives are buried in the Cave of Machpelah here.',  modern: 'Hebron, West Bank' },
      { id: 'bethlehem-david', name: 'Bethlehem',       x: 62, y: 60, ref: '1 Samuel 16:1', desc: 'David\'s hometown. Samuel anointed David king here while Saul still reigned. The youngest and least likely son became Israel\'s greatest king.',  modern: 'Bethlehem, West Bank' },
      { id: 'shechem',         name: 'Shechem',         x: 63, y: 54, ref: '1 Kings 12:1',  desc: 'Rehoboam came here to be crowned king. When he refused to lighten the people\'s burden, ten tribes rebelled under Jeroboam. The kingdom split here.',  modern: 'Nablus, West Bank' },
      { id: 'tirzah',          name: 'Tirzah',          x: 64, y: 53, ref: '1 Kings 14:17', desc: 'The first capital of the Northern Kingdom of Israel under Jeroboam and several kings after him, before Omri built Samaria.',  modern: 'Tell el-Farah, West Bank' },
      { id: 'samaria',         name: 'Samaria',         x: 63, y: 53, ref: '1 Kings 16:24', desc: 'King Omri built this city as the new capital of the Northern Kingdom. His son Ahab and Jezebel ruled here. In 722 BC, Assyria conquered Samaria and exiled the ten tribes.',  modern: 'Sebastia, West Bank' },
      { id: 'dan',             name: 'Dan',             x: 65, y: 46, ref: '1 Kings 12:29', desc: 'Jeroboam set up a golden calf here (and at Bethel) saying "Here are your gods, O Israel." This became the great sin of the Northern Kingdom that led to its eventual destruction.',  modern: 'Tel Dan, Israel' },
      { id: 'bethel-kingdom',  name: 'Bethel',          x: 63, y: 56, ref: '1 Kings 12:29', desc: 'The second golden calf was placed here. Bethel means "House of God" — Jacob had his famous ladder dream here. But under Jeroboam it became a centre of idolatry.',  modern: 'Beitin, West Bank' },
      { id: 'jezreel',         name: 'Jezreel',         x: 64, y: 51, ref: '1 Kings 21:1',  desc: 'Ahab\'s winter palace. Naboth\'s vineyard was here — Jezebel had Naboth killed so Ahab could take it. Elijah prophesied that dogs would lick Ahab\'s blood in this very place.',  modern: 'Jezreel Valley, Israel' },
      { id: 'lachish',         name: 'Lachish',         x: 61, y: 60, ref: '2 Kings 18:14', desc: 'The second most important city of Judah. Sennacherib of Assyria besieged it during Hezekiah\'s reign. The Lachish Letters — ancient Hebrew documents — were found here.',  modern: 'Tel Lachish, Israel' },
      { id: 'beersheba',       name: 'Beersheba',       x: 61, y: 63, ref: '1 Kings 19:3',  desc: 'The southernmost city of Judah — "from Dan to Beersheba" described the whole land. Elijah fled here after defeating the prophets of Baal, exhausted and suicidal. An angel fed him here.',  modern: 'Be\'er Sheva, Israel' },
      { id: 'nineveh',         name: 'Nineveh (Assyria)', x: 82, y: 36, ref: '2 Kings 17:6', desc: 'The capital of the Assyrian Empire. In 722 BC, Assyria conquered the Northern Kingdom and deported the ten tribes here. They were scattered and never returned as a unified people.',  modern: 'Mosul, Iraq' },
      { id: 'babylon',         name: 'Babylon',         x: 80, y: 44, ref: '2 Kings 25:1',  desc: 'Nebuchadnezzar\'s empire. In 586 BC, Babylon destroyed Jerusalem and the Temple, and deported the people of Judah. Daniel, Shadrach, Meshach, and Abednego were taken here.',  modern: 'Al Hillah, Iraq' },
    ],
  },
]

// ══════════════════════════════════════════════════════════════════
// TIMELINE DATA
// ══════════════════════════════════════════════════════════════════
const TIMELINES = [
  {
    id:    'bible-overview',
    title: 'Bible History Overview',
    icon:  '📅',
    color: '#f0c040',
    events: [
      { year: 'c. 4000 BC',  label: 'Creation',             ref: 'Genesis 1',        desc: 'God creates the heavens, earth, and humanity in six days. Adam and Eve live in the Garden of Eden.',  icon: '🌍' },
      { year: 'c. 3000 BC',  label: 'The Flood',            ref: 'Genesis 6–9',      desc: 'Noah builds the ark. God floods the earth for 40 days. Noah, his family, and the animals are saved. God sets a rainbow as a covenant sign.',  icon: '🌊' },
      { year: 'c. 2100 BC',  label: 'Abraham\'s Call',      ref: 'Genesis 12',       desc: 'God calls Abram from Ur of the Chaldees to go to Canaan. God promises to make him a great nation and bless all peoples through him.',  icon: '⭐' },
      { year: 'c. 1900 BC',  label: 'Joseph in Egypt',      ref: 'Genesis 37–50',    desc: 'Joseph is sold into slavery by his brothers. He rises to become second in command of Egypt. He saves Egypt and his family from famine.',  icon: '🌾' },
      { year: 'c. 1446 BC',  label: 'The Exodus',           ref: 'Exodus 12',        desc: 'Moses leads Israel out of Egypt after ten plagues. The Red Sea parts. Israel begins 40 years in the wilderness.',  icon: '🏜️' },
      { year: 'c. 1406 BC',  label: 'Conquest of Canaan',   ref: 'Joshua 1',         desc: 'Joshua leads Israel into the Promised Land. Jericho falls. The land is divided among the twelve tribes.',  icon: '⚔️' },
      { year: 'c. 1050 BC',  label: 'Saul Becomes King',    ref: '1 Samuel 10',      desc: 'Israel demands a king. God gives them Saul — tall, handsome, and ultimately disobedient. The monarchy begins.',  icon: '👑' },
      { year: 'c. 1010 BC',  label: 'David Becomes King',   ref: '2 Samuel 5',       desc: 'David, the shepherd boy who killed Goliath, becomes Israel\'s greatest king. He captures Jerusalem and establishes it as the capital.',  icon: '🎵' },
      { year: 'c. 970 BC',   label: 'Solomon\'s Temple',    ref: '1 Kings 6',        desc: 'Solomon builds the magnificent Temple in Jerusalem. It takes seven years. The glory of God fills the Temple at its dedication.',  icon: '🏛️' },
      { year: 'c. 930 BC',   label: 'Kingdom Divides',      ref: '1 Kings 12',       desc: 'After Solomon\'s death, the kingdom splits. Ten tribes form the Northern Kingdom (Israel). Two tribes form the Southern Kingdom (Judah).',  icon: '⚡' },
      { year: '722 BC',      label: 'Israel Exiled',        ref: '2 Kings 17',       desc: 'Assyria conquers the Northern Kingdom. The ten tribes are scattered. They never return as a unified people — the "lost tribes of Israel."',  icon: '😢' },
      { year: '586 BC',      label: 'Jerusalem Destroyed',  ref: '2 Kings 25',       desc: 'Babylon destroys Jerusalem and Solomon\'s Temple. The people of Judah are taken into captivity. Daniel, Ezekiel, and others prophesy during this period.',  icon: '🔥' },
      { year: '538 BC',      label: 'Return from Exile',    ref: 'Ezra 1',           desc: 'Cyrus the Great of Persia decrees that the Jews may return to their land. Zerubbabel leads the first group back. The Temple is rebuilt.',  icon: '🕊️' },
      { year: 'c. 5 BC',     label: 'Birth of Jesus',       ref: 'Luke 2',           desc: 'Jesus is born in Bethlehem to the Virgin Mary. Angels announce His birth to shepherds. Wise men come from the East. The Son of God enters human history.',  icon: '⭐' },
      { year: 'c. AD 27',    label: 'Jesus\' Ministry',     ref: 'Matthew 4',        desc: 'Jesus begins His public ministry at about age 30. He calls twelve disciples, performs miracles, teaches the Sermon on the Mount, and proclaims the Kingdom of God.',  icon: '✝️' },
      { year: 'c. AD 30',    label: 'Crucifixion & Resurrection', ref: 'Matthew 27–28', desc: 'Jesus is crucified on Passover. He rises from the dead on the third day. He appears to over 500 people. He ascends to heaven 40 days later.',  icon: '🌅' },
      { year: 'c. AD 30',    label: 'Pentecost',            ref: 'Acts 2',           desc: 'The Holy Spirit is poured out on 120 disciples in Jerusalem. Peter preaches and 3,000 are saved. The Church is born.',  icon: '🔥' },
      { year: 'c. AD 47–57', label: 'Paul\'s Missions',     ref: 'Acts 13–21',       desc: 'Paul makes three missionary journeys across the Roman Empire, planting churches in Asia Minor, Greece, and beyond. He writes most of the New Testament letters.',  icon: '⚓' },
      { year: 'AD 70',       label: 'Temple Destroyed',     ref: 'Matthew 24:2',     desc: 'Rome destroys Jerusalem and the Second Temple, exactly as Jesus predicted. Over one million Jews die. The Jewish people are scattered across the world.',  icon: '💔' },
      { year: 'c. AD 95',    label: 'Revelation Written',   ref: 'Revelation 1',     desc: 'John receives the Revelation on the island of Patmos. The final book of the Bible is written. It promises the return of Christ and the ultimate victory of God.',  icon: '📖' },
    ],
  },
  {
    id:    'prophets',
    title: 'The Prophets Timeline',
    icon:  '🔮',
    color: '#9c27b0',
    events: [
      { year: 'c. 875 BC', label: 'Elijah',      ref: '1 Kings 17', desc: 'The great prophet of fire. Challenged 450 prophets of Baal on Mount Carmel. Was taken to heaven in a whirlwind. Represents the Law in the Transfiguration.',  icon: '🔥' },
      { year: 'c. 850 BC', label: 'Elisha',      ref: '2 Kings 2',  desc: 'Received a double portion of Elijah\'s spirit. Performed more miracles than any other prophet — including raising the dead, healing leprosy, and making iron float.',  icon: '💧' },
      { year: 'c. 760 BC', label: 'Amos',        ref: 'Amos 1',     desc: 'A shepherd from Tekoa called to prophesy to the Northern Kingdom. Preached against social injustice and empty religion. "Let justice roll on like a river."',  icon: '⚖️' },
      { year: 'c. 755 BC', label: 'Hosea',       ref: 'Hosea 1',    desc: 'God told Hosea to marry an unfaithful wife as a picture of Israel\'s unfaithfulness to God. His life was a living parable of God\'s relentless love.',  icon: '💔' },
      { year: 'c. 750 BC', label: 'Isaiah',      ref: 'Isaiah 1',   desc: 'The "Fifth Gospel." Prophesied the virgin birth, the suffering servant, and the new creation. His book is quoted more in the New Testament than any other Old Testament book.',  icon: '📜' },
      { year: 'c. 740 BC', label: 'Micah',       ref: 'Micah 1',    desc: 'Predicted Jesus would be born in Bethlehem 700 years before it happened. Also gave the famous summary: "Act justly, love mercy, walk humbly with your God."',  icon: '🌟' },
      { year: 'c. 630 BC', label: 'Jeremiah',    ref: 'Jeremiah 1', desc: 'The "Weeping Prophet." Prophesied for 40 years, mostly ignored. Predicted the 70-year Babylonian exile and the New Covenant. Was thrown into a cistern for his message.',  icon: '😢' },
      { year: 'c. 625 BC', label: 'Zephaniah',   ref: 'Zephaniah 1', desc: 'Prophesied during Josiah\'s reign. Warned of the coming Day of the Lord and called for repentance. Also promised a future restoration and joy.',  icon: '⚡' },
      { year: 'c. 612 BC', label: 'Nahum',       ref: 'Nahum 1',    desc: 'Prophesied the destruction of Nineveh — the very city Jonah had warned 150 years earlier. Nineveh fell to Babylon in 612 BC, exactly as predicted.',  icon: '🏙️' },
      { year: 'c. 605 BC', label: 'Daniel',      ref: 'Daniel 1',   desc: 'Taken to Babylon as a teenager. Interpreted dreams for kings. Survived the lions\' den. Received visions of world empires and the coming of the Son of Man.',  icon: '🦁' },
      { year: 'c. 593 BC', label: 'Ezekiel',     ref: 'Ezekiel 1',  desc: 'The prophet of visions. Saw the glory of God departing the Temple. Prophesied the valley of dry bones — a picture of national resurrection. Saw a future Temple.',  icon: '👁️' },
      { year: 'c. 520 BC', label: 'Haggai',      ref: 'Haggai 1',   desc: 'Challenged the returned exiles to rebuild the Temple. "Is it time for you to live in panelled houses while this house remains a ruin?" The Temple was completed in 516 BC.',  icon: '🏗️' },
      { year: 'c. 520 BC', label: 'Zechariah',   ref: 'Zechariah 1', desc: 'Gave the most detailed Messianic prophecies of any prophet — the triumphal entry on a donkey, 30 pieces of silver, the pierced one, the shepherd struck. All fulfilled by Jesus.',  icon: '🔮' },
      { year: 'c. 430 BC', label: 'Malachi',     ref: 'Malachi 1',  desc: 'The last Old Testament prophet. Predicted the coming of Elijah before the great Day of the Lord. Then 400 years of silence — until John the Baptist.',  icon: '🌅' },
    ],
  },
]

// ══════════════════════════════════════════════════════════════════
// FONT & ANIMATIONS
// ══════════════════════════════════════════════════════════════════
const FONT = `@import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&display=swap');`
const ANIM = `
  @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes glow     { 0%,100%{box-shadow:0 0 12px rgba(240,192,64,0.15)} 50%{box-shadow:0 0 28px rgba(240,192,64,0.4)} }
  @keyframes pulse    { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
  @keyframes pinDrop  { 0%{transform:translateY(-20px) scale(0.5);opacity:0} 70%{transform:translateY(4px) scale(1.1)} 100%{transform:translateY(0) scale(1);opacity:1} }
  @keyframes slideIn  { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
  .map-pin { animation: pinDrop 0.35s ease both; cursor: pointer; }
  .map-pin:hover .pin-dot { transform: scale(1.4); }
  .timeline-event { animation: fadeUp 0.4s ease both; }
  .timeline-event:hover { transform: translateX(4px); transition: transform 0.2s; }
`

// ══════════════════════════════════════════════════════════════════
// MAP BACKGROUND COMPONENT (SVG-based terrain)
// ══════════════════════════════════════════════════════════════════
function MapBackground({ mapId }) {
  // Simplified SVG terrain backgrounds for each map
  const terrains = {
    paul: (
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
        {/* Sea */}
        <rect width="100" height="100" fill="#1a3a5c" />
        {/* Mediterranean */}
        <ellipse cx="50" cy="40" rx="48" ry="25" fill="#1e4976" opacity="0.9" />
        {/* Land masses */}
        {/* Anatolia/Turkey */}
        <path d="M55,15 Q70,12 85,18 Q90,22 88,30 Q82,35 75,32 Q68,28 60,30 Q55,28 52,22 Z" fill="#5a7a3a" />
        {/* Greece */}
        <path d="M42,22 Q50,18 55,22 Q58,28 55,34 Q50,36 46,32 Q42,28 42,22 Z" fill="#5a7a3a" />
        {/* Italy */}
        <path d="M38,18 Q44,16 46,22 Q44,28 42,34 Q40,36 38,32 Q36,26 38,18 Z" fill="#5a7a3a" />
        {/* Cyprus */}
        <ellipse cx="60" cy="44" rx="4" ry="2" fill="#6a8a4a" />
        {/* Levant/Israel */}
        <path d="M62,38 Q68,36 70,42 Q68,48 64,50 Q60,48 60,42 Z" fill="#7a8a5a" />
        {/* Egypt */}
        <path d="M30,55 Q50,52 65,55 Q68,62 60,68 Q40,70 28,65 Z" fill="#c4a35a" />
        {/* Malta */}
        <ellipse cx="48" cy="38" rx="1.5" ry="1" fill="#6a8a4a" />
        {/* Crete */}
        <ellipse cx="57" cy="36" rx="5" ry="1.5" fill="#6a8a4a" />
        {/* Sicily */}
        <path d="M46,32 Q50,30 52,34 Q50,37 47,36 Z" fill="#6a8a4a" />
        {/* Grid lines */}
        {[20,40,60,80].map(x => <line key={x} x1={x} y1="0" x2={x} y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />)}
        {[20,40,60,80].map(y => <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />)}
      </svg>
    ),
    exodus: (
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
        <rect width="100" height="100" fill="#1a3a5c" />
        {/* Red Sea */}
        <path d="M28,50 Q30,55 32,70 Q34,80 36,90 L30,90 L26,70 Z" fill="#1e4976" opacity="0.8" />
        {/* Gulf of Aqaba */}
        <path d="M38,55 Q40,65 42,80 L38,80 L36,65 Z" fill="#1e4976" opacity="0.8" />
        {/* Mediterranean */}
        <rect x="0" y="0" width="100" height="42" fill="#1e4976" opacity="0.6" />
        {/* Egypt */}
        <path d="M0,42 Q20,40 35,45 Q38,55 35,70 Q20,75 0,72 Z" fill="#c4a35a" />
        {/* Nile Delta */}
        <path d="M10,42 Q20,38 30,42 Q25,48 15,50 Z" fill="#4a7a3a" />
        {/* Sinai Peninsula */}
        <path d="M28,50 Q38,48 42,55 Q44,65 42,80 Q38,82 34,78 Q30,65 28,50 Z" fill="#c4a35a" opacity="0.9" />
        {/* Canaan/Israel */}
        <path d="M38,42 Q50,40 55,45 Q55,58 50,62 Q44,60 40,55 Z" fill="#7a9a5a" />
        {/* Desert shading */}
        <path d="M0,55 Q15,52 28,55 Q30,65 28,80 Q15,82 0,78 Z" fill="#d4b36a" opacity="0.5" />
        {[20,40,60,80].map(x => <line key={x} x1={x} y1="0" x2={x} y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />)}
        {[20,40,60,80].map(y => <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />)}
      </svg>
    ),
    jesus: (
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
        <rect width="100" height="100" fill="#1a3a5c" />
        {/* Mediterranean */}
        <rect x="0" y="0" width="60" height="100" fill="#1e4976" opacity="0.7" />
        {/* Israel/Canaan */}
        <path d="M58,40 Q68,38 72,45 Q72,68 68,72 Q62,74 58,68 Q56,55 58,40 Z" fill="#7a9a5a" />
        {/* Galilee region */}
        <path d="M60,42 Q68,40 70,46 Q68,52 62,52 Q58,50 60,42 Z" fill="#8aaa6a" />
        {/* Sea of Galilee */}
        <ellipse cx="65" cy="49" rx="3" ry="4" fill="#2a6a9c" />
        {/* Jordan River */}
        <path d="M65,53 Q64,58 64,65 Q63,70 63,75" stroke="#2a6a9c" strokeWidth="0.8" fill="none" />
        {/* Dead Sea */}
        <ellipse cx="64" cy="62" rx="2" ry="4" fill="#2a5a8c" opacity="0.8" />
        {/* Judean hills */}
        <path d="M60,55 Q66,53 68,58 Q66,64 62,64 Q58,62 60,55 Z" fill="#6a8a5a" />
        {/* Negev desert */}
        <path d="M58,68 Q66,66 70,72 Q68,80 62,82 Q56,80 58,68 Z" fill="#c4a35a" opacity="0.7" />
        {/* Egypt */}
        <path d="M30,62 Q50,58 58,62 Q60,72 55,78 Q40,80 28,75 Z" fill="#c4a35a" opacity="0.6" />
        {[20,40,60,80].map(x => <line key={x} x1={x} y1="0" x2={x} y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />)}
        {[20,40,60,80].map(y => <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />)}
      </svg>
    ),
    kingdoms: (
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
        <rect width="100" height="100" fill="#1a3a5c" />
        {/* Mediterranean */}
        <rect x="0" y="0" width="60" height="100" fill="#1e4976" opacity="0.65" />
        {/* Israel/Canaan */}
        <path d="M58,40 Q68,38 72,45 Q72,68 68,72 Q62,74 58,68 Q56,55 58,40 Z" fill="#7a9a5a" />
        {/* Northern Kingdom shading */}
        <path d="M60,42 Q68,40 70,46 Q68,56 62,56 Q58,54 60,42 Z" fill="#4a7aaa" opacity="0.3" />
        {/* Southern Kingdom shading */}
        <path d="M60,56 Q68,56 70,62 Q68,68 62,68 Q58,66 60,56 Z" fill="#aa4a7a" opacity="0.3" />
        {/* Sea of Galilee */}
        <ellipse cx="65" cy="49" rx="3" ry="4" fill="#2a6a9c" />
        {/* Dead Sea */}
        <ellipse cx="64" cy="62" rx="2" ry="4" fill="#2a5a8c" opacity="0.8" />
        {/* Jordan River */}
        <path d="M65,53 Q64,58 64,65" stroke="#2a6a9c" strokeWidth="0.8" fill="none" />
        {/* Mesopotamia */}
        <path d="M75,30 Q90,28 95,35 Q95,55 90,60 Q80,62 75,55 Z" fill="#c4a35a" opacity="0.5" />
        {/* Tigris/Euphrates */}
        <path d="M80,32 Q82,40 80,55" stroke="#2a6a9c" strokeWidth="0.6" fill="none" opacity="0.6" />
        <path d="M85,30 Q88,42 85,58" stroke="#2a6a9c" strokeWidth="0.6" fill="none" opacity="0.6" />
        {[20,40,60,80].map(x => <line key={x} x1={x} y1="0" x2={x} y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />)}
        {[20,40,60,80].map(y => <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />)}
      </svg>
    ),
  }
  return terrains[mapId] || terrains.paul
}

// ══════════════════════════════════════════════════════════════════
// LOCATION PIN COMPONENT
// ══════════════════════════════════════════════════════════════════
function LocationPin({ loc, color, isSelected, isHighlighted, onClick, index }) {
  return (
    <div
      className="map-pin"
      style={{
        position:        'absolute',
        left:            `${loc.x}%`,
        top:             `${loc.y}%`,
        transform:       'translate(-50%, -100%)',
        zIndex:          isSelected ? 20 : isHighlighted ? 15 : 10,
        animationDelay:  `${index * 0.04}s`,
      }}
      onClick={() => onClick(loc)}
      title={loc.name}
    >
      {/* Pin stem */}
      <div style={{
        width:           '2px',
        height:          isSelected ? '18px' : '12px',
        background:      isSelected ? color : (isHighlighted ? color : 'rgba(255,255,255,0.5)'),
        margin:          '0 auto',
        transition:      'all 0.2s',
      }} />
      {/* Pin head */}
      <div
        className="pin-dot"
        style={{
          width:           isSelected ? '18px' : isHighlighted ? '14px' : '10px',
          height:          isSelected ? '18px' : isHighlighted ? '14px' : '10px',
          borderRadius:    '50% 50% 50% 0',
          transform:       'rotate(-45deg)',
          background:      isSelected ? color : (isHighlighted ? color + 'cc' : 'rgba(255,255,255,0.6)'),
          border:          `2px solid ${isSelected ? '#fff' : 'rgba(255,255,255,0.4)'}`,
          boxShadow:       isSelected ? `0 0 12px ${color}` : 'none',
          transition:      'all 0.2s',
          marginTop:       '-2px',
        }}
      />
      {/* Label */}
      {(isSelected || isHighlighted) && (
        <div style={{
          position:        'absolute',
          bottom:          '100%',
          left:            '50%',
          transform:       'translateX(-50%)',
          background:      'rgba(10,5,2,0.95)',
          border:          `1px solid ${color}66`,
          borderRadius:    '6px',
          padding:         '3px 8px',
          whiteSpace:      'nowrap',
          color:           '#f0e6d2',
          fontSize:        '0.72rem',
          fontWeight:      '700',
          marginBottom:    '4px',
          pointerEvents:   'none',
          animation:       'fadeIn 0.2s ease',
        }}>
          {loc.name}
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// LOCATION DETAIL PANEL
// ══════════════════════════════════════════════════════════════════
function LocationDetail({ loc, color, onClose }) {
  if (!loc) return null
  return (
    <div style={{
      position:     'absolute',
      bottom:       '12px',
      left:         '12px',
      right:        '12px',
      background:   'rgba(10,5,2,0.97)',
      border:       `1px solid ${color}55`,
      borderRadius: '14px',
      padding:      '1.1rem 1.25rem',
      zIndex:       30,
      animation:    'slideIn 0.25s ease',
      maxHeight:    '45%',
      overflowY:    'auto',
    }}>
      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position:   'absolute',
          top:        '10px',
          right:      '12px',
          background: 'none',
          border:     'none',
          color:      '#c8a96e',
          cursor:     'pointer',
          fontSize:   '1.1rem',
          lineHeight: 1,
        }}
      >✕</button>

      {/* Header */}
      <div style={{ marginBottom:'0.6rem', paddingRight:'1.5rem' }}>
        <div style={{ color: color, fontSize:'1.1rem', fontWeight:'700', marginBottom:'3px' }}>
          📍 {loc.name}
        </div>
        <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
          <span style={{
            background:   color + '20',
            color:        color,
            border:       `1px solid ${color}44`,
            borderRadius: '10px',
            padding:      '2px 8px',
            fontSize:     '0.72rem',
            fontWeight:   '700',
          }}>
            📖 {loc.ref}
          </span>
          {loc.modern && (
            <span style={{
              background:   'rgba(255,255,255,0.06)',
              color:        '#c8a96e',
              borderRadius: '10px',
              padding:      '2px 8px',
              fontSize:     '0.72rem',
            }}>
              🗺️ {loc.modern}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p style={{
        color:      '#f0e6d2',
        fontSize:   '0.95rem',
        lineHeight: '1.7',
        margin:     0,
        fontStyle:  'italic',
      }}>
        {loc.desc}
      </p>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// INTERACTIVE MAP COMPONENT
// ══════════════════════════════════════════════════════════════════
function InteractiveMap({ mapData }) {
  const [selectedLoc,   setSelectedLoc]   = useState(null)
  const [activeJourney, setActiveJourney] = useState(null)
  const [hoveredLoc,    setHoveredLoc]    = useState(null)
  const [zoom,          setZoom]          = useState(1)
  const [pan,           setPan]           = useState({ x: 0, y: 0 })
  const mapRef = useRef(null)

  const highlightedIds = useMemo(() => {
    if (!activeJourney) return new Set()
    const j = mapData.journeys.find(j => j.id === activeJourney)
    return j ? new Set(j.cities) : new Set()
  }, [activeJourney, mapData])

  const journeyColor = useMemo(() => {
    if (!activeJourney) return mapData.color
    const j = mapData.journeys.find(j => j.id === activeJourney)
    return j ? j.color : mapData.color
  }, [activeJourney, mapData])

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>

      {/* Journey selector */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', alignItems:'center' }}>
        <span style={{ color:'#c8a96e', fontSize:'0.82rem', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.06em' }}>
          Filter by journey:
        </span>
        <button
          style={{
            padding:      '5px 14px',
            borderRadius: '16px',
            border:       `1px solid ${activeJourney === null ? mapData.color : 'rgba(255,255,255,0.15)'}`,
            background:   activeJourney === null ? mapData.color + '20' : 'transparent',
            color:        activeJourney === null ? mapData.color : '#c8a96e',
            cursor:       'pointer',
            fontFamily:   'inherit',
            fontSize:     '0.82rem',
            fontWeight:   activeJourney === null ? '700' : '500',
          }}
          onClick={() => setActiveJourney(null)}
        >
          🌟 All Locations
        </button>
        {mapData.journeys.map(j => (
          <button
            key={j.id}
            style={{
              padding:      '5px 14px',
              borderRadius: '16px',
              border:       `1px solid ${activeJourney === j.id ? j.color : 'rgba(255,255,255,0.15)'}`,
              background:   activeJourney === j.id ? j.color + '20' : 'transparent',
              color:        activeJourney === j.id ? j.color : '#c8a96e',
              cursor:       'pointer',
              fontFamily:   'inherit',
              fontSize:     '0.82rem',
              fontWeight:   activeJourney === j.id ? '700' : '500',
              transition:   'all 0.15s',
            }}
            onClick={() => setActiveJourney(prev => prev === j.id ? null : j.id)}
          >
            <span style={{ display:'inline-block', width:'8px', height:'8px', borderRadius:'50%', background:j.color, marginRight:'6px', verticalAlign:'middle' }} />
            {j.label}
            <span style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.72rem', marginLeft:'4px' }}>({j.reference})</span>
          </button>
        ))}
      </div>

      {/* Map container */}
      <div
        ref={mapRef}
        style={{
          position:     'relative',
          width:        '100%',
          paddingBottom:'60%',
          borderRadius: '16px',
          overflow:     'hidden',
          border:       `1px solid ${mapData.color}33`,
          background:   '#0d1a2e',
          cursor:       'crosshair',
        }}
      >
        {/* Terrain background */}
        <MapBackground mapId={mapData.id} />

        {/* Compass rose */}
        <div style={{
          position:   'absolute',
          top:        '12px',
          right:      '12px',
          width:      '44px',
          height:     '44px',
          background: 'rgba(10,5,2,0.85)',
          border:     '1px solid rgba(240,192,64,0.3)',
          borderRadius:'50%',
          display:    'flex',
          alignItems: 'center',
          justifyContent:'center',
          zIndex:     25,
          fontSize:   '0.65rem',
          color:      '#f0c040',
          fontWeight: '700',
          flexDirection:'column',
          lineHeight: 1,
        }}>
          <span>N</span>
          <span style={{ fontSize:'1rem', lineHeight:1 }}>✦</span>
          <span>S</span>
        </div>

        {/* Map title */}
        <div style={{
          position:   'absolute',
          top:        '12px',
          left:       '12px',
          background: 'rgba(10,5,2,0.85)',
          border:     `1px solid ${mapData.color}44`,
          borderRadius:'10px',
          padding:    '6px 12px',
          zIndex:     25,
        }}>
          <div style={{ color: mapData.color, fontSize:'0.8rem', fontWeight:'700' }}>
            {mapData.icon} {mapData.title}
          </div>
          <div style={{ color:'#c8a96e', fontSize:'0.68rem' }}>{mapData.scripture}</div>
        </div>

        {/* Location pins */}
        {mapData.locations.map((loc, i) => (
          <LocationPin
            key={loc.id}
            loc={loc}
            color={activeJourney ? journeyColor : mapData.color}
            isSelected={selectedLoc?.id === loc.id}
            isHighlighted={activeJourney ? highlightedIds.has(loc.id) : true}
            onClick={l => setSelectedLoc(prev => prev?.id === l.id ? null : l)}
            index={i}
          />
        ))}

        {/* Location count */}
        <div style={{
          position:   'absolute',
          bottom:     selectedLoc ? '55%' : '12px',
          right:      '12px',
          background: 'rgba(10,5,2,0.85)',
          border:     '1px solid rgba(255,255,255,0.1)',
          borderRadius:'8px',
          padding:    '4px 10px',
          color:      '#c8a96e',
          fontSize:   '0.72rem',
          zIndex:     25,
          transition: 'bottom 0.3s',
        }}>
          {activeJourney
            ? `${highlightedIds.size} cities on this route`
            : `${mapData.locations.length} locations`}
        </div>

        {/* Selected location detail */}
        <LocationDetail
          loc={selectedLoc}
          color={mapData.color}
          onClose={() => setSelectedLoc(null)}
        />
      </div>

      {/* Location list */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap:                 '8px',
        maxHeight:           '280px',
        overflowY:           'auto',
        paddingRight:        '4px',
      }}>
        {mapData.locations
          .filter(loc => !activeJourney || highlightedIds.has(loc.id))
          .map((loc, i) => (
            <button
              key={loc.id}
              style={{
                background:   selectedLoc?.id === loc.id ? mapData.color + '20' : 'rgba(255,255,255,0.03)',
                border:       `1px solid ${selectedLoc?.id === loc.id ? mapData.color : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '10px',
                padding:      '8px 12px',
                textAlign:    'left',
                cursor:       'pointer',
                fontFamily:   'inherit',
                transition:   'all 0.15s',
                animation:    `fadeUp 0.3s ease ${i * 0.03}s both`,
              }}
              onClick={() => setSelectedLoc(prev => prev?.id === loc.id ? null : loc)}
            >
              <div style={{ color: selectedLoc?.id === loc.id ? mapData.color : '#f0e6d2', fontSize:'0.88rem', fontWeight:'600', marginBottom:'2px' }}>
                📍 {loc.name}
              </div>
              <div style={{ color:'#7a6040', fontSize:'0.72rem' }}>{loc.ref}</div>
            </button>
          ))}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// TIMELINE COMPONENT
// ══════════════════════════════════════════════════════════════════
function TimelineView({ timeline }) {
  const [selected, setSelected] = useState(null)

  return (
    <div style={{ position:'relative' }}>
      {/* Vertical line */}
      <div style={{
        position:   'absolute',
        left:       '28px',
        top:        0,
        bottom:     0,
        width:      '2px',
        background: `linear-gradient(to bottom, transparent, ${timeline.color}, ${timeline.color}, transparent)`,
        opacity:    0.4,
      }} />

      <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
        {timeline.events.map((event, i) => (
          <div
            key={i}
            className="timeline-event"
            style={{ animationDelay:`${i * 0.04}s` }}
          >
            <div
              style={{
                display:      'flex',
                gap:          '16px',
                alignItems:   'flex-start',
                padding:      '10px 12px',
                borderRadius: '12px',
                cursor:       'pointer',
                background:   selected === i ? timeline.color + '12' : 'transparent',
                border:       `1px solid ${selected === i ? timeline.color + '44' : 'transparent'}`,
                transition:   'all 0.2s',
              }}
              onClick={() => setSelected(prev => prev === i ? null : i)}
            >
              {/* Icon dot */}
              <div style={{
                width:          '36px',
                height:         '36px',
                borderRadius:   '50%',
                background:     selected === i ? timeline.color + '25' : 'rgba(255,255,255,0.05)',
                border:         `2px solid ${selected === i ? timeline.color : 'rgba(255,255,255,0.15)'}`,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                fontSize:       '1.1rem',
                flexShrink:     0,
                zIndex:         1,
                transition:     'all 0.2s',
              }}>
                {event.icon}
              </div>

              {/* Content */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'4px' }}>
                  <div style={{
                    color:      selected === i ? timeline.color : '#f0e6d2',
                    fontSize:   '1rem',
                    fontWeight: '700',
                    lineHeight: '1.3',
                    transition: 'color 0.2s',
                  }}>
                    {event.label}
                  </div>
                  <div style={{ display:'flex', gap:'8px', flexShrink:0 }}>
                    <span style={{
                      color:        timeline.color,
                      fontSize:     '0.78rem',
                      fontWeight:   '700',
                      background:   timeline.color + '15',
                      padding:      '2px 8px',
                      borderRadius: '10px',
                    }}>
                      {event.year}
                    </span>
                    <span style={{
                      color:        '#c8a96e',
                      fontSize:     '0.72rem',
                      background:   'rgba(255,255,255,0.05)',
                      padding:      '2px 8px',
                      borderRadius: '10px',
                    }}>
                      {event.ref}
                    </span>
                  </div>
                </div>

                {/* Expanded description */}
                {selected === i && (
                  <p style={{
                    color:      '#c8a96e',
                    fontSize:   '0.92rem',
                    lineHeight: '1.7',
                    margin:     '8px 0 0',
                    fontStyle:  'italic',
                    animation:  'fadeUp 0.2s ease',
                  }}>
                    {event.desc}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════
export default function BibleMapsPage() {
  const [mode,        setMode]        = useState('maps')    // 'maps' | 'timelines'
  const [activeMap,   setActiveMap]   = useState('paul')
  const [activeTime,  setActiveTime]  = useState('bible-overview')
  const [toast,       setToast]       = useState(null)

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 2500) }

  const currentMap      = MAPS.find(m => m.id === activeMap)
  const currentTimeline = TIMELINES.find(t => t.id === activeTime)

  return (
    <div style={s.page}>
      <style>{FONT + ANIM}</style>

      {/* Toast */}
      {toast && <div style={s.toast}>{toast}</div>}

      {/* ── Hero ── */}
      <div style={s.hero}>
        <div style={s.heroIcon}>🗺️</div>
        <h1 style={s.heroTitle}>Bible Maps & Timelines</h1>
        <p style={s.heroSub}>
          See where the stories happened. Understand when they happened.
          <br />
          <em>The Bible is real history in a real place.</em>
        </p>
        <div style={s.heroStats}>
          <div style={s.heroStat}>
            <span style={{ ...s.heroStatNum, color:'#f0c040' }}>{MAPS.length}</span>
            <span style={s.heroStatLabel}>Interactive Maps</span>
          </div>
          <div style={s.heroStatDiv} />
          <div style={s.heroStat}>
            <span style={{ ...s.heroStatNum, color:'#2196f3' }}>
              {MAPS.reduce((sum, m) => sum + m.locations.length, 0)}
            </span>
            <span style={s.heroStatLabel}>Biblical Locations</span>
          </div>
          <div style={s.heroStatDiv} />
          <div style={s.heroStat}>
            <span style={{ ...s.heroStatNum, color:'#4caf50' }}>
              {TIMELINES.reduce((sum, t) => sum + t.events.length, 0)}
            </span>
            <span style={s.heroStatLabel}>Timeline Events</span>
          </div>
        </div>
      </div>

      {/* ── Mode toggle ── */}
      <div style={s.modeRow}>
        <button
          style={{ ...s.modeBtn, ...(mode === 'maps' ? s.modeBtnOn : {}) }}
          onClick={() => setMode('maps')}
        >
          🗺️ Interactive Maps
        </button>
        <button
          style={{ ...s.modeBtn, ...(mode === 'timelines' ? s.modeBtnOn : {}) }}
          onClick={() => setMode('timelines')}
        >
          📅 Timelines
        </button>
      </div>

      {/* ══════════ MAPS MODE ══════════ */}
      {mode === 'maps' && (
        <div style={s.content}>

          {/* Map selector cards */}
          <div style={s.selectorGrid}>
            {MAPS.map(map => (
              <button
                key={map.id}
                style={{
                  ...s.selectorCard,
                  background:   activeMap === map.id ? map.bgGradient : 'rgba(255,255,255,0.03)',
                  border:       `1px solid ${activeMap === map.id ? map.color + '66' : 'rgba(255,255,255,0.08)'}`,
                  boxShadow:    activeMap === map.id ? `0 0 20px ${map.color}22` : 'none',
                }}
                onClick={() => setActiveMap(map.id)}
              >
                <div style={{ fontSize:'2rem', marginBottom:'0.5rem' }}>{map.icon}</div>
                <div style={{
                  color:      activeMap === map.id ? map.color : '#f0e6d2',
                  fontSize:   '0.95rem',
                  fontWeight: '700',
                  marginBottom:'0.25rem',
                  lineHeight: '1.3',
                }}>
                  {map.title}
                </div>
                <div style={{ color:'#7a6040', fontSize:'0.72rem' }}>{map.scripture}</div>
                <div style={{
                  marginTop:    '0.5rem',
                  color:        map.color,
                  fontSize:     '0.72rem',
                  fontWeight:   '700',
                  background:   map.color + '15',
                  borderRadius: '8px',
                  padding:      '2px 8px',
                  display:      'inline-block',
                }}>
                  {map.locations.length} locations
                </div>
              </button>
            ))}
          </div>

          {/* Map description */}
          {currentMap && (
            <div style={{
              ...s.mapDescBox,
              background:  currentMap.bgGradient,
              borderColor: currentMap.color + '33',
            }}>
              <div style={{ display:'flex', gap:'12px', alignItems:'flex-start', flexWrap:'wrap' }}>
                <span style={{ fontSize:'2.5rem' }}>{currentMap.icon}</span>
                <div style={{ flex:1 }}>
                  <h2 style={{ color: currentMap.color, fontSize:'1.5rem', fontWeight:'700', margin:'0 0 0.4rem' }}>
                    {currentMap.title}
                  </h2>
                  <p style={{ color:'#c8a96e', fontSize:'1rem', lineHeight:'1.7', margin:'0 0 0.5rem', fontStyle:'italic' }}>
                    {currentMap.description}
                  </p>
                  <span style={{
                    color:        currentMap.color,
                    fontSize:     '0.82rem',
                    fontWeight:   '700',
                    background:   currentMap.color + '15',
                    borderRadius: '10px',
                    padding:      '3px 10px',
                  }}>
                    📖 {currentMap.scripture}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Interactive map */}
          {currentMap && (
            <div style={s.mapWrap}>
              <InteractiveMap mapData={currentMap} />
            </div>
          )}
        </div>
      )}

      {/* ══════════ TIMELINES MODE ══════════ */}
      {mode === 'timelines' && (
        <div style={s.content}>

          {/* Timeline selector */}
          <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', marginBottom:'1.5rem' }}>
            {TIMELINES.map(t => (
              <button
                key={t.id}
                style={{
                  padding:      '10px 22px',
                  borderRadius: '22px',
                  border:       `1px solid ${activeTime === t.id ? t.color : 'rgba(255,255,255,0.12)'}`,
                  background:   activeTime === t.id ? t.color + '18' : 'transparent',
                  color:        activeTime === t.id ? t.color : '#c8a96e',
                  cursor:       'pointer',
                  fontFamily:   'inherit',
                  fontSize:     '1rem',
                  fontWeight:   activeTime === t.id ? '700' : '500',
                  transition:   'all 0.2s',
                }}
                onClick={() => setActiveTime(t.id)}
              >
                {t.icon} {t.title}
                <span style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.78rem', marginLeft:'6px' }}>
                  ({t.events.length} events)
                </span>
              </button>
            ))}
          </div>

          {/* Timeline content */}
          {currentTimeline && (
            <div style={{
              background:   'rgba(255,255,255,0.02)',
              border:       `1px solid ${currentTimeline.color}22`,
              borderRadius: '16px',
              padding:      '1.5rem',
            }}>
              <div style={{ marginBottom:'1.5rem' }}>
                <h2 style={{ color: currentTimeline.color, fontSize:'1.5rem', fontWeight:'700', margin:'0 0 0.4rem' }}>
                  {currentTimeline.icon} {currentTimeline.title}
                </h2>
                <p style={{ color:'#c8a96e', fontSize:'0.9rem', margin:0, fontStyle:'italic' }}>
                  Click any event to expand its description. {currentTimeline.events.length} events total.
                </p>
              </div>
              <TimelineView timeline={currentTimeline} />
            </div>
          )}
        </div>
      )}

      {/* ── Bottom note ── */}
      <div style={s.bottomNote}>
        <p style={{ color:'#7a6040', fontSize:'0.85rem', textAlign:'center', fontStyle:'italic', margin:0 }}>
          📍 Map coordinates are approximate representations for educational purposes.
          Exact locations of some ancient sites remain debated by scholars.
        </p>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════════════════════════════
const s = {
  page:         { background:'#0d0800', minHeight:'100vh', color:'#f0e6d2',
                  padding:'2rem 1rem', fontFamily:"'Crimson Text',serif" },
  hero:         { textAlign:'center', maxWidth:'700px', margin:'0 auto 2.5rem',
                  padding:'2.5rem 1.5rem', borderRadius:'20px',
                  background:'linear-gradient(135deg,rgba(240,192,64,0.07),rgba(33,150,243,0.05))',
                  border:'1px solid rgba(240,192,64,0.2)',
                  animation:'glow 4s ease-in-out infinite' },
  heroIcon:     { fontSize:'4rem', marginBottom:'0.75rem' },
  heroTitle:    { color:'#f0c040', fontSize:'2.8rem', fontWeight:'700',
                  margin:'0 0 1rem', lineHeight:'1.2' },
  heroSub:      { color:'#c8a96e', fontSize:'1.05rem', lineHeight:'1.8',
                  margin:'0 0 2rem', fontStyle:'italic' },
  heroStats:    { display:'flex', justifyContent:'center', alignItems:'center',
                  gap:'1.5rem', flexWrap:'wrap' },
  heroStat:     { display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' },
  heroStatNum:  { fontSize:'2rem', fontWeight:'700', lineHeight:'1' },
  heroStatLabel:{ color:'#c8a96e', fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'0.08em' },
  heroStatDiv:  { width:'1px', height:'36px', background:'rgba(240,192,64,0.25)' },
  modeRow:      { display:'flex', gap:'12px', justifyContent:'center',
                  marginBottom:'2rem', flexWrap:'wrap' },
  modeBtn:      { padding:'11px 28px', borderRadius:'25px',
                  border:'1px solid rgba(240,192,64,0.25)',
                  background:'transparent', color:'#c8a96e',
                  cursor:'pointer', fontFamily:'inherit', fontSize:'1.05rem',
                  transition:'all 0.2s' },
  modeBtnOn:    { background:'rgba(240,192,64,0.15)', borderColor:'#f0c040',
                  color:'#f0c040', fontWeight:'700' },
  content:      { maxWidth:'1000px', margin:'0 auto' },
  selectorGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',
                  gap:'12px', marginBottom:'1.5rem' },
  selectorCard: { padding:'1.25rem', borderRadius:'14px', cursor:'pointer',
                  fontFamily:'inherit', textAlign:'center',
                  transition:'all 0.2s', border:'1px solid' },
  mapDescBox:   { borderRadius:'14px', padding:'1.25rem 1.5rem',
                  marginBottom:'1.5rem', border:'1px solid' },
  mapWrap:      { background:'rgba(255,255,255,0.02)', borderRadius:'16px',
                  padding:'1.25rem', border:'1px solid rgba(255,255,255,0.06)',
                  marginBottom:'2rem' },
  bottomNote:   { maxWidth:'600px', margin:'2rem auto 0', padding:'0 1rem' },
  toast:        { position:'fixed', bottom:'28px', left:'50%',
                  transform:'translateX(-50%)', background:'#2a1a08',
                  border:'1px solid #f0c040', color:'#f0e6d2',
                  padding:'12px 26px', borderRadius:'25px', zIndex:999,
                  fontSize:'1rem', whiteSpace:'nowrap',
                  animation:'fadeUp 0.2s ease',
                  boxShadow:'0 4px 20px rgba(0,0,0,0.5)' },
}