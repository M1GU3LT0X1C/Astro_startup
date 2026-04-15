const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// 🏠 Rota raiz (teste)
app.get('/', (req, res) => {
  res.send('API rodando 🚀');
});

// 🔐 Login fake (teste)
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  console.log('Recebi:', email, senha);

  res.json({ msg: 'Funcionando!' });
});

// 🚀 Servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});