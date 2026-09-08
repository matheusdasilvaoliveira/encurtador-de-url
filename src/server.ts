import express, { Request, Response } from 'express';
import { Pool } from 'pg';

// 1. Inicialização do aplicativo Express
const app = express();

// Middleware para que o Express consiga ler JSON no corpo das requisições (req.body)
app.use(express.json());

// 2. Configuração do Banco de Dados PostgreSQL
// O Pool gerencia várias conexões simultâneas de forma eficiente.
// A DATABASE_URL vem daquela variável de ambiente que configuramos no docker-compose.yml
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Testa a conexão com o banco logo que a API sobe
db.connect()
  .then(() => console.log('📦 Conectado ao PostgreSQL com sucesso!'))
  .catch((err) => console.error('❌ Erro ao conectar no banco:', err));


// ==========================================
// 3. DEFINIÇÃO DAS ROTAS DA APLICAÇÃO
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

    // TODO: 1. Gerar um código aleatório de 6 caracteres únicos.
    // TODO: 2. Salvar no banco de dados (original_url, código_curto).
    // TODO: 3. Retornar o link encurtado para o usuário (ex: http://localhost:5000/abc123).

    res.status(201).json({ mensagem: 'Rota de encurtamento ainda em construção!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

/**
 * Rota 2: Redirecionamento e Contador de Acessos
 * Requisito: Ao acessar a URL encurtada, redireciona o usuário para a original.
 * Requisito: O sistema deve registrar quantas vezes cada link curto foi acessado.
 */
app.get('/:codigo', async (req: Request, res: Response) => {
  try {
    const { codigo } = req.params;

    // TODO: 1. Buscar no banco de dados a URL original associada a esse 'codigo'.
    // TODO: 2. Se não existir, retornar erro 404 (Não Encontrado).
    // TODO: 3. Se existir, incrementar o contador de cliques (hits) no banco.
    // TODO: 4. Fazer o redirecionamento HTTP (código 301 ou 302) para a URL original.

    res.status(200).json({ mensagem: `Você acessou o código: ${codigo}` });
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});


// ==========================================
// 4. INICIALIZAÇÃO DO SERVIDOR
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 API rodando maravilhosamente bem na porta ${PORT}`);
});