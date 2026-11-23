import { ArrowLeft, CheckCircle2, Database, LogOut, ShieldCheck, Sparkles } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { getCurrentUser, signIn, signOut, signUp } from '@/services/auth'
import { isSupabaseConfigured } from '@/services/supabase'

import styles from './auth.module.scss'

export function AuthPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    void getCurrentUser().then((user) => setUserEmail(user?.email ?? null))
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsSubmitting(true)

    const result = mode === 'signin'
      ? await signIn({ email, password })
      : await signUp({ email, password, displayName })

    setIsSubmitting(false)

    if(result.error) {
      setError(result.error)
      return
    }

    if(mode === 'signup') {
      setMessage('Conta criada. Você já pode começar a sua primeira missão.')
      setMode('signin')
      return
    }

    navigate('/journeys/sql')
  }

  async function handleSignOut() {
    await signOut()
    setUserEmail(null)
    setMessage('Você saiu da sua conta.')
  }

  return (
    <main className={styles.page}>
      <Link to="/journeys/sql" className={styles.backLink}><ArrowLeft size={17} /> Voltar para a trilha</Link>
      <section className={styles.shell}>
        <div className={styles.brandPanel}>
          <div className={styles.logo}><Database size={22} /></div>
          <p className={styles.overline}>SEU ESPAÇO DE APRENDIZADO</p>
          <h1>Todo dia é uma nova query.</h1>
          <p>Salve seu progresso, mantenha sua sequência e transforme prática em domínio.</p>
          <div className={styles.perks}>
            <span><CheckCircle2 size={17} /> Progresso sincronizado</span>
            <span><Sparkles size={17} /> XP e conquistas</span>
            <span><ShieldCheck size={17} /> Dados protegidos pelo Supabase</span>
          </div>
        </div>

        <div className={styles.formPanel}>
          {userEmail ? (
            <div className={styles.loggedIn}>
              <p className={styles.overline}>CONTA ATIVA</p>
              <h2>Olá, {userEmail.split('@')[0]}!</h2>
              <p>Seu progresso está pronto para continuar em qualquer dispositivo conectado ao mesmo projeto.</p>
              <button type="button" className={styles.secondaryButton} onClick={handleSignOut}><LogOut size={17} /> Sair da conta</button>
              <Link to="/journeys/sql" className={styles.primaryButton}>Continuar aprendendo</Link>
            </div>
          ) : (
            <>
              <div className={styles.formHeader}>
                <p className={styles.overline}>{mode === 'signin' ? 'BEM-VINDO DE VOLTA' : 'COMECE AGORA'}</p>
                <h2>{mode === 'signin' ? 'Entrar no Cappyo' : 'Criar sua conta'}</h2>
                <p>{isSupabaseConfigured ? 'Use sua conta para sincronizar seu progresso.' : 'Modo convidado ativo. Configure o Supabase remoto para persistir na nuvem.'}</p>
              </div>

              {!isSupabaseConfigured && <div className={styles.localNotice}><Database size={16} /> Supabase remoto não configurado — a trilha continua disponível em modo convidado.</div>}

              <form onSubmit={handleSubmit} className={styles.form}>
                {mode === 'signup' && <label>Nome<input required value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Como quer ser chamado?" /></label>}
                <label>E-mail<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@email.com" /></label>
                <label>Senha<input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="No mínimo 6 caracteres" /></label>
                {error && <p className={styles.error}>{error}</p>}
                {message && <p className={styles.success}>{message}</p>}
                <button type="submit" className={styles.primaryButton} disabled={isSubmitting || !isSupabaseConfigured}>{isSubmitting ? 'Aguarde...' : mode === 'signin' ? 'Entrar' : 'Criar conta'}</button>
              </form>

              <button type="button" className={styles.modeButton} onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setMessage('') }}>
                {mode === 'signin' ? 'Ainda não tenho uma conta' : 'Já tenho uma conta'}
              </button>
              <Link to="/journeys/sql" className={styles.guestLink}>Continuar sem conta</Link>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
