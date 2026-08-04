export function getPlayStyleIconUrl(playStyleName: string, isPlus?: boolean): string {
  // Determine if it's a Plus playstyle from the name if the flag isn't provided
  const isGold = isPlus !== undefined ? isPlus : playStyleName.endsWith('+');
  
  // Clean the name: remove '+', spaces, and make lowercase
  let cleanName = playStyleName.replace(/\+/g, '').replace(/\s+/g, '').toLowerCase();
  
  if (cleanName === 'whippedpass') {
    cleanName = 'whippedcrosser';
  }
  
  if (isGold) {
    return `/playstyles/${cleanName}-plus.png`;
  }
  return `/playstyles/${cleanName}.png`;
}
