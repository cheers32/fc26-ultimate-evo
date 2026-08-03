import { playersDatabase } from '../../data/playersData';
import { simulateEvoChain } from '../../utils/evoEngine';

type Truth = { subs: Record<string, Record<string, number>>; faces: Record<string, number>; base: number; igs: number };

function check(name: string, playerId: string, chainIds: string[], t: Truth) {
  const p = playersDatabase[playerId];
  const r = simulateEvoChain(chainIds, p.bio, p.ovr, p.stats, p.playStyles);

  let ourFace = 0, ourIgs = 0;
  const bad: string[] = [];
  Object.keys(r.finalStats).forEach(fk => {
    const f = r.finalStats[fk];
    ourFace += f.baseFace;
    if (t.faces[fk] !== undefined && f.baseFace !== t.faces[fk]) bad.push(`FACE ${fk}: ours=${f.baseFace} truth=${t.faces[fk]}`);
    Object.keys(f.subs).forEach(sk => {
      const ours = f.subs[sk].base;
      ourIgs += ours;
      const tv = t.subs[fk]?.[sk];
      if (tv !== undefined && ours !== tv) bad.push(`${fk}.${sk}: ours=${ours} truth=${tv}`);
    });
  });
  if (ourFace !== t.base) bad.push(`BaseStats: ours=${ourFace} truth=${t.base}`);
  if (ourIgs !== t.igs) bad.push(`IGS: ours=${ourIgs} truth=${t.igs}`);

  console.log(`${bad.length === 0 ? 'PASS' : 'FAIL'}  ${name}   [Base ${ourFace}/${t.base}  IGS ${ourIgs}/${t.igs}]`);
  bad.forEach(b => console.log('        ' + b));
}

const RONALDO_STATIC = {
  pac: { acceleration: 80, sprintSpeed: 83 },
  sho: { positioning: 92, finishing: 91, shotPower: 94, longShots: 87, volleys: 87, penalties: 94 },
  def: { interceptions: 32, headingAcc: 93, defAwareness: 26, standTackle: 35, slideTackle: 26 },
  phy: { jumping: 97, stamina: 81, strength: 84, aggression: 65 }
};
const PETIT_STATIC = {
  pac: { acceleration: 75, sprintSpeed: 78 },
  sho: { positioning: 79, finishing: 69, shotPower: 88, longShots: 88, volleys: 74, penalties: 62 },
  def: { interceptions: 87, headingAcc: 77, defAwareness: 82, standTackle: 88, slideTackle: 84 },
  phy: { jumping: 76, stamina: 90, strength: 86, aggression: 88 }
};

check('Rodri  UF->Flow->EliteMid', 'rodri-91', ['1111', '1154', '1159'], {
  subs: {
    pac: { acceleration: 92, sprintSpeed: 92 },
    sho: { positioning: 86, finishing: 85, shotPower: 99, longShots: 99, volleys: 80, penalties: 71 },
    pas: { vision: 97, crossing: 95, freekick: 96, shortPass: 99, longPass: 99, curve: 98 },
    dri: { agility: 95, balance: 96, reactions: 99, ballControl: 99, dribbling: 97, composure: 99 },
    def: { interceptions: 97, headingAcc: 92, defAwareness: 97, standTackle: 96, slideTackle: 93 },
    phy: { jumping: 93, stamina: 99, strength: 93, aggression: 95 }
  },
  faces: { pac: 92, sho: 90, pas: 98, dri: 98, def: 96, phy: 95 }, base: 569, igs: 2728
});

check('Ronaldo Flow x1', 'ronaldo-19978', ['1154'], {
  subs: { ...RONALDO_STATIC,
    pas: { vision: 84, crossing: 86, freekick: 89, shortPass: 84, longPass: 78, curve: 87 },
    dri: { agility: 83, balance: 78, reactions: 90, ballControl: 92, dribbling: 85, composure: 99 } },
  faces: { pac: 82, sho: 91, pas: 84, dri: 88, def: 37, phy: 80 }, base: 462, igs: 2282
});

check('Ronaldo Flow x2', 'ronaldo-19978', ['1154', '1154'], {
  subs: { ...RONALDO_STATIC,
    pas: { vision: 89, crossing: 91, freekick: 94, shortPass: 89, longPass: 83, curve: 92 },
    dri: { agility: 88, balance: 82, reactions: 95, ballControl: 98, dribbling: 90, composure: 99 } },
  faces: { pac: 82, sho: 91, pas: 89, dri: 93, def: 37, phy: 80 }, base: 472, igs: 2337
});

check('Petit Flow x1', 'petit-87', ['1154'], {
  subs: { ...PETIT_STATIC,
    pas: { vision: 80, crossing: 75, freekick: 73, shortPass: 94, longPass: 87, curve: 75 },
    dri: { agility: 82, balance: 76, reactions: 87, ballControl: 90, dribbling: 75, composure: 91 } },
  faces: { pac: 77, sho: 77, pas: 84, dri: 82, def: 85, phy: 87 }, base: 492, igs: 2356
});

check('Petit Flow x2', 'petit-87', ['1154', '1154'], {
  subs: { ...PETIT_STATIC,
    pas: { vision: 85, crossing: 79, freekick: 77, shortPass: 99, longPass: 92, curve: 79 },
    dri: { agility: 87, balance: 81, reactions: 92, ballControl: 95, dribbling: 80, composure: 97 } },
  faces: { pac: 77, sho: 77, pas: 89, dri: 87, def: 85, phy: 87 }, base: 502, igs: 2414
});

check('Petit Flow x3', 'petit-87', ['1154', '1154', '1154'], {
  subs: { ...PETIT_STATIC,
    pas: { vision: 92, crossing: 86, freekick: 84, shortPass: 99, longPass: 99, curve: 85 },
    dri: { agility: 92, balance: 86, reactions: 97, ballControl: 99, dribbling: 86, composure: 99 } },
  faces: { pac: 77, sho: 77, pas: 94, dri: 92, def: 85, phy: 87 }, base: 512, igs: 2475
});
