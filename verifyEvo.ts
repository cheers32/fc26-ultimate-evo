import { StatsData } from './src/types/player';
import { simulateEvoChain } from './src/utils/evoEngine';
import { availableEvolutions } from './src/data/evolutionsData';

const createBaseStats = (vision: number, crossing: number, fk: number, short: number, long: number, curve: number, baseFace: number): StatsData => {
  return {
    pac: { baseFace: 50, evFace: 50, subs: { acceleration: { base: 50, w: 0.45 }, sprintSpeed: { base: 50, w: 0.55 } } },
    sho: { baseFace: 50, evFace: 50, subs: { positioning: { base: 50, w: 0.05 }, finishing: { base: 50, w: 0.45 }, shotPower: { base: 50, w: 0.2 }, longShots: { base: 50, w: 0.2 }, volleys: { base: 50, w: 0.05 }, penalties: { base: 50, w: 0.05 } } },
    pas: { 
      baseFace, 
      evFace: baseFace, 
      subs: { 
        vision: { base: vision, w: 0.20 }, 
        crossing: { base: crossing, w: 0.20 }, 
        freekick: { base: fk, w: 0.05 }, 
        shortPass: { base: short, w: 0.35 }, 
        longPass: { base: long, w: 0.15 }, 
        curve: { base: curve, w: 0.05 } 
      } 
    },
    dri: { baseFace: 50, evFace: 50, subs: { agility: { base: 50, w: 0.1 }, balance: { base: 50, w: 0.05 }, reactions: { base: 50, w: 0.05 }, ballControl: { base: 50, w: 0.3 }, dribbling: { base: 50, w: 0.5 }, composure: { base: 50, w: 0 } } },
    def: { baseFace: 50, evFace: 50, subs: { interceptions: { base: 50, w: 0.2 }, heading: { base: 50, w: 0.1 }, awareness: { base: 50, w: 0.3 }, standTackle: { base: 50, w: 0.3 }, slideTackle: { base: 50, w: 0.1 } } },
    phy: { baseFace: 50, evFace: 50, subs: { jumping: { base: 50, w: 0.05 }, stamina: { base: 50, w: 0.25 }, strength: { base: 50, w: 0.5 }, aggression: { base: 50, w: 0.2 } } },
  };
};

const verify = (name: string, baseStats: StatsData, expectedSubStats: number[]) => {
  const result = simulateEvoChain(
    ['1154'], 
    { primaryPositions: 'CM', secondaryPositions: '', weakFoot: 3, skillMoves: 3, rarity: 'gold' }, 
    { base: 80, limit: 99 }, 
    baseStats, 
    { base: { gold: [], silver: [] }, limit: { gold: 1, silver: 7 } }
  );
  
  const resPas = result.finalStats.pas;
  const resSubs = [
    resPas.subs.vision.base,
    resPas.subs.crossing.base,
    resPas.subs.freekick.base,
    resPas.subs.shortPass.base,
    resPas.subs.longPass.base,
    resPas.subs.curve.base,
  ];

  const matched = resSubs.every((val, index) => val === expectedSubStats[index]);
  console.log(`--- ${name} ---`);
  console.log(`Expected Subs:`, expectedSubStats);
  console.log(`Actual Subs:  `, resSubs);
  console.log(`Match? ${matched ? '✅' : '❌'}`);
};

verify('Example 1 (High base stats)', createBaseStats(83, 75, 64, 93, 93, 84, 86), [90, 82, 71, 96, 96, 91]);
verify('Example 2', createBaseStats(79, 72, 59, 88, 86, 81, 81), [84, 76, 64, 93, 91, 86]);
verify('Example 3', createBaseStats(70, 67, 65, 82, 77, 67, 74), [75, 71, 69, 88, 82, 71]);
