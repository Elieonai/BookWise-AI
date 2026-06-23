# BookWise AI

Plataforma colaborativa de reviews de livros com recomendações inteligentes utilizando IA desenvolvida como projeto final do Bootcamp Full Stack da SoulCode Academy com a Accenture.

A aplicação permite que usuários explorem um catálogo de livros, consultem avaliações da comunidade, publiquem suas próprias resenhas e recebam recomendações de livros similares geradas por Inteligência Artificial.

## Tecnologias

- React
- React Router DOM
- Node.js
- Express
- OpenAI API
- JSON (fs)

## Como executar o projeto

Pré-requisitos: Node (versão 18 ou superior)

```bash
# clonar repositório
git clone https://github.com/Elieonai/BookWise-AI.git

# Backend
cd backend

npm install

npm run dev

Servidor disponível em:
http://localhost:3000

# Frontend
cd frontend

npm install

npm run dev

Aplicação disponível em:
http://localhost:5173
```

## Endpoints da API

| Método | Endpoint         | Descrição                                               |
| :----: | ---------------- | ------------------------------------------------------  |
|   GET  | `/api/books`     | Retorna todos os livros cadastrados em formato resumido |
|   GET  | `/api/books/:id` | Retorna detalhes completos de um livro específico       |


| Método | Endpoint                      | Descrição                                  |
| :----: | ----------------------------- | ------------------------------------------ |
|   GET  | `/api/reviews/:bookId`        | Lista todas as reviews do livro específico |
|  POST  | `/api/reviews`                | Cria uma review nova para um livro         |

## Equipe

- Elioenai Junior
- Grabiel Meiki
- Lidia Bahia
- Lucas Rodrigues
- Pedro
- Vitor Camilo
