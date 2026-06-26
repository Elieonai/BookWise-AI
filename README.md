# BookWise AI

Plataforma colaborativa de reviews de livros com recomendações inteligentes utilizando IA desenvolvida como projeto final do Bootcamp Full Stack da SoulCode Academy com a Accenture.

A aplicação permite que usuários explorem um catálogo de livros, consultem avaliações da comunidade, publiquem suas próprias resenhas e recebam recomendações de livros similares geradas por Inteligência Artificial.

## Tecnologias

- React
- React Router DOM
- Node.js
- Express
- Gemini API
- Firestore
- Vercel
- Render

## Como executar o projeto

Pré-requisitos: Node `20.17` ou superior e uma conta Firebase com Firestore habilitado.

```bash
# clonar repositório
git clone https://github.com/Elieonai/BookWise-AI.git

# Backend local / Render API
cd backend

npm install

# crie o arquivo .env com base em env.example
# configure GEMINI_API_KEY, FRONTEND_ORIGIN e as variáveis FIREBASE_* do projeto

# opcional: envia os livros e reviews iniciais para o Firestore
npm run seed:firestore

npm run dev

Servidor disponível em:
http://localhost:3000

# Frontend
cd frontend

npm install

# crie o arquivo .env com base em env.example
# configure VITE_AI_API_URL=http://localhost:3000/api no desenvolvimento local

npm run dev

Aplicação disponível em:
http://localhost:5173
```

No desenvolvimento local, o frontend lê `books` e `reviews` direto do Firestore e usa `VITE_AI_API_URL` para chamar a API Express. A Home também usa `/api/books/top-rated` para montar o ranking de livros mais bem avaliados. Em produção, configure `VITE_AI_API_URL` na Vercel com a URL pública do Render: `https://bookwise-ai-1.onrender.com/api`.

No Render, configure `FRONTEND_ORIGIN` com a URL pública da Vercel para restringir CORS. Para mais de uma origem, separe os valores por vírgula.

## Firebase e Firestore

O frontend lê e grava nas coleções `books` e `reviews` do Firestore usando o Firebase Web SDK. A API Express no Render fica responsável pelas rotas de IA/Gemini e pelo endpoint legado de ranking `/api/books/top-rated`.

Para publicar somente as regras do Firestore no plano free, selecione o projeto com `firebase use` e execute na raiz do monorepo:

```bash
firebase deploy --only firestore:rules
```

Não use `firebase deploy --only functions`; Firebase Functions exige plano Blaze.

## Endpoints da API

Documentação Swagger disponível em:

- Local: `http://localhost:3000/api-docs`
- JSON OpenAPI: `http://localhost:3000/api-docs.json`

Rotas montadas pelo backend Express:

| Método | Endpoint                              | Descrição                                      |
| :----: | ------------------------------------- | ---------------------------------------------- |
|   GET  | `/api/books/top-rated`                | Lista livros mais bem avaliados por reviews    |
|   GET  | `/api/books`                          | Lista todos os livros do Firestore             |
|   GET  | `/api/books/:id`                      | Busca um livro pelo campo numérico `id`        |
|   GET  | `/api/reviews`                        | Lista todas as resenhas do Firestore           |
|   GET  | `/api/reviews/:bookId`                | Lista resenhas de um livro                     |
|  POST  | `/api/reviews`                        | Cria uma resenha via API legada                |
|   GET  | `/api/ai/recommendations/:bookTitle`  | Gera recomendações com Gemini                  |
|   GET  | `/api/ai/reviews-summary/:bookId`     | Gera resumo das avaliações com Gemini          |
|  POST  | `/api/ai/semantic-search`             | Busca semântica no catálogo com Gemini/fallback |

As rotas `/api/ai/*` têm limite simples de requisições para proteger a quota da Gemini. Livros e reviews continuam sendo acessados diretamente pelo frontend via Firestore, mas as rotas legadas permanecem documentadas e testadas para compatibilidade.

## Equipe

- Elioenai Junior
- Grabiel Meiki
- Lidia Bahia
- Lucas Rodrigues
- Pedro
- Vitor Camilo
