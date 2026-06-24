{/*Simulação com o Backend*/}
import { books } from "../data/books";

export async function getBooks() {

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(books);
        }, 300); //simula delay de API
    });    
}


{/*chamada do backend*/}

{/*export async function getLivros() {
    const response = await fetch("http://localhost:3000/books");

    if (!response.ok) {
        throw new Error ("Ops! Livro não encontrado!");
    }

    return response.json();
}*/}