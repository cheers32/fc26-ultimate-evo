// Master list of all FC 26 PlayStyles, derived from evolution data and icon files.
// Each entry maps a display name to the icon filename (without extension).
// If iconFile is null, the icon is missing and a text fallback should be used.

export const FC26_PLAYSTYLES: { name: string; iconFile: string | null }[] = [
  // Shooting
  { name: 'Finesse Shot', iconFile: 'finesseshot' },
  { name: 'Power Shot', iconFile: 'powershot' },
  { name: 'Low Driven Shot', iconFile: 'lowdrivenshot' },
  { name: 'Chip Shot', iconFile: 'chipshot' },
  // Passing
  { name: 'Pinged Pass', iconFile: 'pingedpass' },
  { name: 'Incisive Pass', iconFile: 'incisivepass' },
  { name: 'Long Ball Pass', iconFile: 'longballpass' },
  { name: 'Tiki Taka', iconFile: 'tikitaka' },
  { name: 'Whipped Pass', iconFile: 'whippedcrosser' },
  { name: 'Dead Ball', iconFile: 'deadball' },
  { name: 'Inventive', iconFile: 'inventive' },
  // Dribbling
  { name: 'First Touch', iconFile: 'firsttouch' },
  { name: 'Trickster', iconFile: 'trickster' },
  { name: 'Technical', iconFile: 'technical' },
  { name: 'Quick Step', iconFile: 'quickstep' },
  { name: 'Rapid', iconFile: 'rapid' },
  { name: 'Footwork', iconFile: null },
  { name: 'Gamechanger', iconFile: 'gamechanger' },
  // Defending
  { name: 'Intercept', iconFile: 'intercept' },
  { name: 'Anticipate', iconFile: 'anticipate' },
  { name: 'Slide Tackle', iconFile: 'slidetackle' },
  { name: 'Jockey', iconFile: 'jockey' },
  { name: 'Block', iconFile: 'block' },
  { name: 'Bruiser', iconFile: 'bruiser' },
  { name: 'Enforcer', iconFile: 'enforcer' },
  // Physical / Other
  { name: 'Press Proven', iconFile: 'pressproven' },
  { name: 'Relentless', iconFile: 'relentless' },
  { name: 'Acrobatic', iconFile: 'acrobatic' },
  { name: 'Aerial Fortress', iconFile: 'aerialfortress' },
  { name: 'Precision Header', iconFile: 'precisionheader' },
  { name: 'Far Reach', iconFile: null },
  // GK
  { name: 'Rush Out', iconFile: null },
  { name: 'Cross Claimer', iconFile: null },
  { name: 'Deflector', iconFile: null },
  { name: 'Far Throw', iconFile: null },
  { name: 'Long Throw', iconFile: 'longthrow' },
];

export function getPlayStyleIconUrl(playStyleName: string, isPlus?: boolean): string {
  // Determine if it's a Plus playstyle from the name if the flag isn't provided
  const isGold = isPlus !== undefined ? isPlus : playStyleName.endsWith('+');

  // Clean the name: remove '+' and trim
  const cleanName = playStyleName.replace(/\+/g, '').trim();

  // Look up in master list
  const entry = FC26_PLAYSTYLES.find(ps => ps.name === cleanName);
  // Fall back to a generated filename if no entry or no icon file
  const iconFile = entry?.iconFile || cleanName.replace(/\s+/g, '').toLowerCase();

  if (isGold) {
    return `/playstyles/${iconFile}-plus.png`;
  }
  return `/playstyles/${iconFile}.png`;
}
