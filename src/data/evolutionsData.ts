import { EvolutionDefinition, EvolutionPath } from '../types/player';
import { eliteMidfielder1159 } from './evolutions/eliteMidfielder1159';
import { flowState1154 } from './evolutions/flowState1154';
import { unstoppableForce1111 } from './evolutions/unstoppableForce1111';
import { leftBehind1180 } from './evolutions/leftBehind1180';
import { immovableObject1110 } from './evolutions/immovableObject1110';
import { tinyTim1014 } from './evolutions/tinyTim1014';
import { highlandDelivery1080 } from './evolutions/highlandDelivery1080';
import { theMetronome1152 } from './evolutions/theMetronome1152';
import { speedMerchant1160 } from './evolutions/speedMerchant1160';
import { routeOne1153 } from './evolutions/routeOne1153';
import { relentlessRise983 } from './evolutions/relentlessRise983';
import { thePowercube1082 } from './evolutions/thePowercube1082';
import { windUpMerchant1184 } from './evolutions/windUpMerchant1184';
import { signedAndDelivered1191 } from './evolutions/signedAndDelivered1191';
import { culturedCommander1177 } from './evolutions/culturedCommander1177';
import { furiaCeca1081 } from './evolutions/furiaCeca1081';
import { nationalPrideStarPart1_1112 } from './evolutions/nationalPrideStarPart1_1112';
import { nationalPrideStarPart2_1114 } from './evolutions/nationalPrideStarPart2_1114';
import { nationalPride1176 } from './evolutions/nationalPride1176';
import { flairFactory1181 } from './evolutions/flairFactory1181';
import { floorRaiser1182 } from './evolutions/floorRaiser1182';
import { setPieceFC1158 } from './evolutions/setPieceFC1158';
import { threadTheNeedle1157 } from './evolutions/threadTheNeedle1157';
import { dazzlingDribbler1190 } from './evolutions/dazzlingDribbler1190';
import { auraFarming1164 } from './evolutions/auraFarming1164';
import { dynamicDrive1161 } from './evolutions/dynamicDrive1161';
import { thePerfectBreak1195 } from './evolutions/thePerfectBreak1195';
import { futtiesCountdown1151 } from './evolutions/futtiesCountdown1151';
import { futtiesBlueprintI1183 } from './evolutions/futtiesBlueprintI1183';
import { futtiesBlueprintII1194 } from './evolutions/futtiesBlueprintII1194';
import { strikeForceIsBack1155 } from './evolutions/strikeForceIsBack1155';
import { noWayThrough1156 } from './evolutions/noWayThrough1156';

export const availableEvolutions: Record<string, EvolutionDefinition> = {
  '983': relentlessRise983,
  '1014': tinyTim1014,
  '1080': highlandDelivery1080,
  '1081': furiaCeca1081,
  '1082': thePowercube1082,
  '1110': immovableObject1110,
  '1111': unstoppableForce1111,
  '1112': nationalPrideStarPart1_1112,
  '1114': nationalPrideStarPart2_1114,
  '1151': futtiesCountdown1151,
  '1152': theMetronome1152,
  '1153': routeOne1153,
  '1154': flowState1154,
  '1155': strikeForceIsBack1155,
  '1156': noWayThrough1156,
  '1157': threadTheNeedle1157,
  '1158': setPieceFC1158,
  '1159': eliteMidfielder1159,
  '1160': speedMerchant1160,
  '1161': dynamicDrive1161,
  '1164': auraFarming1164,
  '1176': nationalPride1176,
  '1177': culturedCommander1177,
  '1180': leftBehind1180,
  '1181': flairFactory1181,
  '1182': floorRaiser1182,
  '1183': futtiesBlueprintI1183,
  '1184': windUpMerchant1184,
  '1190': dazzlingDribbler1190,
  '1191': signedAndDelivered1191,
  '1194': futtiesBlueprintII1194,
  '1195': thePerfectBreak1195
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
