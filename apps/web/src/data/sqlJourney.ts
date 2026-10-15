export interface Lesson {
  id: string
  title: string
  available: boolean
}

export interface Module {
  id: string
  title: string
  description: string
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'info'
  lessons: Lesson[]
}

export const sqlJourney: Module[] = [
  {
    id: 'sql-basico',
    title: 'SQL Básico',
    description: 'O que é um banco de dados, tabelas e o seu primeiro SELECT.',
    color: 'primary',
    lessons: [
      { id: 'sql-intro-01', title: 'Comandos básicos', available: true },
      { id: 'sql-intro-02', title: 'Selecionando colunas', available: false },
      { id: 'sql-intro-03', title: 'Ordenando resultados', available: false },
    ],
  },
  {
    id: 'manipulacao',
    title: 'Manipulação de Dados',
    description: 'Inserir, atualizar e remover registros.',
    color: 'success',
    lessons: [
      { id: 'dml-01', title: 'INSERT', available: false },
      { id: 'dml-02', title: 'UPDATE', available: false },
      { id: 'dml-03', title: 'DELETE', available: false },
    ],
  },
  {
    id: 'where-avancado',
    title: 'WHERE Avançado',
    description: 'Filtros com AND, OR, IN, BETWEEN, LIKE e NULL.',
    color: 'warning',
    lessons: [
      { id: 'where-01', title: 'AND, OR e NOT', available: false },
      { id: 'where-02', title: 'IN e BETWEEN', available: false },
      { id: 'where-03', title: 'LIKE e IS NULL', available: false },
    ],
  },
  {
    id: 'tabelas',
    title: 'Gerenciamento de Tabelas',
    description: 'Criar e alterar tabelas, tipos de dados e chaves.',
    color: 'info',
    lessons: [
      { id: 'ddl-01', title: 'CREATE TABLE', available: false },
      { id: 'ddl-02', title: 'Chaves primárias', available: false },
      { id: 'ddl-03', title: 'ALTER e DROP', available: false },
    ],
  },
  {
    id: 'join',
    title: 'JOIN',
    description: 'Combinar dados de várias tabelas.',
    color: 'secondary',
    lessons: [
      { id: 'join-01', title: 'INNER JOIN', available: false },
      { id: 'join-02', title: 'LEFT JOIN', available: false },
      { id: 'join-03', title: 'Desafio final', available: false },
    ],
  },
]