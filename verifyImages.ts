import { StatsData } from './src/types/player';
import { simulateEvoChain } from './src/utils/evoEngine';

const createBaseStats = (): StatsData => {
  return {
    pac: { baseFace: 87, evFace: 87, subs: { acceleration: { base: 87, w: 0.45 }, sprintSpeed: { base: 87, w: 0.55 } } },
    sho: { baseFace: 84, evFace: 84, subs: { positioning: { base: 80, w: 0.05 }, finishing: { base: 78, w: 0.45 }, shotPower: { base: 96, w: 0.2 }, longShots: { base: 92, w: 0.2 }, volleys: { base: 74, w: 0.05 }, penalties: { base: 65, w: 0.05 } } },
    pas: { 
      baseFace: 93, 
      evFace: 93, 
      subs: { 
        vision: { base: 93, w: 0.20 }, 
        crossing: { base: 85, w: 0.20 }, 
        freekick: { base: 74, w: 0.05 }, 
        shortPass: { base: 98, w: 0.35 }, 
        longPass: { base: 97, w: 0.15 }, 
        curve: { base: 94, w: 0.05 } 
      } 
    },
    dri: { baseFace: 92, evFace: 92, subs: { agility: { base: 85, w: 0.1 }, balance: { base: 85, w: 0.05 }, reactions: { base: 97, w: 0.05 }, ballControl: { base: 96, w: 0.3 }, dribbling: { base: 90, w: 0.5 }, composure: { base: 97, w: 0 } } },
    def: { baseFace: 87, evFace: 87, subs: { interceptions: { base: 85, w: 0.2 }, heading: { base: 82, w: 0.1 }, awareness: { base: 89, w: 0.3 }, standTackle: { base: 88, w: 0.3 }, slideTackle: { base: 83, w: 0.1 } } },
    phy: { baseFace: 87, evFace: 87, subs: { jumping: { base: 84, w: 0.05 }, stamina: { base: 95, w: 0.25 }, strength: { base: 84, w: 0.5 }, aggression: { base: 86, w: 0.2 } } },
  };
};

const verify = () => {
  const baseStats = createBaseStats();
  const result = simulateEvoChain(
    ['1154'], 
    { primaryPositions: 'CM', secondaryPositions: '', weakFoot: 3, skillMoves: 3, rarity: 'gold' }, 
    { base: 90, limit: 99 }, 
    baseStats, 
    { base: { gold: [], silver: [] }, limit: { gold: 1, silver: 7 } }
  );
  
  const resPas = result.finalStats.pas;
  const resDri = result.finalStats.dri;
  console.log('--- Passing ---');
  console.log('Vision:', resPas.subs.vision.base);
  console.log('Crossing:', resPas.subs.crossing.base);
  console.log('Freekick:', resPas.subs.freekick.base);
  console.log('ShortPass:', resPas.subs.shortPass.base);
  console.log('LongPass:', resPas.subs.longPass.base);
  console.log('Curve:', resPas.subs.curve.base);

  console.log('--- Dribbling ---');
  console.log('Agility:', resDri.subs.agility.base);
  console.log('Balance:', resDri.subs.balance.base);
  console.log('Reactions:', resDri.subs.reactions.base);
  console.log('BallControl:', resDri.subs.ballControl.base);
  console.log('Dribbling:', resDri.subs.dribbling.base);
  console.log('Composure:', resDri.subs.composure.base);
};

verify();
