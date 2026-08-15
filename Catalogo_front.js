const API_URL = 'http://localhost:3006';

//Capturando os termos HTML para manipularmos pelo código
const listaUsuarios = document.getElementById('usuarios_cadastrados');
const inputEstado = document.getElementById('input-estado');
const btnBuscar = document.getElementById('btn-buscar');
const btnMostrar = document.getElementById('btn-mostrar');
const formCadastro = document.getElementById('form-cadastro');


//=== Mostrar todos os Cadastrados ===

// "usuarios" é a variável utilizada para representar a lista de cadastrados do back-end
function renderizarUsuarios(usuarios) {
  listaUsuarios.innerHTML = '';
//O "listaUsuarios.innerHTML = '' " limpa a lista antes de colocar novos dados

//Um comando do JavaScript que checa se um valor é um array de verdade ou não
  if (!Array.isArray(usuarios)) {
    usuarios = [usuarios]; 
  }

//Se não tiver nenhum array, ele mostrará uma mensagem em texto dizendo que não encontro
  if (usuarios.length === 0) {
    listaUsuarios.innerHTML = '<li>Nenhum usuário encontrado.</li>';
    return;
  }

//O forEach percorre todos os objetos do array e transforma todos os dados em textos
  usuarios.forEach((usuario) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>[ID: ${usuario.id}] ${usuario.nome}</strong> - ${usuario.email} | ${usuario.estado}
      <button onclick="deletarUsuario(${usuario.id})" style="margin-left: 10px; background-color:red; color: white;">Deletar</button>
    `;
    //Serve para adicionar um item de lista (li) dentro de um elemento pai na página HTML
    listaUsuarios.appendChild(li);
  });
}

//=== Buscar e Carregar todos os usuários ===

//async/await serve para esperar o servidor responder sem travar a navegação
async function carregarUsuarios() {
  try {
    //Faz uma requisição do tipo GET para http://localhost:3006/cadastros no backend
    const res = await fetch(`${API_URL}/cadastros`);
    //converte todos os dados que estavam em JSON para um Array Javascript
    const dados = await res.json();
    //Pegar uma lista ou conjunto de informações sobre pessoas e transformá-los em elementos visuais
    renderizarUsuarios(dados);

    //Serve para caso algo não carregar
  } catch (erro) {
    console.error('Erro ao carregar usuários:', erro);
  }
}

// === Busca através do ID e do Estado ===

async function buscar() {
  // O "trim" Pega o texto digitado na barra de pesquisa e remove espaços em branco antes ou depois
  const valor = inputEstado.value.trim();

  //Se a barra de busca estiver vazio ele usa a função carregar usuários como resposta
  if (!valor) {
    carregarUsuarios();
    return;
  //Encerrando com return
  }

  try {
    // Uma expressão comum em Javscript que serve para verificar se determinado valor é um número
    if (!isNaN(valor)) {
    // await para esperar uma resposta do servidor do backend 
    // "http://localhost:3006/cadastros/numeroTal"
      const res = await fetch(`${API_URL}/cadastros/${valor}`);
    // se o ID não for encontrado, usamos a lista sem filtro
      if (res.status === 404) {
        renderizarUsuarios([]);
        return;
    // encerrando com return
      }
    // caso o ID do usuário for encontrado ele é passado para 
    // a function de renderização para ser transformado em texto
      const usuario = await res.json();
      renderizarUsuarios(usuario);
    
    } else {
    // se o valor pesquisado não for um número ele busca no servidor backend através do filtro
    // "http://localhost:3006/filtro?estado=tal"

    //  encodeURIComponent(valor) é uma função do JavaScript usada para codificar uma parte de uma URL, para transformar caracteres especiais, 
    // acentos e símbolos em um formato entendivel nos navegadores 
      const res = await fetch(`${API_URL}/cadastros/filtrar?estado=${encodeURIComponent(valor)}`);
    // depois disso, a respostaé transformada de JSON para texto no front-end
      const usuarios = await res.json();
      renderizarUsuarios(usuarios);
    }
    // caso algo ocorra no processo, o servidor pega o erro e transforma em mensagem
  } catch (erro) {
    console.error('Erro na busca:', erro);
  }
}

// === Adicionando um novo Cadatro ===

// o "event" é um objeto que guarda informações detalhadas sobre uma ação que acabou de acontecer
// nesse caso armazenar as informações do novo usuário
// o "event.preventDefault" serve para a validação dos dados cadastrados, impedindo que fatores externos atrapalhem
async function cadastrarUsuario(event) {
  event.preventDefault();

// cria um objeto JavaScript com os dados capturados dos campos HTML através de seus IDs 
  const novoUsuario = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    senha: document.getElementById('senha').value,
    estado: document.getElementById('estado').value
  };

  try {
    //chama o backend
    const res = await fetch(`${API_URL}/cadastros`, {
    //Define o método HTTP para criação de recurso.
      method: 'POST',
    //Informa ao servidor que o corpo da requisição está formatado em JSON.
      headers: { 'Content-Type': 'application/json' },
    //Converte o objeto JavaScript em uma string no formato JSON para envio.
      body: JSON.stringify(novoUsuario)
    });

    // se todo o processo funcionar
    if (res.ok) {
    // limpa todos os campos do formulário na tela
      formCadastro.reset();
    // Chama a função de carregar usuários para exibir o novo usuário cadastrado
      carregarUsuarios();
    }
    // Se ocorrer algum erro, ele é transformado em mensagem
  } catch (erro) {
    console.error('Erro ao cadastrar:', erro);
  }
}

// === Deletando um Cadatro ===

async function deletarUsuario(id) {
  try {
    // chama o cadastro do backend através da API
    const res = await fetch(`${API_URL}/cadastros/${id}`, {
    //metodo para deletar
      method: 'DELETE'
    });

    // se tudo der certo, ele recarrega todos os cadastros sem o usuário deletado
    if (res.ok) {
      carregarUsuarios();
    }
    // Se ocorrer algum erro, ele é transformado em mensagem
  } catch (erro) {
    console.error('Erro ao deletar:', erro);
  }
}

// === Ligando as funções aos botões da API ===

//o botão buscar é ligado a function buscar, aplicando filtros a suas pesquisas
btnBuscar.addEventListener('click', buscar);

//o botão "mostrar" retira os filtros 
btnMostrar.addEventListener('click', () => {
  inputEstado.value = '';
//e mostra todos os usuários
  carregarUsuarios();
});
// vincula o envio do formulário (formCadastro) à função cadastrarUsuario
// o evento submit é disparado quando o usuário clica no botão de cadastrar dentro de um campo de texto
formCadastro.addEventListener('submit', cadastrarUsuario);

// Garante que quando o usuário abra o site estejam sendo mostrados todos os cadastros
carregarUsuarios();
