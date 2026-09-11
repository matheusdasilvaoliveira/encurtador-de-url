import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import { nanoid } from 'nanoid';

const app = express();

app.use(express.json());

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const criarTabelaSQL = `
  CREATE TABLE IF NOT EXISTS urls (
    id SERIAL PRIMARY KEY,
    original_url TEXT NOT NULL,
    short_code VARCHAR(6) UNIQUE NOT NULL,
    hits INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

db.connect()
  .then(async (client) => {
    console.log('📦 Conectado ao PostgreSQL com sucesso!');
    
    await client.query(criarTabelaSQL);
    console.log('✅ Tabela "urls" verificada/criada e pronta para uso!');
    
    client.release();
  })
  .catch((err) => console.error('❌ Erro ao conectar no banco:', err));

// ==========================================
// DEFINIÇÃO DAS ROTAS DA APLICAÇÃO
// ==========================================

/**
 * Rota 1: Encurtamento de URL
 * Requisito: Recebe uma URL longa e retorna um código curto de 6 caracteres.
 */
app.post('/encurtar', async (req: Request, res: Response) => {
  try {
    const { original_url } = req.body;

    if (!original_url) {
      return res.status(400).json({ erro: 'A URL original é obrigatória.' });
    }

    // Verifica se a URL já existe no banco de dados
    const checkQuery = 'SELECT short_code FROM urls WHERE original_url = $1';
    const { rows } = await db.query(checkQuery, [original_url]);

    // Se já existir, devolvemos o link encurtado que já está no banco
    if (rows.length > 0) {
      const existingCode = rows[0].short_code;
      return res.status(200).json({
        original_url,
        short_code: existingCode,
        link_curto: `http://localhost:5000/${existingCode}`,
        mensagem: 'URL já estava encurtada no nosso sistema!'
      });
    }

    const short_code = nanoid(6);

    const query = 'INSERT INTO urls (original_url, short_code) VALUES ($1, $2) RETURNING *';
    const values = [original_url, short_code];

    await db.query(query, values);

    const link_curto = `http://localhost:5000/${short_code}`;

    res.status(201).json({
      original_url,
      short_code,
      link_curto
    });

  } catch (error) {
    console.error('Erro ao encurtar URL:', error);
    res.status(500).json({ erro: 'Erro interno no servidor ao encurtar a URL' });
  }
});

app.get('/:codigo', async (req: Request, res: Response) => {
  try {
    const { codigo } = req.params;

    // A Mágica do Sênior: UPDATE com RETURNING
    // Nós incrementamos o contador E buscamos a URL original na mesma operação no banco!
    const query = `
      UPDATE urls 
      SET hits = hits + 1 
      WHERE short_code = $1 
      RETURNING original_url;
    `;
    
    const { rows } = await db.query(query, [codigo]);

    if (rows.length === 0) {
      return res.status(404).json({ erro: 'URL não encontrada ou expirada.' });
    }

    const originalUrl = rows[0].original_url;

    res.redirect(301, originalUrl);

  } catch (error) {
    console.error('Erro ao redirecionar:', error);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 API rodando maravilhosamente bem na porta ${PORT}`);
});