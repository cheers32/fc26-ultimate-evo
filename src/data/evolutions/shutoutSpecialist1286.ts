import { EvolutionDefinition } from '../../types/player';

/**
 * The defensive counterpart to Prime Motion, at the same price and the same two levels: thirteen
 * sub-stats, all of them defensive, physical or on the mental side of the card. Stamina and Strength
 * both reach 98, which is what makes it more than a defender's evo — the stamina alone can carry a
 * midfielder over the bar that most builds fail on.
 *
 * The trap is Strength. On a card being built for Explosive, +30 strength against nothing on the
 * agility side spends the very lead the archetype is read from, so this is a Lengthy plan's evo and
 * an Explosive plan's tax.
 */
export const shutoutSpecialist1286: EvolutionDefinition = {
  id: '1286',
  name: 'Shutout Specialist',
  futbinLink: 'https://www.futbin.com/26/evolutions/1286/shutout-specialist',
  version: 'FC 26',
  description:
    'Found in the Pre Season Token Store. Bully opposition attackers off the ball, burst through ' +
    'tight midfield scrambles, and completely nullify every counterattack to secure the clean sheet.',
  cost: 'Tokens — 100 Pre Season Tokens',
  requirements: {
    maxOvr: 98,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 10, limit: 99 },
  // Heading, Interceptions, Reactions, Aggression, Jumping and Slide Tackle are printed without a
  // cap of their own, so only the 99 ceiling holds them.
  //
  // Four of these are not round numbers, and that is the whole reason to read them off FUTBIN:
  // FUT.GG prints every one of them as +30 and has Aggression at +20 against FUTBIN's +32.
  subStatBoosts: {
    balance: { boost: 30, limit: 98 },
    reactions: { boost: 30, limit: 99 },
    composure: { boost: 30, limit: 97 },
    interceptions: { boost: 32, limit: 99 },
    headingAcc: { boost: 30, limit: 99 },
    defAwareness: { boost: 30, limit: 98 },
    standTackle: { boost: 30, limit: 98 },
    slideTackle: { boost: 31, limit: 99 },
    jumping: { boost: 31, limit: 99 },
    stamina: { boost: 30, limit: 98 },
    strength: { boost: 30, limit: 98 },
    aggression: { boost: 32, limit: 99 }
  },
  playStylesAdded: { gold: [], silver: [] },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +10',
        'Balance +30 (98)',
        'Heading Acc. +30',
        'Interceptions +32',
        'Def. Aware +30 (98)',
        'Reactions +30',
        'Composure +30 (97)',
        'Challenge: play 1 match with the active EVO player'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Aggression +32',
        'Jumping +31',
        'Slide Tackle +31',
        'Stand Tackle +30 (98)',
        'Stamina +30 (98)',
        'Strength +30 (98)',
        'Challenge: play 1 match with the active EVO player'
      ]
    }
  ],
  trainingTime: '1 Month',
  maxRepeatable: 1
};
