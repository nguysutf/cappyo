# Cappyo

Plataforma gamificada para aprender SQL praticando em um SQLite compilado para WebAssembly.

## Desenvolvimento com Supabase hospedado

Pré-requisitos: Node.js, Yarn e um projeto criado no [Supabase](https://supabase.com/dashboard).

No painel do projeto, copie a URL e a chave pública `anon` em **Project Settings → API** e preencha `apps/web/.env.local`:

```bash
cp .env.example apps/web/.env.local
yarn install
yarn workspace @cappyo/web dev
```

O frontend usa diretamente a instância hospedada configurada nas variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`. O Vite aceita o arquivo em `apps/web/.env.local` ou na raiz do monorepo. Não é necessário Docker nem uma instância local.

### Aplicar o banco remoto

As tabelas, políticas RLS e triggers ficam em `supabase/migrations/`. Para aplicá-las pelo CLI, faça login e vincule o projeto:

```bash
yarn supabase login
yarn supabase link --project-ref SEU_PROJECT_REF
yarn supabase:push
```

Depois, execute `supabase/seed.sql` no **SQL Editor** do projeto para criar a trilha e os exercícios iniciais.

Se preferir, tanto a migration quanto o seed podem ser executados pelo SQL Editor do painel.

O seed é idempotente e pode ser executado novamente com segurança.

Se o Supabase não estiver configurado, o frontend segue funcionando em modo convidado com persistência local e usa o mesmo motor SQLite WASM para as consultas, mas login e sincronização remota ficam desativados.
