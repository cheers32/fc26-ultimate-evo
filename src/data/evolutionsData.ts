import { EvolutionDefinition, EvolutionPath } from '../types/player';
import { eliteMidfielder1159 } from './evolutions/eliteMidfielder1159';
import { flowState1154 } from './evolutions/flowState1154';
import { unstoppableForce1111 } from './evolutions/unstoppableForce1111';
import { leftBehind1180 } from './evolutions/leftBehind1180';
import { immovableObject1110 } from './evolutions/immovableObject1110';
import { tinyTim1014 } from './evolutions/tinyTim1014';
import { highlandDelivery1080 } from './evolutions/highlandDelivery1080';

export const availableEvolutions: Record<string, EvolutionDefinition> = {
  '1110': immovableObject1110,
  '1111': unstoppableForce1111,
  '1154': flowState1154,
  '1159': eliteMidfielder1159,
  '1180': leftBehind1180,
  '1014': tinyTim1014,
  '1080': highlandDelivery1080
};

export const defaultEvolutionPaths: EvolutionPath[] = [
  {
    id: 'path-single-elite',
    name: 'Elite Midfielder (Single EVO)',
    description: 'Transform a base card into an elite dominant force.',
    isRecommended: true,
    chainIds: ['1159']
  }
];
