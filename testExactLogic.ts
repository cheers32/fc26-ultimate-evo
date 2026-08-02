import { StatsData } from './src/types/player';

const testEngine = () => {
  const baseStats = {
    pas: { 
      baseFace: 93, 
      subs: { 
        vision: { base: 93, w: 0.20 }, 
        crossing: { base: 85, w: 0.20 }, 
        freekick: { base: 74, w: 0.05 }, 
        shortPass: { base: 98, w: 0.35 }, 
        longPass: { base: 97, w: 0.15 }, 
        curve: { base: 94, w: 0.05 } 
      } 
    },
    dri: { 
      baseFace: 92, 
      subs: { 
        agility: { base: 85, w: 0.1 }, 
        balance: { base: 85, w: 0.05 }, 
        reactions: { base: 97, w: 0.05 }, 
        ballControl: { base: 96, w: 0.3 }, 
        dribbling: { base: 90, w: 0.5 }, 
        composure: { base: 97, w: 0 } 
      } 
    }
  };

  const runSim = (faceData: any, boost: number, limit: number) => {
    const targetFace = Math.min(faceData.baseFace + boost, limit);
    const faceDiff = targetFace - faceData.baseFace;
    
    // THIS IS THE FIX:
    const ratio = faceDiff / faceData.baseFace;

    const tieBreaker: Record<string, number> = {};

    Object.keys(faceData.subs).forEach(subKey => {
      const subData = faceData.subs[subKey];
      const exactBoost = subData.base * ratio;
      const appliedBoost = Math.round(exactBoost);
      
      subData.base = Math.min(subData.base + appliedBoost, 99);
      tieBreaker[subKey] = exactBoost - appliedBoost;
    });

    const calculateFace = () => {
      let sum = 0;
      Object.values(faceData.subs).forEach((s: any) => { sum += s.base * s.w; });
      return sum;
    };

    while (Math.round(calculateFace() + 1e-6) < targetFace) {
      const uncappedKeys = Object.keys(faceData.subs).filter(k => faceData.subs[k].base < 99);
      if (uncappedKeys.length === 0) break;

      uncappedKeys.sort((a, b) => tieBreaker[b] - tieBreaker[a]);

      const targetKey = uncappedKeys[0];
      faceData.subs[targetKey].base = Math.min(faceData.subs[targetKey].base + 1, 99);
      tieBreaker[targetKey] -= 1;
    }
  };

  runSim(baseStats.pas, 5, 96);
  runSim(baseStats.dri, 5, 96);

  console.log('--- Passing ---');
  console.log('Vision:', baseStats.pas.subs.vision.base);
  console.log('Crossing:', baseStats.pas.subs.crossing.base);
  console.log('Freekick:', baseStats.pas.subs.freekick.base);
  console.log('ShortPass:', baseStats.pas.subs.shortPass.base);
  console.log('LongPass:', baseStats.pas.subs.longPass.base);
  console.log('Curve:', baseStats.pas.subs.curve.base);

  console.log('--- Dribbling ---');
  console.log('Agility:', baseStats.dri.subs.agility.base);
  console.log('Balance:', baseStats.dri.subs.balance.base);
  console.log('Reactions:', baseStats.dri.subs.reactions.base);
  console.log('BallControl:', baseStats.dri.subs.ballControl.base);
  console.log('Dribbling:', baseStats.dri.subs.dribbling.base);
  console.log('Composure:', baseStats.dri.subs.composure.base);
};

testEngine();
