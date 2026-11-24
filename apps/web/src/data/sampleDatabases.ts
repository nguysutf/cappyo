import type { DatabaseSchema } from '@/types/database'

export interface SampleDatabase {
  id: string
  name: string
  description: string
  schema: DatabaseSchema
  examples: { label: string; sql: string }[]
}

const loja: SampleDatabase = {
  id: 'loja',
  name: 'Loja',
  description: 'Clientes, produtos e pedidos de uma loja online.',
  schema: {
    tables: [
      {
        name: 'clientes',
        description: 'Pessoas cadastradas na loja.',
        columns: [
          { name: 'id', type: 'INTEGER', primaryKey: true },
          { name: 'nome', type: 'TEXT' },
          { name: 'email', type: 'TEXT' },
          { name: 'cidade', type: 'TEXT' },
          { name: 'ativo', type: 'BOOLEAN' },
        ],
        rows: [
          { id: 1, nome: 'Ana Souza', email: 'ana@email.com', cidade: 'Curitiba', ativo: true },
          { id: 2, nome: 'Bruno Lima', email: 'bruno@email.com', cidade: 'São Paulo', ativo: true },
          { id: 3, nome: 'Carla Dias', email: 'carla@email.com', cidade: 'Curitiba', ativo: false },
          { id: 4, nome: 'Diego Alves', email: null, cidade: 'Santos', ativo: true },
          { id: 5, nome: 'Elisa Rocha', email: 'elisa@email.com', cidade: 'São Paulo', ativo: true },
        ],
      },
      {
        name: 'produtos',
        description: 'Itens à venda.',
        columns: [
          { name: 'id', type: 'INTEGER', primaryKey: true },
          { name: 'nome', type: 'TEXT' },
          { name: 'categoria', type: 'TEXT' },
          { name: 'preco', type: 'DECIMAL' },
          { name: 'estoque', type: 'INTEGER' },
        ],
        rows: [
          { id: 1, nome: 'Caderno', categoria: 'Papelaria', preco: 18.9, estoque: 40 },
          { id: 2, nome: 'Caneta azul', categoria: 'Papelaria', preco: 2.5, estoque: 200 },
          { id: 3, nome: 'Mochila', categoria: 'Acessórios', preco: 129.9, estoque: 8 },
          { id: 4, nome: 'Fone de ouvido', categoria: 'Eletrônicos', preco: 89.0, estoque: 0 },
          { id: 5, nome: 'Garrafa térmica', categoria: 'Acessórios', preco: 54.5, estoque: 15 },
          { id: 6, nome: 'Mouse', categoria: 'Eletrônicos', preco: 45.0, estoque: 22 },
        ],
      },
      {
        name: 'pedidos',
        description: 'Compras feitas pelos clientes.',
        columns: [
          { name: 'id', type: 'INTEGER', primaryKey: true },
          { name: 'cliente_id', type: 'INTEGER', foreignKey: { table: 'clientes', column: 'id' } },
          { name: 'produto_id', type: 'INTEGER', foreignKey: { table: 'produtos', column: 'id' } },
          { name: 'quantidade', type: 'INTEGER' },
          { name: 'data', type: 'TEXT' },
        ],
        rows: [
          { id: 1, cliente_id: 1, produto_id: 1, quantidade: 2, data: '2026-10-02' },
          { id: 2, cliente_id: 1, produto_id: 2, quantidade: 10, data: '2026-10-02' },
          { id: 3, cliente_id: 2, produto_id: 3, quantidade: 1, data: '2026-10-15' },
          { id: 4, cliente_id: 4, produto_id: 6, quantidade: 1, data: '2026-11-01' },
          { id: 5, cliente_id: 5, produto_id: 5, quantidade: 2, data: '2026-11-03' },
          { id: 6, cliente_id: 2, produto_id: 1, quantidade: 3, data: '2026-11-10' },
        ],
      },
    ],
  },
  examples: [
    { label: 'Ver clientes', sql: 'SELECT * FROM clientes;' },
    { label: 'Filtrar', sql: 'SELECT nome, cidade FROM clientes WHERE cidade = \'Curitiba\';' },
    { label: 'Ordenar', sql: 'SELECT nome, preco FROM produtos ORDER BY preco DESC;' },
    { label: 'Inserir', sql: 'INSERT INTO clientes (id, nome, email, cidade, ativo)\nVALUES (6, \'Fábio Nunes\', \'fabio@email.com\', \'Guarujá\', true);' },
    { label: 'Atualizar', sql: 'UPDATE produtos SET estoque = 30 WHERE id = 4;' },
    { label: 'JOIN', sql: 'SELECT clientes.nome, produtos.nome AS produto, pedidos.quantidade\nFROM pedidos\nINNER JOIN clientes ON clientes.id = pedidos.cliente_id\nINNER JOIN produtos ON produtos.id = pedidos.produto_id;' },
  ],
}

const biblioteca: SampleDatabase = {
  id: 'biblioteca',
  name: 'Biblioteca',
  description: 'Livros, autores e empréstimos de uma biblioteca.',
  schema: {
    tables: [
      {
        name: 'autores',
        description: 'Quem escreveu os livros.',
        columns: [
          { name: 'id', type: 'INTEGER', primaryKey: true },
          { name: 'nome', type: 'TEXT' },
          { name: 'pais', type: 'TEXT' },
        ],
        rows: [
          { id: 1, nome: 'Machado de Assis', pais: 'Brasil' },
          { id: 2, nome: 'Clarice Lispector', pais: 'Brasil' },
          { id: 3, nome: 'J. R. R. Tolkien', pais: 'Reino Unido' },
          { id: 4, nome: 'Isabel Allende', pais: 'Chile' },
        ],
      },
      {
        name: 'livros',
        description: 'O acervo da biblioteca.',
        columns: [
          { name: 'id', type: 'INTEGER', primaryKey: true },
          { name: 'titulo', type: 'TEXT' },
          { name: 'autor_id', type: 'INTEGER', foreignKey: { table: 'autores', column: 'id' } },
          { name: 'ano', type: 'INTEGER' },
          { name: 'genero', type: 'TEXT' },
          { name: 'disponivel', type: 'BOOLEAN' },
        ],
        rows: [
          { id: 1, titulo: 'Dom Casmurro', autor_id: 1, ano: 1899, genero: 'Romance', disponivel: true },
          { id: 2, titulo: 'Memórias Póstumas de Brás Cubas', autor_id: 1, ano: 1881, genero: 'Romance', disponivel: false },
          { id: 3, titulo: 'A Hora da Estrela', autor_id: 2, ano: 1977, genero: 'Romance', disponivel: true },
          { id: 4, titulo: 'O Hobbit', autor_id: 3, ano: 1937, genero: 'Fantasia', disponivel: true },
          { id: 5, titulo: 'O Senhor dos Anéis', autor_id: 3, ano: 1954, genero: 'Fantasia', disponivel: false },
          { id: 6, titulo: 'A Casa dos Espíritos', autor_id: 4, ano: 1982, genero: 'Romance', disponivel: true },
          { id: 7, titulo: 'Contos Avulsos', autor_id: null, ano: 2001, genero: 'Contos', disponivel: true },
        ],
      },
      {
        name: 'emprestimos',
        description: 'Livros emprestados para leitores.',
        columns: [
          { name: 'id', type: 'INTEGER', primaryKey: true },
          { name: 'livro_id', type: 'INTEGER', foreignKey: { table: 'livros', column: 'id' } },
          { name: 'leitor', type: 'TEXT' },
          { name: 'data_emprestimo', type: 'TEXT' },
          { name: 'data_devolucao', type: 'TEXT' },
        ],
        rows: [
          { id: 1, livro_id: 2, leitor: 'Marina', data_emprestimo: '2026-11-01', data_devolucao: null },
          { id: 2, livro_id: 5, leitor: 'Rafael', data_emprestimo: '2026-11-05', data_devolucao: null },
          { id: 3, livro_id: 1, leitor: 'Marina', data_emprestimo: '2026-09-10', data_devolucao: '2026-09-24' },
          { id: 4, livro_id: 4, leitor: 'Paula', data_emprestimo: '2026-10-02', data_devolucao: '2026-10-20' },
        ],
      },
    ],
  },
  examples: [
    { label: 'Ver livros', sql: 'SELECT * FROM livros;' },
    { label: 'Disponíveis', sql: 'SELECT titulo, ano FROM livros WHERE disponivel = true;' },
    { label: 'LIKE', sql: 'SELECT titulo FROM livros WHERE titulo LIKE \'O %\';' },
    { label: 'IS NULL', sql: 'SELECT leitor, data_emprestimo FROM emprestimos WHERE data_devolucao IS NULL;' },
    { label: 'LEFT JOIN', sql: 'SELECT livros.titulo, autores.nome AS autor\nFROM livros\nLEFT JOIN autores ON autores.id = livros.autor_id;' },
    { label: 'Criar tabela', sql: 'CREATE TABLE leitores (\n  id INTEGER PRIMARY KEY,\n  nome TEXT NOT NULL,\n  telefone TEXT\n);' },
  ],
}

const escola: SampleDatabase = {
  id: 'escola',
  name: 'Escola',
  description: 'Alunos, turmas e notas de uma escola.',
  schema: {
    tables: [
      {
        name: 'turmas',
        description: 'As turmas da escola.',
        columns: [
          { name: 'id', type: 'INTEGER', primaryKey: true },
          { name: 'nome', type: 'TEXT' },
          { name: 'turno', type: 'TEXT' },
        ],
        rows: [
          { id: 1, nome: '1º A', turno: 'Manhã' },
          { id: 2, nome: '1º B', turno: 'Tarde' },
          { id: 3, nome: '2º A', turno: 'Manhã' },
        ],
      },
      {
        name: 'alunos',
        description: 'Estudantes matriculados.',
        columns: [
          { name: 'id', type: 'INTEGER', primaryKey: true },
          { name: 'nome', type: 'TEXT' },
          { name: 'idade', type: 'INTEGER' },
          { name: 'turma_id', type: 'INTEGER', foreignKey: { table: 'turmas', column: 'id' } },
        ],
        rows: [
          { id: 1, nome: 'Lucas', idade: 15, turma_id: 1 },
          { id: 2, nome: 'Beatriz', idade: 16, turma_id: 1 },
          { id: 3, nome: 'Pedro', idade: 15, turma_id: 2 },
          { id: 4, nome: 'Júlia', idade: 17, turma_id: 3 },
          { id: 5, nome: 'Gabriel', idade: 16, turma_id: 3 },
          { id: 6, nome: 'Sofia', idade: 15, turma_id: null },
        ],
      },
      {
        name: 'notas',
        description: 'Notas por disciplina.',
        columns: [
          { name: 'id', type: 'INTEGER', primaryKey: true },
          { name: 'aluno_id', type: 'INTEGER', foreignKey: { table: 'alunos', column: 'id' } },
          { name: 'disciplina', type: 'TEXT' },
          { name: 'nota', type: 'DECIMAL' },
        ],
        rows: [
          { id: 1, aluno_id: 1, disciplina: 'Matemática', nota: 8.5 },
          { id: 2, aluno_id: 1, disciplina: 'Português', nota: 7.0 },
          { id: 3, aluno_id: 2, disciplina: 'Matemática', nota: 9.5 },
          { id: 4, aluno_id: 3, disciplina: 'Matemática', nota: 5.5 },
          { id: 5, aluno_id: 4, disciplina: 'Português', nota: 10.0 },
          { id: 6, aluno_id: 5, disciplina: 'Matemática', nota: 6.0 },
        ],
      },
    ],
  },
  examples: [
    { label: 'Ver alunos', sql: 'SELECT * FROM alunos;' },
    { label: 'BETWEEN', sql: 'SELECT nome, idade FROM alunos WHERE idade BETWEEN 15 AND 16;' },
    { label: 'IN', sql: 'SELECT aluno_id, nota FROM notas WHERE disciplina IN (\'Matemática\', \'Português\');' },
    { label: 'AND / OR', sql: 'SELECT * FROM notas WHERE disciplina = \'Matemática\' AND nota >= 7;' },
    { label: 'Apagar', sql: 'DELETE FROM notas WHERE nota < 6;' },
    { label: 'JOIN', sql: 'SELECT alunos.nome, turmas.nome AS turma, turmas.turno\nFROM alunos\nINNER JOIN turmas ON turmas.id = alunos.turma_id;' },
  ],
}

export const sampleDatabases: SampleDatabase[] = [loja, biblioteca, escola]

export function getSampleDatabase(id: string): SampleDatabase {
  return sampleDatabases.find((db) => db.id === id) ?? loja
}