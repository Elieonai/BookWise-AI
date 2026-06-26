const books = require("../../data/books.json");
const { enviarParaGroq } = require("./groqService");

function buscarLivrosRelevantes(pergunta) {
  const termo = pergunta.toLowerCase();

  return books
    .map((book) => {
      const texto = `
        ${book.titulo}
        ${book.autor}
        ${book.genero}
        ${book.descricao}
      `.toLowerCase();

      let score = 0;

      termo.split(" ").forEach((palavra) => {
        if (palavra.length > 2 && texto.includes(palavra)) {
          score++;
        }
      });

      return { ...book, score };
    })
    .filter((book) => book.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function montarContexto(livrosEncontrados) {
  if (livrosEncontrados.length === 0) {
    return "Nenhum livro específico foi encontrado na base do BookWise.";
  }

  return livrosEncontrados
    .map((book) => {
      return `
Título: ${book.titulo}
Autor: ${book.autor}
Gênero: ${book.genero}
Descrição: ${book.descricao}
Avaliação: ${book.avaliacao}
`;
    })
    .join("\n");
}

async function conversarComAgente(pergunta, historico = []) {
  const livrosEncontrados = buscarLivrosRelevantes(pergunta);
  const contexto = montarContexto(livrosEncontrados);

  const systemPrompt = `
Você é o BookWise AI, um agente especialista em livros.

Seu papel é ajudar usuários a:
- encontrar livros;
- receber recomendações;
- entender gêneros literários;
- comparar obras;
- escolher a próxima leitura;
- explicar livros de forma simples.

Use a base de livros do BookWise como fonte principal.

BASE DE LIVROS:
${contexto}

Regras:
- Responda sempre em português.
- Seja claro, amigável e objetivo.
- Quando recomendar livros, explique rapidamente o motivo.
- Se o livro não estiver na base, avise que não encontrou na base do BookWise, mas pode ajudar com conhecimento geral.
`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...historico.slice(-6),
    { role: "user", content: pergunta },
  ];

  const resposta = await enviarParaGroq(messages);

  return {
    resposta,
    livrosEncontrados,
  };
}

module.exports = {
  conversarComAgente,
};