const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'BookWise AI API',
            version: '1.0.0',
            description: 'API Render para recursos de IA. Livros e reviews ficam no Firestore direto para o frontend, com endpoints legados documentados para suporte.'
        },
        servers: [
            {
                url: 'https://bookwise-ai-1.onrender.com/api',
                description: 'Render'
            },
            {
                url: 'http://localhost:3000/api',
                description: 'Desenvolvimento local'
            }
        ],
        tags: [
            { name: 'Books', description: 'Consulta de livros' },
            { name: 'Reviews', description: 'Consulta e criacao de resenhas' },
            { name: 'AI', description: 'Recomendacoes geradas pela Gemini API' }
        ],
        components: {
            schemas: {
                Book: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                        firestoreId: { type: 'string', example: '1' },
                        titulo: { type: 'string', example: 'Dom Casmurro' },
                        descricao: { type: 'string', example: 'Um classico da literatura brasileira.' },
                        autor: { type: 'string', example: 'Machado de Assis' },
                        genero: { type: 'string', example: 'Romance' },
                        avaliacao: { type: 'number', example: 4.8 },
                        capa: { type: 'string', example: 'https://example.com/capa.jpg' }
                    }
                },
                Review: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: 'review-id' },
                        bookId: { type: 'number', example: 1 },
                        nome: { type: 'string', example: 'Clarice' },
                        comentario: { type: 'string', example: 'Eu achei este livro muito bom.' },
                        nota: { type: 'number', example: 5 },
                        foto: { type: 'string', nullable: true, example: null }
                    }
                },
                CreateReviewInput: {
                    type: 'object',
                    required: ['bookId', 'nome', 'comentario', 'nota'],
                    properties: {
                        bookId: { type: 'number', example: 1 },
                        nome: { type: 'string', example: 'Clarice' },
                        comentario: { type: 'string', example: 'Eu achei este livro muito bom.' },
                        nota: { type: 'number', minimum: 1, maximum: 5, example: 5 },
                        foto: { type: 'string', nullable: true, example: null }
                    }
                },
                Recommendation: {
                    type: 'object',
                    properties: {
                        livro: { type: 'string', example: 'Memorias Postumas de Bras Cubas' },
                        autor: { type: 'string', example: 'Machado de Assis' },
                        sinopse: { type: 'string', example: 'Romance classico da literatura brasileira.' }
                    }
                },
                ReviewSummary: {
                    type: 'object',
                    properties: {
                        summary: { type: 'string', example: 'A comunidade destaca a escrita envolvente e o impacto da obra.' }
                    }
                },
                SemanticSearchInput: {
                    type: 'object',
                    required: ['query'],
                    properties: {
                        query: { type: 'string', example: 'livros sobre fantasia e amizade' }
                    }
                },
                SemanticSearchResponse: {
                    type: 'object',
                    properties: {
                        type: { type: 'string', example: 'semantic' },
                        results: {
                            type: 'array',
                            items: {
                                allOf: [
                                    { $ref: '#/components/schemas/Book' },
                                    {
                                        type: 'object',
                                        properties: {
                                            motivo: { type: 'string', example: 'Este livro combina com a busca realizada.' }
                                        }
                                    }
                                ]
                            }
                        },
                        message: { type: 'string', example: 'Resultado gerado com fallback local.' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        error: {
                            type: 'object',
                            properties: {
                                message: { type: 'string', example: 'Mensagem de erro' }
                            }
                        }
                    }
                }
            }
        },
        paths: {
            '/books/top-rated': {
                get: {
                    tags: ['Books'],
                    summary: 'Lista livros mais bem avaliados',
                    parameters: [
                        {
                            name: 'limit',
                            in: 'query',
                            required: false,
                            schema: { type: 'number', default: 6 },
                            example: 3
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Livros ordenados por media das reviews',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/Book' }
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Parametro invalido',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            },
            '/books': {
                get: {
                    tags: ['Books'],
                    summary: 'Lista todos os livros',
                    responses: {
                        200: {
                            description: 'Lista de livros',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/Book' }
                                    }
                                }
                            }
                        },
                        500: {
                            description: 'Erro interno',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            },
            '/books/{id}': {
                get: {
                    tags: ['Books'],
                    summary: 'Busca um livro por ID',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'number' },
                            example: 1
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Livro encontrado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Book' }
                                }
                            }
                        },
                        404: {
                            description: 'Livro nao encontrado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            },
            '/reviews': {
                get: {
                    tags: ['Reviews'],
                    summary: 'Lista todas as resenhas',
                    responses: {
                        200: {
                            description: 'Lista de resenhas',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/Review' }
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Parametro invalido',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                },
                post: {
                    tags: ['Reviews'],
                    summary: 'Cria uma resenha',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/CreateReviewInput' }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Resenha criada',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Review' }
                                }
                            }
                        },
                        400: {
                            description: 'Dados invalidos',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            },
            '/reviews/{bookId}': {
                get: {
                    tags: ['Reviews'],
                    summary: 'Lista resenhas de um livro',
                    parameters: [
                        {
                            name: 'bookId',
                            in: 'path',
                            required: true,
                            schema: { type: 'number' },
                            example: 1
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Lista de resenhas do livro',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/Review' }
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Parametro invalido',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            },
            '/ai/recommendations/{bookTitle}': {
                get: {
                    tags: ['AI'],
                    summary: 'Gera recomendacoes de livros similares',
                    parameters: [
                        {
                            name: 'bookTitle',
                            in: 'path',
                            required: true,
                            schema: { type: 'string' },
                            example: 'Dom Casmurro'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Lista de recomendacoes',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/Recommendation' }
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Titulo ausente ou curto',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        500: {
                            description: 'Erro interno',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        429: {
                            description: 'Muitas requisicoes',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            },
            '/ai/reviews-summary/{bookId}': {
                get: {
                    tags: ['AI'],
                    summary: 'Gera resumo das reviews de um livro',
                    parameters: [
                        {
                            name: 'bookId',
                            in: 'path',
                            required: true,
                            schema: { type: 'number' },
                            example: 1
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Resumo das reviews',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ReviewSummary' }
                                }
                            }
                        },
                        400: {
                            description: 'ID invalido',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        500: {
                            description: 'Erro interno',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            },
            '/ai/semantic-search': {
                post: {
                    tags: ['AI'],
                    summary: 'Busca livros por texto com apoio da Gemini',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/SemanticSearchInput' }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Resultado da busca',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/SemanticSearchResponse' }
                                }
                            }
                        },
                        400: {
                            description: 'Query ausente ou curta',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        500: {
                            description: 'Erro interno',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        429: {
                            description: 'Muitas requisicoes',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    apis: []
};

module.exports = swaggerJSDoc(options);