export interface SkillLayoutBlock { name: string; cooldown: string; description: string; maxWidth: number; y: number }
export interface CharacterSelectLayout { panel: { x: number; y: number; width: number; height: number }; contentWidth: number; fontSize: number; skillBlocks: SkillLayoutBlock[]; startButton: { x: number; y: number; width: number; height: number } }
export function computeCharacterSelectLayout(width: number, height: number, skills: Array<{ displayName: string; cooldownMs: number; description: string }>): CharacterSelectLayout {
  const margin = Math.max(18, Math.min(42, width * .04));
  const panelWidth = Math.min(760, width - margin * 2);
  const panelHeight = Math.min(560, height - margin * 2);
  const contentWidth = panelWidth - 56;
  const fontSize = width < 700 ? 14 : 16;
  const top = (height - panelHeight) / 2;
  const skillStart = top + (height < 760 ? 218 : 250);
  const gap = height < 760 ? 58 : 68;
  return { panel: { x: width / 2, y: height / 2, width: panelWidth, height: panelHeight }, contentWidth, fontSize, skillBlocks: skills.map((s, i) => ({ name: s.displayName, cooldown: `${Math.round(s.cooldownMs / 1000)}s`, description: s.description, maxWidth: contentWidth, y: skillStart + i * gap })), startButton: { x: width / 2 - 94, y: Math.min(top + panelHeight - 70, height - margin - 54), width: 188, height: 46 } };
}
