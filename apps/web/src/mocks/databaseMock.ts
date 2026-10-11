import type { DatabaseSchema } from '@/types/database'

export const mockSqlSchema: DatabaseSchema = {
  tables: [
    {
      name: 'users',
      description: 'Tabela com os dados cadastrais e status dos usuários do sistema.',
      columns: [
        { name: 'id', type: 'INTEGER', primaryKey: true, nullable: false },
        { name: 'name', type: 'TEXT', nullable: false },
        { name: 'email', type: 'TEXT', nullable: false },
        { name: 'active', type: 'BOOLEAN', nullable: false },
      ],
    },
    {
      name: 'orders',
      description: 'Histórico de pedidos realizados pelos usuários.',
      columns: [
        { name: 'id', type: 'INTEGER', primaryKey: true, nullable: false },
        {
          name: 'user_id',
          type: 'INTEGER',
          nullable: false,
          foreignKey: { table: 'users', column: 'id' },
        },
        { name: 'total', type: 'DECIMAL', nullable: false },
        { name: 'created_at', type: 'TEXT', nullable: false },
      ],
    },
    {
      name: 'products',
      description: 'Catálogo de produtos disponíveis na plataforma.',
      columns: [
        { name: 'id', type: 'INTEGER', primaryKey: true, nullable: false },
        { name: 'title', type: 'TEXT', nullable: false },
        { name: 'price', type: 'DECIMAL', nullable: false },
        { name: 'stock', type: 'INTEGER', nullable: false },
      ],
    },
  ],
}

export const mockDatabaseData: Record<string, Record<string, unknown>[]> = {
  users: [
    { id: 1, name: 'João Silva', email: 'joao@example.com', active: true },
    { id: 2, name: 'Maria Souza', email: 'maria@example.com', active: true },
    { id: 3, name: 'Carlos Oliveira', email: 'carlos@example.com', active: false },
    { id: 4, name: 'Ana Costa', email: 'ana@example.com', active: true },
    { id: 5, name: 'Pedro Santos', email: 'pedro@example.com', active: false },
  ],
  orders: [
    { id: 101, user_id: 1, total: 150.5, created_at: '2026-01-10' },
    { id: 102, user_id: 2, total: 89.9, created_at: '2026-01-12' },
    { id: 103, user_id: 1, total: 230.0, created_at: '2026-01-15' },
    { id: 104, user_id: 4, total: 45.0, created_at: '2026-01-18' },
  ],
  products: [
    { id: 1, title: 'Dominando SQL', price: 49.9, stock: 100 },
    { id: 2, title: 'Curso de React Avançado', price: 89.9, stock: 50 },
    { id: 3, title: 'Modelagem de Banco de Dados', price: 59.9, stock: 30 },
  ],
}
