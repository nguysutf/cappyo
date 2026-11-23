insert into public.journeys (id, slug, title, description, icon, color, sort_order)
values ('sql', 'sql', 'SQL do zero ao JOIN', 'Aprenda a consultar, filtrar e combinar dados na prática.', 'database', 'primary', 0)
on conflict (id) do update set title = excluded.title, description = excluded.description;

insert into public.modules (id, journey_id, title, description, color, sort_order) values
  ('sql-basico', 'sql', 'SQL Básico', 'O que é um banco de dados, tabelas e o seu primeiro SELECT.', 'primary', 0),
  ('manipulacao', 'sql', 'Manipulação de Dados', 'Inserir, atualizar e remover registros.', 'success', 1),
  ('where-avancado', 'sql', 'WHERE Avançado', 'Filtros com AND, OR, IN, BETWEEN, LIKE e NULL.', 'warning', 2),
  ('tabelas', 'sql', 'Gerenciamento de Tabelas', 'Criar e alterar tabelas, tipos de dados e chaves.', 'info', 3),
  ('join', 'sql', 'JOIN', 'Combinar dados de várias tabelas.', 'secondary', 4)
on conflict (id) do update set title = excluded.title, description = excluded.description, sort_order = excluded.sort_order;

insert into public.lessons (id, module_id, title, description, sort_order, xp_reward, estimated_minutes, available) values
  ('sql-intro-01', 'sql-basico', 'Comandos básicos', 'Seu primeiro contato com SELECT e FROM.', 0, 100, 8, true),
  ('sql-intro-02', 'sql-basico', 'Selecionando colunas', 'Escolha exatamente os dados que você precisa.', 1, 100, 8, false),
  ('sql-intro-03', 'sql-basico', 'Ordenando resultados', 'Organize os resultados com ORDER BY.', 2, 120, 10, false),
  ('dml-01', 'manipulacao', 'INSERT', 'Adicione novos registros.', 0, 120, 10, false),
  ('dml-02', 'manipulacao', 'UPDATE', 'Atualize dados com segurança.', 1, 120, 10, false),
  ('dml-03', 'manipulacao', 'DELETE', 'Remova registros com precisão.', 2, 140, 12, false),
  ('where-01', 'where-avancado', 'AND, OR e NOT', 'Combine condições para filtrar dados.', 0, 140, 12, false),
  ('where-02', 'where-avancado', 'IN e BETWEEN', 'Encontre valores em intervalos e listas.', 1, 140, 12, false),
  ('where-03', 'where-avancado', 'LIKE e IS NULL', 'Pesquise textos e valores ausentes.', 2, 160, 14, false),
  ('ddl-01', 'tabelas', 'CREATE TABLE', 'Modele uma tabela do zero.', 0, 160, 14, false),
  ('ddl-02', 'tabelas', 'Chaves primárias', 'Garanta a identidade de cada registro.', 1, 160, 14, false),
  ('ddl-03', 'tabelas', 'ALTER e DROP', 'Evolua seu banco com segurança.', 2, 180, 16, false),
  ('join-01', 'join', 'INNER JOIN', 'Conecte dados relacionados.', 0, 180, 16, false),
  ('join-02', 'join', 'LEFT JOIN', 'Preserve dados mesmo sem correspondência.', 1, 180, 16, false),
  ('join-03', 'join', 'Desafio final', 'Resolva um problema completo de dados.', 2, 250, 20, false)
on conflict (id) do update set title = excluded.title, description = excluded.description, sort_order = excluded.sort_order, xp_reward = excluded.xp_reward, estimated_minutes = excluded.estimated_minutes, available = excluded.available;

insert into public.exercises (id, lesson_id, type, position, payload) values
  ('ex-01', 'sql-intro-01', 'multiple-choice', 0, '{"title":"Comando de Consulta","question":"Qual comando utilizamos para consultar dados de uma tabela?","explanation":"O comando SELECT é utilizado para recuperar registros de uma ou mais tabelas.","options":[{"id":"opt-a","label":"INSERT","value":"INSERT","correct":false},{"id":"opt-b","label":"SELECT","value":"SELECT","correct":true},{"id":"opt-c","label":"DELETE","value":"DELETE","correct":false},{"id":"opt-d","label":"UPDATE","value":"UPDATE","correct":false}]}'::jsonb),
  ('ex-02', 'sql-intro-01', 'text-completion', 1, '{"title":"Origem dos Dados","question":"Complete a frase informando a cláusula que indica de onde os dados serão lidos:","content":"Para especificar a tabela de onde queremos buscar dados, usamos a cláusula {{blank}}.","answer":"FROM","acceptedAnswers":["from"],"placeholder":"Digite a cláusula...","explanation":"A cláusula FROM especifica a tabela ou view que contém as colunas selecionadas."}'::jsonb),
  ('ex-03', 'sql-intro-01', 'code-completion', 2, '{"language":"sql","title":"Projetando Colunas","question":"Complete a consulta SQL para selecionar apenas o campo nome dos usuários:","code":"SELECT {{blank}} FROM users;","answer":"name","acceptedAnswers":["NAME","`name`","\"name\""],"placeholder":"coluna","explanation":"Indicamos o nome da coluna logo após o SELECT para projetar esse campo no resultado."}'::jsonb),
  ('ex-04', 'sql-intro-01', 'multiple-choice', 3, '{"title":"Filtrando Registros","question":"Qual cláusula utilizamos para filtrar as linhas retornadas por uma consulta?","explanation":"A cláusula WHERE permite definir condições para filtrar os registros retornados.","options":[{"id":"opt-w1","label":"ORDER BY","value":"ORDER BY","correct":false},{"id":"opt-w2","label":"GROUP BY","value":"GROUP BY","correct":false},{"id":"opt-w3","label":"WHERE","value":"WHERE","correct":true},{"id":"opt-w4","label":"HAVING","value":"HAVING","correct":false}]}'::jsonb),
  ('ex-05', 'sql-intro-01', 'code-completion', 4, '{"language":"sql","title":"Selecionando Tudo","question":"Complete a consulta para selecionar todas as colunas da tabela products:","code":"SELECT {{blank}} FROM products;","answer":"*","acceptedAnswers":["*"],"placeholder":"coringa","explanation":"O asterisco (*) representa todas as colunas de uma tabela."}'::jsonb),
  ('ex-06', 'sql-intro-01', 'code-writing', 5, '{"language":"sql","title":"Desafio: Usuários Ativos","question":"Escreva uma consulta SQL que retorne o nome e o e-mail de todos os usuários ativos.","instructions":["Utilize a tabela <code>users</code>.","Retorne apenas as colunas <code>name</code> e <code>email</code>.","Considere apenas os usuários onde <code>active = true</code>.","Você pode executar a consulta quantas vezes quiser antes de verificar."],"initialCode":"SELECT name, email FROM users WHERE ","solutionQuery":"SELECT name, email FROM users WHERE active = true","expectedResult":{"columns":["name","email"],"rows":[{"name":"João Silva","email":"joao@example.com"},{"name":"Maria Souza","email":"maria@example.com"},{"name":"Ana Costa","email":"ana@example.com"}]},"explanation":"Parabéns! Sua consulta retornou os nomes e e-mails de todos os usuários ativos."}'::jsonb)
on conflict (id) do update set payload = excluded.payload, position = excluded.position;
