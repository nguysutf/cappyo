const KEY = 'cappyo:xp'

export const XP_POR_ACERTO = 10
export const XP_POR_NIVEL = 100
export const VIDAS_POR_LICAO = 5

export function getXp(): number {
  return Number(localStorage.getItem(KEY) ?? 0)
}

export function ganharXp(quantidade: number) {
  localStorage.setItem(KEY, String(getXp() + quantidade))
}

export function getNivel(xp: number): number {
  return Math.floor(xp / XP_POR_NIVEL) + 1
}