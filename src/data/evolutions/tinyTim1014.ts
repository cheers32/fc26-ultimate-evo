import { EvolutionDefinition } from '../../types/player';

export const tinyTim1014: EvolutionDefinition = {
  "id": "1014",
  "name": "Tiny Tim",
  "futbinLink": "https://www.futbin.com/26/evolutions/1014/tiny-tim",
  "version": "FC 26",
  "description": "UT Found in the Perfect Volley Objective",
  "cost": "Free / Objective",
  "requirements": {
    "maxOvr": 91,
    "maxPlayStyles": 10,
    "maxPlayStylesPlus": 3,
    "notRarity": "World Tour Silver Stars",
    "positions": [
      "ST"
    ]
  },
  "ovrBoost": {
    "boost": 25,
    "limit": 93
  },
  "faceBoosts": {},
  "subStatBoosts": {
    "acceleration": {
      "boost": 15,
      "limit": 91
    },
    "aggression": {
      "boost": 40,
      "limit": 97
    },
    "agility": {
      "boost": 25,
      "limit": 90
    },
    "balance": {
      "boost": 25,
      "limit": 90
    },
    "ballControl": {
      "boost": 25,
      "limit": 92
    },
    "dribbling": {
      "boost": 25,
      "limit": 92
    },
    "finishing": {
      "boost": 35,
      "limit": 95
    },
    "headingAcc": {
      "boost": 40,
      "limit": 99
    },
    "jumping": {
      "boost": 40,
      "limit": 97
    },
    "longShots": {
      "boost": 30,
      "limit": 93
    },
    "positioning": {
      "boost": 30,
      "limit": 93
    },
    "reactions": {
      "boost": 35,
      "limit": 95
    },
    "shortPass": {
      "boost": 30,
      "limit": 93
    },
    "shotPower": {
      "boost": 35,
      "limit": 96
    },
    "sprintSpeed": {
      "boost": 15,
      "limit": 93
    },
    "stamina": {
      "boost": 30,
      "limit": 92
    },
    "strength": {
      "boost": 30,
      "limit": 94
    },
    "vision": {
      "boost": 30,
      "limit": 91
    },
    "volleys": {
      "boost": 35,
      "limit": 96
    },
    "composure": {
      "boost": 35,
      "limit": 95
    }
  },
  "weakFootBoost": 4,
  "positionsAdded": [
    "LM",
    "RM"
  ],
  "playStylesAdded": {
    "gold": [
      "Low Driven Shot",
      "Enforcer"
    ],
    "silver": [
      "Finesse Shot",
      "Incisive Pass",
      "First Touch",
      "Precision Header"
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
        "OVR +25 (93)",
        "Aggression +40 (97)",
        "Finishing +35 (95)",
        "Reactions +35 (95)",
        "Volleys +35 (96)",
        "PlayStyle+: Low Driven Shot (3)"
      ]
    },
    {
      "name": "Level 2",
      "upgrades": [
        "Acceleration +15 (91)",
        "Agility +25 (90)",
        "Heading Acc. +40",
        "Long Shots +30 (93)",
        "Weak Foot +4",
        "PlayStyle+: Enforcer (3)"
      ]
    },
    {
      "name": "Level 3",
      "upgrades": [
        "Balance +25 (90)",
        "Jumping +40 (97)",
        "Positioning +30 (93)",
        "Vision +30 (91)",
        "Positions: LM, RM"
      ]
    },
    {
      "name": "Level 4",
      "upgrades": [
        "Ball control +25 (92)",
        "Short Passing +30 (93)",
        "Sprint Speed +15 (93)",
        "Strength +30 (94)",
        "PlayStyle: Finesse Shot (8)",
        "PlayStyle: Incisive Pass (8)"
      ]
    },
    {
      "name": "Level 5",
      "upgrades": [
        "Dribbling +25 (92)",
        "Shot Power +35 (96)",
        "Stamina +30 (92)",
        "Composure +35 (95)",
        "PlayStyle: First Touch (8)",
        "PlayStyle: Precision Header (8)"
      ]
    }
  ],
  "maxRepeatable": 1
};
