import { Button } from '@/components/ui/Button'

import styles from './DesignSystem.module.scss'

const cores = [
  { nome: 'Primária', hex: '#6366f1', uso: 'Ações principais e links' },
  { nome: 'Secundária', hex: '#ec4899', uso: 'Destaques' },
  { nome: 'Sucesso', hex: '#10b981', uso: 'Resposta correta' },
  { nome: 'Erro', hex: '#ef4444', uso: 'Resposta errada' },
  { nome: 'Alerta', hex: '#f59e0b', uso: 'Avisos' },
  { nome: 'Info', hex: '#0ea5e9', uso: 'Dicas' },
  { nome: 'Texto', hex: '#0f172a', uso: 'Texto principal' },
  { nome: 'Texto suave', hex: '#64748b', uso: 'Texto de apoio' },
]

export function DesignSystemPage() {
  return (
    <main className={styles.page}>
      <h1>Design System do Cappyo</h1>

      <section>
        <h2>Cores</h2>
        <div className={styles.cores}>
          {cores.map((cor) => (
            <div key={cor.hex}>
              <div className={styles.amostra} style={{ background: cor.hex }} />
              <strong>{cor.nome}</strong>
              <p>{cor.hex} · {cor.uso}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Tipografia</h2>
        <p style={{ fontSize: '2rem', fontWeight: 800 }}>Título - Inter 800</p>
        <p>Texto - Inter 400, 16px</p>
        <code>SELECT nome FROM usuarios; - Fira Code</code>
      </section>

      <section>
        <h2>Botões</h2>
        <div className={styles.linha}>
          <Button>Primário</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="success">Sucesso</Button>
          <Button variant="danger">Perigo</Button>
          <Button variant="outline">Contorno</Button>
          <Button disabled>Desabilitado</Button>
        </div>
      </section>
    </main>
  )
}