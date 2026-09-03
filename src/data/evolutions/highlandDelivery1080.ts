import { EvolutionDefinition } from '../../types/player';

export const highlandDelivery1080: EvolutionDefinition = {
  "id": "1080",
  "name": "Highland Delivery",
  "futbinLink": "https://www.futbin.com/26/evolutions/1080/highland-delivery",
  "version": "FC 26",
  description: "Unlock this Evo by completing 'The Tartan Army' objective.",
  descriptionZh: "完成 The Tartan Army 目标解锁。｜适合：任何位置，只加传球线，中场补传球用。",
  "cost": "Free / Objective",
  "requirements": {
    "maxOvr": 92,
    "maxPlayStyles": 10,
    "maxPlayStylesPlus": 3,
    "notRarity": "World Tour Silver Stars",
    "positions": []
  },
  "ovrBoost": {
    "boost": 1,
    "limit": 93
  },
  "faceBoosts": {},
  "subStatBoosts": {
    "crossing": {
      "boost": 15,
      "limit": 97
    },
    "vision": {
      "boost": 15,
      "limit": 95
    },
    "shortPass": {
      "boost": 15,
      "limit": 96
    },
    "freekick": {
      "boost": 10,
      "limit": 94
    },
    "stamina": {
      "boost": 15,
      "limit": 94
    },
    "curve": {
      "boost": 15,
      "limit": 95
    },
    "longPass": {
      "boost": 15,
      "limit": 96
    }
  },
  "weakFootBoost": 4,
  "positionsAdded": [],
  "playStylesAdded": {
    "gold": [
      "Whipped Pass",
      "Incisive Pass"
    ],
    "silver": [
      "Pinged Pass",
      "Tiki Taka",
      "Long Ball Pass",
      "Inventive"
    ]
  },
  "playStylesLimit": {
    "gold": 3,
    "silver": 8
  },
  "levels": [
    {
      "name": "Level 1",
      "upgrades": [
        "OVR +1 (93)",
        "Crossing +15 (97)",
        "Vision +15 (95)",
        "Weak Foot +4",
        "PlayStyle+: Whipped Pass"
      ]
    },
    {
      "name": "Level 2",
      "upgrades": [
        "Short Passing +15 (96)",
        "FK. Acc. +10 (94)",
        "Stamina +15 (94)",
        "PlayStyle+: Incisive Pass"
      ]
    },
    {
      "name": "Level 3",
      "upgrades": [
        "Curve +15 (95)",
        "Long Passing +15 (96)",
        "PlayStyle: Pinged Pass",
        "PlayStyle: Tiki Taka",
        "PlayStyle: Long Ball Pass",
        "PlayStyle: Inventive"
      ]
    }
  ],
  "maxRepeatable": 1
};
