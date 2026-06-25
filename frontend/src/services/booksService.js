{/*chamada do backend*/ }

export async function getBooks() {
    const response = await fetch("/api/books");

    if (!response.ok) {
        throw new Error("Ops! Livro não encontrado!");
    }

    return response.json();
}

export async function getBookById(id) {
    const response = await fetch(`/api/books/${id}`);

    if (!response.ok) {
        throw new Error("Ops! Livro não encontrado!");
    }

    return response.json();
}