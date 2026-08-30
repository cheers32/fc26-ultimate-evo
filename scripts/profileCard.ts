/** What a finished card is, by its numbers — the judging path, not the planning one. */
import { profileCard, describeProfile } from '../src/utils/cardProfile';

const cards: { name: string; positions: string[]; height: number; subs: Record<string, number> }[] = [
  {
    name: 'Matthäus (yours)', positions: ['CM', 'CB', 'CDM'], height: 174,
    subs: { acceleration: 98, sprintSpeed: 98, positioning: 90, finishing: 86, shotPower: 97, longShots: 96, volleys: 90, penalties: 95, vision: 97, crossing: 93, freekick: 95, shortPass: 99, longPass: 99, curve: 96, agility: 95, balance: 98, reactions: 97, ballControl: 95, dribbling: 95, composure: 97, interceptions: 99, headingAcc: 98, defAwareness: 98, standTackle: 99, slideTackle: 98, jumping: 96, stamina: 99, strength: 96, aggression: 99 }
  },
  {
    name: 'Vieira A', positions: ['CM', 'CDM'], height: 192,
    subs: { acceleration: 99, sprintSpeed: 99, positioning: 96, finishing: 95, shotPower: 96, longShots: 96, volleys: 69, penalties: 94, vision: 99, crossing: 87, freekick: 99, shortPass: 99, longPass: 99, curve: 99, agility: 95, balance: 95, reactions: 97, ballControl: 98, dribbling: 97, composure: 97, interceptions: 99, headingAcc: 99, defAwareness: 99, standTackle: 99, slideTackle: 99, jumping: 99, stamina: 99, strength: 99, aggression: 99 }
  },
  {
    name: 'Vieira B', positions: ['CM', 'CDM'], height: 192,
    subs: { acceleration: 98, sprintSpeed: 98, positioning: 97, finishing: 97, shotPower: 99, longShots: 97, volleys: 67, penalties: 92, vision: 99, crossing: 77, freekick: 99, shortPass: 99, longPass: 99, curve: 99, agility: 93, balance: 93, reactions: 99, ballControl: 97, dribbling: 96, composure: 99, interceptions: 99, headingAcc: 99, defAwareness: 99, standTackle: 99, slideTackle: 99, jumping: 99, stamina: 98, strength: 99, aggression: 99 }
  }
];

for (const c of cards) {
  const p = profileCard(c.subs, c.positions, c.height);
  console.log(`${c.name} · ${c.positions.join('/')} · ${c.height}cm`);
  console.log(`  → ${describeProfile(p)}`);
  for (const f of p.fits.slice(0, 5)) {
    const why = f.archetype === 'reads' ? 'reads it bare'
      : f.archetype === 'with-style' ? 'with a chem style'
      : f.archetype === 'frame' ? `frame rules out ${f.template.archetype}`
      : `stats short of ${f.template.archetype}`;
    console.log(`     ${f.template.name.padEnd(22)} +${f.score.toFixed(1).padStart(4)}  ${why}${f.under.length ? ' · under ' + f.under.map(u => `${u.key} ${u.value}/${u.floor}`).join(', ') : ''}`);
  }
  console.log('');
}
