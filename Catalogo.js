const express = require('express');
const cors = require('cors'); // Importa o CORS
const app = express();
const porta = 3006;

// Habilita o CORS para todas as origens
app.use(cors());

// Configura o servidor para entender JSON
app.use(express.json());

// Lista inicial de cadastros
const cadastros = [
  { id: 1, nome: "Franca Roland", email: "franca@email.com", senha: '0998765', estado: "Santa Catarina"},
  { id: 2, nome: "Lumian Lee", email: "lumians@email.com", senha: '4378755', estado: "Minas Gerais"},
  { id: 3, nome: "Andrezito Rossi", email: "andrezito@email.com", senha: '3964541', estado: "Santa Catarina"}
];

// Rota GET para a raiz (/)
app.get('/', (req, res) => {
  res.json({ mensagem: 'Bem-vindo à nossa API de Cadastro!' });
});

// Rota GET para listar os cadastros (/cadastros)
app.get('/cadastros', (req, res) => {
  res.json(cadastros);
});

// Rota GET para listar os cadastros filtrados por categoria(/cadastros/filtrar)
app.get('/cadastros/filtrar', (req, res) => {
    const { estado } = req.query;

    if (estado) {
      const filtrados = estado.filter(uf => uf.estado() === estado())
      return(filtrados)
    }

    res.json(cadastros);
});

// Rota GET para listar os cadastros filtrados na base do id (/cadastros/:id)
app.get('/cadastros/:id', (req, res) => {
  const {id} = req.params;
  res.send(`Buscando o usuário com o ID: ${id}`);
});


// Rota POST para adicionar um novo cadastro com ID automático
app.post('/cadastros', (req, res) => {
  const { nome, email, senha, estado } = req.body;
  
  const novoCadastro = {
    id: cadastros.length > 0 ? cadastros[cadastros.length - 1].id + 1 : 1,
    nome,
    email,
    senha,
    estado
  };

  cadastros.push(novoCadastro);
  res.status(201).json({ mensagem: "Cadastro realizado com sucesso!", dadosRecebidos: novoCadastro });
});

// Rota DELETE para deletar um cadastro com ID automático
app.delete('/cadastros/:id', (req,res) => {
const { id } = req.params;
 console.log(`Removendo o item com id: ${id}`);
});

// Inicializando o servidor
app.listen(porta, () => {
  console.log('Acesse: http://localhost:3006');
});