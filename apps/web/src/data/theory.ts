// Conteúdo teórico de cada módulo (página /teoria/:moduleId).

export type TheoryBlock
  = | { type: 'text'; text: string }
  | { type: 'example'; databaseId: string; sql: string; caption?: string }
  | { type: 'tip'; tone: 'dica' | 'atencao'; text: string }

export interface TheorySection {
  title: string
  blocks: TheoryBlock[]
}

export interface ModuleTheory {
  moduleId: string
  intro: string
  sections: TheorySection[]
  summary: string[]
}

export const theory: ModuleTheory[] = [
  {
    moduleId: 'sql-basico',
    intro: 'Antes de escrever comandos, vamos entender onde os dados moram e como pedir para ver só o que interessa.',
    sections: [
      {
        title: 'O que é um banco de dados?',
        blocks: [
          { type: 'text', text: 'Um banco de dados é um lugar organizado para guardar informações, como a lista de clientes de uma loja ou os livros de uma biblioteca.' },
          { type: 'text', text: 'Os dados ficam em **tabelas**, parecidas com uma planilha. Cada **coluna** guarda um tipo de informação (nome, cidade, preço) e cada **linha** é um registro (um cliente, um produto).' },
          { type: 'text', text: 'SQL é a linguagem que usamos para conversar com o banco: pedir dados, cadastrar, alterar e apagar.' },
        ],
      },
      {
        title: 'Seu primeiro SELECT',
        blocks: [
          { type: 'text', text: 'Para ver dados, usamos `SELECT` (o que eu quero ver) e `FROM` (de qual tabela). O `*` significa "todas as colunas".' },
          { type: 'example', databaseId: 'loja', sql: 'SELECT * FROM clientes;', caption: 'Todas as colunas e linhas da tabela clientes.' },
          { type: 'text', text: 'Quase sempre você não precisa de tudo. Basta listar as colunas que quer, separadas por vírgula:' },
          { type: 'example', databaseId: 'loja', sql: 'SELECT nome, cidade FROM clientes;' },
          { type: 'tip', tone: 'dica', text: 'O `;` marca o fim do comando. Os comandos podem ser escritos em maiúsculas ou minúsculas, mas usar maiúsculas para as palavras do SQL deixa a leitura mais fácil.' },
        ],
      },
      {
        title: 'Filtrando com WHERE',
        blocks: [
          { type: 'text', text: 'O `WHERE` funciona como um filtro: só aparecem as linhas que obedecem à condição. Textos vão entre aspas simples; números, sem aspas.' },
          { type: 'example', databaseId: 'loja', sql: 'SELECT nome, cidade FROM clientes WHERE cidade = \'Curitiba\';' },
          { type: 'example', databaseId: 'loja', sql: 'SELECT nome, preco FROM produtos WHERE preco > 50;', caption: 'Você também pode comparar com <, <=, > e >=, e usar <> para "diferente de".' },
        ],
      },
      {
        title: 'Ordenando com ORDER BY e limitando com LIMIT',
        blocks: [
          { type: 'text', text: 'O `ORDER BY` organiza o resultado. Por padrão a ordem é crescente (`ASC`); para decrescente, use `DESC`. O `LIMIT` diz quantas linhas mostrar.' },
          { type: 'example', databaseId: 'loja', sql: 'SELECT nome, preco FROM produtos ORDER BY preco DESC LIMIT 3;', caption: 'Os 3 produtos mais caros.' },
          { type: 'tip', tone: 'atencao', text: 'A ordem das partes importa: `SELECT` → `FROM` → `WHERE` → `ORDER BY` → `LIMIT`. Trocar a ordem dá erro.' },
        ],
      },
    ],
    summary: [
      '`SELECT` escolhe as colunas e `FROM` escolhe a tabela.',
      '`*` traz todas as colunas.',
      '`WHERE` filtra as linhas por uma condição.',
      '`ORDER BY` ordena (`ASC` ou `DESC`) e `LIMIT` limita a quantidade.',
    ],
  },
  {
    moduleId: 'manipulacao',
    intro: 'Até agora só lemos dados. Neste módulo você vai cadastrar, alterar e apagar registros.',
    sections: [
      {
        title: 'INSERT: cadastrando dados',
        blocks: [
          { type: 'text', text: 'O `INSERT INTO` adiciona uma nova linha. Você diz a tabela, as colunas e, em `VALUES`, os valores na mesma ordem.' },
          { type: 'example', databaseId: 'loja', sql: 'INSERT INTO clientes (id, nome, email, cidade, ativo)\nVALUES (6, \'Fábio Nunes\', \'fabio@email.com\', \'Guarujá\', true);', caption: 'Depois do INSERT mostramos como a tabela ficou: o Fábio entrou no fim.' },
          { type: 'tip', tone: 'dica', text: 'Liste as colunas mesmo quando for preencher todas. Assim o comando continua certo se alguém mudar a ordem das colunas da tabela.' },
        ],
      },
      {
        title: 'UPDATE: alterando dados',
        blocks: [
          { type: 'text', text: 'O `UPDATE` muda valores de linhas que já existem. O `SET` diz o que muda e o `WHERE` diz em quais linhas.' },
          { type: 'example', databaseId: 'loja', sql: 'UPDATE produtos SET estoque = 30 WHERE id = 4;', caption: 'O fone de ouvido (id 4) estava sem estoque e agora tem 30.' },
          { type: 'example', databaseId: 'loja', sql: 'UPDATE produtos SET preco = preco * 0.9 WHERE categoria = \'Papelaria\';', caption: 'Também dá para calcular: 10% de desconto em toda a papelaria.' },
        ],
      },
      {
        title: 'DELETE: apagando dados',
        blocks: [
          { type: 'text', text: 'O `DELETE FROM` remove as linhas que obedecem ao `WHERE`.' },
          { type: 'example', databaseId: 'loja', sql: 'DELETE FROM clientes WHERE ativo = false;', caption: 'A Carla, que estava inativa, saiu da tabela.' },
          { type: 'tip', tone: 'atencao', text: 'Cuidado: `UPDATE` ou `DELETE` **sem WHERE** atingem a tabela inteira. Um `DELETE FROM clientes;` apaga todos os clientes. Antes de alterar, rode um `SELECT` com o mesmo `WHERE` para conferir quais linhas serão afetadas.' },
        ],
      },
    ],
    summary: [
      '`INSERT INTO tabela (colunas) VALUES (valores)` cadastra uma linha.',
      '`UPDATE tabela SET coluna = valor WHERE ...` altera linhas.',
      '`DELETE FROM tabela WHERE ...` apaga linhas.',
      'Sem `WHERE`, o `UPDATE` e o `DELETE` valem para a tabela toda.',
    ],
  },
  {
    moduleId: 'where-avancado',
    intro: 'Um filtro simples nem sempre basta. Aqui você aprende a combinar condições e a buscar por listas, faixas, partes de texto e valores vazios.',
    sections: [
      {
        title: 'AND, OR e NOT',
        blocks: [
          { type: 'text', text: '`AND` exige que **todas** as condições sejam verdadeiras. `OR` exige que **pelo menos uma** seja. `NOT` inverte a condição.' },
          { type: 'example', databaseId: 'escola', sql: 'SELECT * FROM notas WHERE disciplina = \'Matemática\' AND nota >= 7;', caption: 'Notas de Matemática que são 7 ou mais.' },
          { type: 'example', databaseId: 'escola', sql: 'SELECT nome, idade FROM alunos WHERE idade = 15 OR idade = 17;' },
          { type: 'tip', tone: 'dica', text: 'Misturando `AND` e `OR`, use parênteses para deixar claro o que vem junto: `WHERE (idade = 15 OR idade = 17) AND turma_id = 1`.' },
        ],
      },
      {
        title: 'IN e BETWEEN',
        blocks: [
          { type: 'text', text: '`IN` testa se o valor está em uma lista. `BETWEEN` testa se está entre dois valores, **incluindo** as pontas.' },
          { type: 'example', databaseId: 'loja', sql: 'SELECT nome, cidade FROM clientes WHERE cidade IN (\'Santos\', \'São Paulo\');' },
          { type: 'example', databaseId: 'escola', sql: 'SELECT nome, idade FROM alunos WHERE idade BETWEEN 15 AND 16;', caption: 'Inclui quem tem 15 e quem tem 16.' },
        ],
      },
      {
        title: 'LIKE: buscando partes de um texto',
        blocks: [
          { type: 'text', text: 'O `LIKE` compara com um modelo. O `%` vale "qualquer sequência de letras" e o `_` vale "exatamente uma letra".' },
          { type: 'example', databaseId: 'biblioteca', sql: 'SELECT titulo FROM livros WHERE titulo LIKE \'O %\';', caption: 'Títulos que começam com "O ".' },
          { type: 'example', databaseId: 'biblioteca', sql: 'SELECT titulo FROM livros WHERE titulo LIKE \'%Estrela%\';', caption: 'Títulos que têm "Estrela" em qualquer lugar.' },
        ],
      },
      {
        title: 'NULL: quando o valor está vazio',
        blocks: [
          { type: 'text', text: '`NULL` significa "sem valor". Ele não é zero nem texto vazio, então não dá para comparar com `=`. Use `IS NULL` ou `IS NOT NULL`.' },
          { type: 'example', databaseId: 'biblioteca', sql: 'SELECT leitor, data_emprestimo FROM emprestimos WHERE data_devolucao IS NULL;', caption: 'Empréstimos que ainda não foram devolvidos.' },
          { type: 'tip', tone: 'atencao', text: '`WHERE data_devolucao = NULL` não traz nenhuma linha, nem dá erro. É um engano muito comum: sempre use `IS NULL`.' },
        ],
      },
    ],
    summary: [
      '`AND` (todas), `OR` (pelo menos uma) e `NOT` (inverte).',
      '`IN (a, b, c)` testa uma lista; `BETWEEN x AND y` testa uma faixa, com as pontas.',
      '`LIKE` com `%` e `_` busca partes de texto.',
      'Valores vazios se testam com `IS NULL` e `IS NOT NULL`, nunca com `=`.',
    ],
  },
  {
    moduleId: 'tabelas',
    intro: 'Agora você vai criar e mudar a estrutura do banco: as próprias tabelas.',
    sections: [
      {
        title: 'CREATE TABLE e tipos de dados',
        blocks: [
          { type: 'text', text: 'O `CREATE TABLE` cria uma tabela nova. Para cada coluna, você diz o nome e o tipo de dado. Os mais usados são `INTEGER` (números inteiros), `DECIMAL` (números com casas decimais), `TEXT` (textos) e `BOOLEAN` (verdadeiro ou falso).' },
          { type: 'example', databaseId: 'biblioteca', sql: 'CREATE TABLE leitores (\n  id INTEGER PRIMARY KEY,\n  nome TEXT NOT NULL,\n  telefone TEXT\n);\n\nINSERT INTO leitores (id, nome, telefone) VALUES (1, \'Marina\', \'13 99999-0000\');', caption: 'Criamos a tabela e já cadastramos o primeiro leitor.' },
          { type: 'tip', tone: 'dica', text: 'Datas costumam ser guardadas como texto no formato `AAAA-MM-DD` (por exemplo, `2026-11-23`). Assim a ordenação por data funciona certinho.' },
        ],
      },
      {
        title: 'Chave primária e NOT NULL',
        blocks: [
          { type: 'text', text: 'A **chave primária** (`PRIMARY KEY`) é a coluna que identifica cada linha. Não pode haver dois registros com o mesmo valor nela, por isso quase toda tabela tem uma coluna `id`.' },
          { type: 'text', text: 'O `NOT NULL` torna a coluna obrigatória: o banco recusa uma linha sem esse valor.' },
          { type: 'example', databaseId: 'biblioteca', sql: 'INSERT INTO autores (id, nome, pais) VALUES (1, \'Outro Autor\', \'Brasil\');', caption: 'Já existe um autor com id 1, então o banco recusa: é a chave primária protegendo os dados.' },
        ],
      },
      {
        title: 'ALTER TABLE e DROP TABLE',
        blocks: [
          { type: 'text', text: 'O `ALTER TABLE` muda uma tabela que já existe, por exemplo adicionando uma coluna. As linhas antigas ficam com `NULL` na coluna nova.' },
          { type: 'example', databaseId: 'biblioteca', sql: 'ALTER TABLE livros ADD COLUMN paginas INTEGER;' },
          { type: 'text', text: 'O `DROP TABLE` apaga a tabela inteira: a estrutura e todos os dados.' },
          { type: 'tip', tone: 'atencao', text: '`DROP TABLE` não tem volta. Em um sistema de verdade, confira duas vezes (e tenha um backup) antes de usar.' },
        ],
      },
    ],
    summary: [
      '`CREATE TABLE nome (coluna TIPO, ...)` cria uma tabela.',
      'Tipos comuns: `INTEGER`, `DECIMAL`, `TEXT` e `BOOLEAN`.',
      '`PRIMARY KEY` identifica cada linha; `NOT NULL` torna a coluna obrigatória.',
      '`ALTER TABLE` muda a estrutura e `DROP TABLE` apaga a tabela.',
    ],
  },
  {
    moduleId: 'join',
    intro: 'Em um banco bem organizado, cada assunto fica em sua tabela. O JOIN junta essas tabelas para responder perguntas completas.',
    sections: [
      {
        title: 'Por que separar em tabelas?',
        blocks: [
          { type: 'text', text: 'A tabela `pedidos` não repete o nome do cliente: ela guarda só o `cliente_id`. Essa coluna, que aponta para o `id` de outra tabela, é a **chave estrangeira**.' },
          { type: 'example', databaseId: 'loja', sql: 'SELECT * FROM pedidos;', caption: 'Só números: para saber quem comprou o quê, precisamos juntar com clientes e produtos.' },
        ],
      },
      {
        title: 'INNER JOIN',
        blocks: [
          { type: 'text', text: 'O `INNER JOIN` junta duas tabelas usando uma condição no `ON`, normalmente "a chave estrangeira é igual ao id". Só aparecem as linhas que têm par nas duas tabelas.' },
          { type: 'example', databaseId: 'loja', sql: 'SELECT clientes.nome, pedidos.quantidade, pedidos.data\nFROM pedidos\nINNER JOIN clientes ON clientes.id = pedidos.cliente_id;' },
          { type: 'tip', tone: 'dica', text: 'Quando duas tabelas têm colunas com o mesmo nome (como `nome`), escreva `tabela.coluna` e use `AS` para dar um apelido: `produtos.nome AS produto`.' },
          { type: 'example', databaseId: 'loja', sql: 'SELECT clientes.nome AS cliente, produtos.nome AS produto, pedidos.quantidade\nFROM pedidos\nINNER JOIN clientes ON clientes.id = pedidos.cliente_id\nINNER JOIN produtos ON produtos.id = pedidos.produto_id;', caption: 'Dá para encadear vários JOINs.' },
        ],
      },
      {
        title: 'LEFT JOIN',
        blocks: [
          { type: 'text', text: 'O `LEFT JOIN` mantém **todas** as linhas da tabela da esquerda (a do `FROM`), mesmo as que não têm par. Onde não há par, as colunas da direita vêm como `NULL`.' },
          { type: 'example', databaseId: 'biblioteca', sql: 'SELECT livros.titulo, autores.nome AS autor\nFROM livros\nLEFT JOIN autores ON autores.id = livros.autor_id;', caption: '"Contos Avulsos" não tem autor cadastrado, mas aparece mesmo assim, com o autor vazio.' },
          { type: 'tip', tone: 'atencao', text: 'Com `INNER JOIN`, o livro sem autor sumiria do resultado. Escolha `LEFT JOIN` quando não quiser perder linhas.' },
        ],
      },
    ],
    summary: [
      'A chave estrangeira liga uma tabela à outra (ex.: `pedidos.cliente_id` → `clientes.id`).',
      '`INNER JOIN ... ON ...` traz só as linhas com par nas duas tabelas.',
      '`LEFT JOIN` mantém todas as linhas da esquerda, com `NULL` onde falta par.',
      'Use `tabela.coluna` e `AS` para evitar confusão com nomes repetidos.',
    ],
  },
]

export function getTheory(moduleId: string) {
  return theory.find((t) => t.moduleId === moduleId)
}