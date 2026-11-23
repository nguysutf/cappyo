export const XP_POR_NIVEL = 100
export const VIDAS_POR_LICAO = 5

export function getNivel(xp: number): number {
  return Math.floor(xp / XP_POR_NIVEL) + 1
}