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
  { id: 3, nome: "Andrezito Rossi", email: "andrezito@email.com", senha: '3964541', estado: "Santa Catarina"},
  { id: 3, nome: "Caíque Cerqueira", email: "caique@email.com", senha: '9374563', estado: "Ceará"}
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
      const filtrados = cadastros.filter(uf => uf.estado.toLowerCase() === estado.toLowerCase())
      return res.json(filtrados);
    }

    res.json(cadastros);
});

// Rota GET para listar os cadastros filtrados na base do id (/cadastros/:id)
app.get('/cadastros/:id', (req, res) => {
  const {id} = req.params;
  res.send(`Buscando o usuário com o ID: ${id}`);

   if (usuario) {
    res.json(usuario);
  } else {
    res.status(404).json({ erro: "Usuário não encontrado" });
  }
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
app.delete('/cadastros/:id', (req, res) => {
  const { id } = req.params;
  const index = cadastros.findIndex(u => u.id === Number(id));
  
  if (index !== -1) {
    cadastros.splice(index, 1);
    return res.status(200).json({ mensagem: "Usuário deletado com sucesso!" });
  } else {
    return res.status(404).json({ erro: "Usuário não encontrado" });
  }
});

// Inicializando o servidor
app.listen(porta, () => {
  console.log('Acesse: http://localhost:3006');
});