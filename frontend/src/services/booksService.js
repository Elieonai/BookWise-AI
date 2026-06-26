import { buildApiUrl } from './apiClient';

export async function getBooks() {
    const response = await fetch(buildApiUrl('/books'));

    if (!response.ok) {
        throw new Error("Ops! Livro não encontrado!");
    }

    return response.json();
}

export async function getBookById(id) {
    const response = await fetch(buildApiUrl(`/books/${id}`));

    if (!response.ok) {
        throw new Error("Ops! Livro não encontrado!");
    }

    return response.json();
}