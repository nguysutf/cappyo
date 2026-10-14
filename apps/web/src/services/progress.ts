const KEY = 'cappyo:concluidas'

export function getConcluidas(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export function marcarConcluida(lessonId: string) {
  const concluidas = getConcluidas()

  if(!concluidas.includes(lessonId)) {
    localStorage.setItem(KEY, JSON.stringify([...concluidas, lessonId]))
  }
}