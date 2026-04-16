const express = require('express');
const cors = require('cors');
const { Client } = require('pg');

const app = express();

app.use(cors());
app.use(express.json());

// 🔗 Conexão com banco (Supabase)
const client = new Client({
  connectionString: 'URL_DO_SUPABASE'
});

client.connect()
  .then(() => console.log('Conectado ao banco 🚀'))
  .catch(err => console.error('Erro ao conectar no banco:', err));

// 🏠 Rota raiz (teste)
app.get('/', (req, res) => {
  res.send('API rodando 🚀');
});

// 🔐 Login (ainda fake por enquanto)
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  console.log('Recebi:', email, senha);

  res.json({ msg: 'Funcionando!' });
});

// 🚀 Servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await client.query(
      'SELECT * FROM usuarios WHERE email = $1 AND senha = $2',
      [email, senha]
    );

    if (result.rows.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});