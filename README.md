<div align="center">

![React](https://img.shields.io/badge/react-19-61dafb)
![TypeScript](https://img.shields.io/badge/typescript-5-3178c6)
![Supabase](https://img.shields.io/badge/supabase-postgres-3ecf8e)
![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-orange)

</div>

<h1 align="center">
  <img src="apps/web/public/favicon.png" alt="Cappyo" width="200">
</h1>

<h4 align="center">Cappyo: Recurso Educacional Aberto para aprender SQL jogando</h4>

<p align="center">
  <a href="https://github.com/nguysutf/cappyo">Home</a> •
  <a href="#funcionalidades">Funcionalidades</a> •
  <a href="#dependências">Dependências</a> •
  <a href="#instalação">Instalação</a> •
  <a href="#como-usar">Como usar</a>
</p>

<h1 align="center"></h1>

## Resumo

O Cappyo é um Recurso Educacional Aberto (REA) para o ensino introdutório de
Structured Query Language (SQL). A proposta é apresentar conceitos de banco de
dados de forma simples, progressiva e lúdica, para que pessoas sem experiência
prévia na área consigam entender os conceitos e escrever comandos SQL desde o
primeiro acesso.

O conteúdo segue o tripé do REA: textos teóricos dentro da plataforma,
videoaulas com legenda e o código-fonte aberto neste repositório. Ele está
organizado em cinco módulos — SQL Básico, Manipulação de Dados, WHERE Avançado,
Gerenciamento de Tabelas e JOIN — e cada módulo combina teoria, videoaula e uma
trilha de exercícios.

Os exercícios rodam um banco SQLite real, compilado para WebAssembly, direto no
navegador. A correção é automática: a consulta do aluno e o gabarito são
executados no mesmo banco e os resultados são comparados. A experiência é
gamificada com XP, níveis, vidas, sequência de dias e meta diária, e o progresso
pode ser salvo em uma conta (Supabase) ou apenas no navegador.

Projeto desenvolvido na disciplina Certificadora de Competência Comum da
Universidade Tecnológica Federal do Paraná (UTFPR).

## Autores

* Caelayne Aparecida Ribeiro Soares, Iandê de Freitas Richalski, João Vitor de Oliveira Pinho, Luiz Felipe Fernandes Ramos e Pedro Lucas Sales Larini.

## Funcionalidades

- **Trilha progressiva:** 5 módulos com lições liberadas em sequência.
- **Teoria por módulo:** textos curtos com exemplos de SQL executáveis, dicas e resumo.
- **5 tipos de exercício:** alternativas, completar texto, completar código, ordenar trechos de código e escrever consultas completas.
- **Correção automática:** compara o resultado da consulta do aluno com o do gabarito, aceitando formas diferentes de chegar à mesma resposta.
- **Laboratório de SQL:** ambiente livre com três bancos de exemplo (Loja, Biblioteca e Escola).
- **Videoaulas:** uma por módulo, com legenda ativada por padrão.
- **Gamificação:** XP, níveis, vidas por lição, sequência de dias e meta diária.
- **Conta e progresso:** cadastro com e-mail e senha; sem conta, o progresso fica no navegador.
- **Acessibilidade:** navegação por teclado, descrições para leitores de tela, layout responsivo e widget de acessibilidade.

## Dependências

- Node.js (>= 20.19.0)
- Yarn 1 (via `corepack`)
- React 19 e React Router
- TypeScript
- Vite
- SCSS Modules
- sql.js (SQLite em WebAssembly)
- Monaco Editor
- Supabase (opcional: autenticação e persistência)

## Instalação

Considera-se que o Node.js já está instalado. Caso contrário, acesse [nodejs.org](https://nodejs.org/).

```sh
$ git clone https://github.com/nguysutf/cappyo.git

$ cd cappyo

$ corepack enable          # opcional; sem ele, use "corepack yarn" nos comandos

$ corepack yarn install
```

## Executar a aplicação

```sh
$ cd apps/web

$ corepack yarn dev
```

A aplicação fica disponível em `http://localhost:5173`.

Outros comandos, dentro de `apps/web`:

| Comando | Descrição |
| --- | --- |
| `corepack yarn build` | Verifica os tipos e gera a versão de produção em `dist/` |
| `corepack yarn preview` | Serve a versão de produção localmente |
| `corepack yarn lint` | Executa o ESLint |

### Modo convidado

Sem as chaves do Supabase, a aplicação funciona em modo convidado: todas as
páginas e exercícios ficam disponíveis, o conteúdo vem do próprio código e o
progresso é salvo no navegador. Apenas o login fica desativado.

### Configurar o Supabase

1. No painel do projeto no [Supabase](https://supabase.com/dashboard), copie a URL e a chave pública `anon` em **Project Settings → API**.
2. Crie o arquivo de variáveis e preencha os valores:

```sh
$ cp .env.example apps/web/.env.local
```

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

3. Aplique as tabelas, políticas RLS e triggers de `supabase/migrations/`:

```sh
$ corepack yarn supabase login
$ corepack yarn supabase link --project-ref SEU_PROJECT_REF
$ corepack yarn supabase:push
```

4. Execute `supabase/seed.sql` no **SQL Editor** do painel para criar a trilha e os exercícios. O seed é idempotente e pode ser executado novamente com segurança.

O arquivo `.env.local` não é versionado.

## Como usar

O Cappyo é organizado em páginas acessíveis pelo menu superior.

**Minha trilha** mostra os cinco módulos e suas lições. Cada lição é liberada
depois da anterior; lições ainda sem conteúdo aparecem como "em breve". Em cada
módulo há atalhos para a teoria e para a videoaula.

**Teoria** apresenta o conteúdo do módulo em seções curtas. Os exemplos de SQL
são executados de verdade e o resultado aparece logo abaixo de cada um. Ao
final, um resumo e o botão para os exercícios.

**Lição** apresenta os exercícios em sequência. O aluno começa com cinco vidas
e perde uma a cada erro. Cada acerto vale 10 XP, com bônus de 20 XP ao acertar
todos os exercícios. Nos exercícios de escrita, a consulta pode ser executada
com o botão ou com `Ctrl + Enter` antes de verificar.

**Cursos** reúne as videoaulas dos cinco módulos, com legenda.

**Laboratório** permite escrever e executar qualquer comando SQL em um dos
bancos de exemplo, sem nota e sem vidas. Alterações como `INSERT` e
`CREATE TABLE` permanecem até o banco ser restaurado, e a lista de tabelas é
atualizada a cada comando.

**Progresso** exibe nível, XP, meta diária, sequência de dias e lições
concluídas por módulo.

## Licença

Distribuído sob a licença MIT.