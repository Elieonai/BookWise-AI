# BookWise AI Frontend

Frontend React/Vite da aplicação BookWise AI.

## Variáveis de ambiente

Crie um `.env` com base em `env.example` para conectar o frontend ao Firestore:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

Configure `VITE_AI_API_URL` com a URL da API publicada no Render, incluindo `/api` no final:

```bash
VITE_AI_API_URL=https://bookwise-ai-1.onrender.com/api
```

A chave `GEMINI_API_KEY` deve ficar apenas nas variáveis de ambiente do Render, nunca no frontend.

## Integrações de dados

O frontend usa duas fontes:

- Firestore direto via Firebase Web SDK para catálogo e resenhas.
- API Express configurada em `VITE_AI_API_URL` para ranking e recursos de IA.

Endpoints da API consumidos ou disponíveis para compatibilidade:

| Método | Endpoint relativo a `VITE_AI_API_URL` | Uso no frontend                    |
| :----: | ------------------------------------- | ---------------------------------- |
|   GET  | `/books/top-rated`                    | Home, livros mais bem avaliados    |
|   GET  | `/books`                              | Compatibilidade/backend Swagger    |
|   GET  | `/books/:id`                          | Compatibilidade/backend Swagger    |
|   GET  | `/reviews`                            | Compatibilidade/backend Swagger    |
|   GET  | `/reviews/:bookId`                    | Compatibilidade/backend Swagger    |
|  POST  | `/reviews`                            | Compatibilidade/backend Swagger    |
|   GET  | `/ai/recommendations/:bookTitle`      | Detalhe do livro, recomendações IA |
|   GET  | `/ai/reviews-summary/:bookId`         | Resumo de avaliações por IA        |
|  POST  | `/ai/semantic-search`                 | Busca semântica por IA/fallback    |

No desenvolvimento local, use:

```bash
VITE_AI_API_URL=http://localhost:3000/api
```

## Comandos

```bash
npm install
npm run dev
npm run build
npm run lint
```

O build foi validado com Node `20.17`.
