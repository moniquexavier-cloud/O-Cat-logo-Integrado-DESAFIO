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
  { id: 4, nome: "Caíque Cerqueira", email: "caique@email.com", senha: '9374563', estado: "Ceará"}
];

// Rota GET para a raiz (/)
app.get('/', (req, res) => {
  res.json({ mensagem: 'Bem-vindo à nossa API de Cadastro!' });
  //resposta em formato JSON
});

// Rota GET para listar os cadastros (/cadastros)
app.get('/cadastros', (req, res) => {
  res.json(cadastros);
});


// Rota GET para listar os cadastros filtrados por estado (/cadastros/filtrar)
app.get('/cadastros/filtrar', (req, res) => {
    const { estado } = req.query;
    //uma requisição query serve para guardar os parametros de uma requisição

    if (estado) {
      const filtrados = cadastros.filter(
        //ele verifica se o array tem estado preenchido e retorna os valores posteriormente
        uf => uf.estado && uf.estado.toLowerCase() === estado.toLowerCase()
        //&& é o AND da parte lógica
        // toLowerCase transforma todas as letras maiúsculas de um texto em letras minúsculas
      );
      return res.json(filtrados);
      // O 'return' encerra a rota AQUI se entrar no IF
    }

    res.json(cadastros);
    // Retorna a lista inteira se o usuário colocar somente /cadastros/filtrar sem colocar parametro
});

// Rota GET para listar os cadastros filtrados na base do id (/cadastros/:id)
app.get('/cadastros/:id', (req, res) => {
  const {id} = req.params;
  const usuario = cadastros.find(u => u.id === Number(id));
  //o Number serve para transformar a atring que era id em um número

  //condição se if é verdadeiro ele mostra o resultado e se if for falso ele dá uma mensagem de erro
   if (usuario) {
    res.json(usuario);
  } else {
    res.status(404).json({ erro: "Usuário não encontrado" });
  }
});


// Rota POST para adicionar um novo cadastro com ID automático
app.post('/cadastros', (req, res) => {
  const { nome, email, senha, estado } = req.body;
  //requisição para POST 
  
  // se tiver valores já cadastrados ele soma o id + 1 se não ele só fica 1
  const novoCadastro = {
    id: cadastros.length > 0 ? cadastros[cadastros.length - 1].id + 1 : 1,
    nome,
    email,
    senha,
    estado
  };

  //colocando o cadastro na lista com uma mensagem
  cadastros.push(novoCadastro);
  res.status(201).json({ mensagem: "Cadastro realizado com sucesso!", dadosRecebidos: novoCadastro });
});

// Rota DELETE para deletar um cadastro com ID automático
app.delete('/cadastros/:id', (req, res) => {
  const { id } = req.params;
  const index = cadastros.findIndex(u => u.id === Number(id));
  // o find percorre o array
  // o index é o indice de posição do item que tem aquele ID.

  // se o idice não for -1 somente ele é deletado do array
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
