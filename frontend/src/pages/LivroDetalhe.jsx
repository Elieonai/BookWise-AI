import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { books } from "../data/books";
import { reviews } from "../data/reviews";
import ReviewCard from "../components/reviewCard";
import Footer from "../components/Footer";

function LivroDetalhe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [modalAberto, setModalAberto] = useState(false);

    const [nome, setNome] = useState("");
    const [comentario, setComentario] = useState("");
    const [nota, setNota] = useState("");
    const [novasAvaliacoes, setNovasAvaliacoes] = useState([]);

    const livro = books.find((l) => l.id === Number(id));

    useEffect(() => {
        if (livro) {
            const avaliacoesSalvas =
                JSON.parse(localStorage.getItem(`avaliacoes-livro-${livro.id}`)) || [];

            setNovasAvaliacoes(avaliacoesSalvas);
        }
    }, [livro]);

    function postarAvaliacao(e) {
        e.preventDefault();

        if (!nome.trim() || !comentario.trim() || !nota.trim()) {
            alert("Preencha todos os campos!");
            return;
        }

        if (Number(nota) < 0 || Number(nota) > 5) {
            alert("A nota precisa ser entre 0 e 5!");
            return;
        }

        const novaAvaliacao = {
            id: Date.now(),
            bookId: livro.id,

            // nomes que seu ReviewCard pode usar
            nome: nome,
            comentario: comentario,
            nota: Number(nota),

            // nomes alternativos, caso o ReviewCard use inglês
            name: nome,
            comment: comentario,
            rating: Number(nota),
        };

        const avaliacoesAtualizadas = [...novasAvaliacoes, novaAvaliacao];

        setNovasAvaliacoes(avaliacoesAtualizadas);

        localStorage.setItem(
            `avaliacoes-livro-${livro.id}`,
            JSON.stringify(avaliacoesAtualizadas)
        );

        setNome("");
        setComentario("");
        setNota("");
        setModalAberto(false);
    }

    if (!livro) {
        return (
            <>
                <header>
                    <Navbar />
                </header>

                <main className="flex flex-col items-center justify-center min-h-screen gap-4">
                    <p className="text-2xl text-gray-500">Livro não encontrado.</p>

                    <button
                        onClick={() => navigate(-1)}
                        className="text-blue-600 underline hover:text-blue-800"
                    >
                        Voltar
                    </button>
                </main>
            </>
        );
    }

    const reviewsDoLivro = reviews.filter((review) => review.bookId === livro.id);

    const todasReviewsDoLivro = [...reviewsDoLivro, ...novasAvaliacoes];

    return (
        <>
            <header>
                <Navbar />
            </header>

            <main className="max-w-5xl mx-auto px-6 py-10">
                <section className="mb-10">
                    <div className="flex flex-wrap gap-10">
                        <div>
                            <img
                                src={livro.capa}
                                alt={`Capa do livro ${livro.titulo}`}
                                className="w-64 h-100 rounded-md shadow-md object-cover"
                            />
                        </div>

                        <div className="flex flex-col gap-4 flex-1">
                            <h1 className="text-5xl leading-tight">{livro.titulo}</h1>

                            <dl className="flex flex-col gap-2 text-lg">
                                <div className="flex items-center gap-2">
                                    <dt className="font-semibold">Avaliação:</dt>
                                    <dd className="flex gap-0.5 text-sm">
                                        {"⭐".repeat(livro.avaliacao)}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="font-semibold inline">Autor: </dt>
                                    <dd className="inline">{livro.autor}</dd>
                                </div>

                                <div>
                                    <dt className="font-semibold inline">Gênero: </dt>
                                    <dd className="inline">{livro.genero}</dd>
                                </div>

                                <div>
                                    <dt className="font-semibold inline">Editora: </dt>
                                    <dd className="inline">{livro.autor}</dd>
                                </div>

                                <div>
                                    <dt className="font-semibold inline">Sinopse: </dt>
                                    <dd className="text-gray-700 mt-1 ml-1 leading-relaxed inline">
                                        {livro.descricao}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-4xl">Resenhas da comunidade</h2>

                    <div>
                        <button
                            type="button"
                            onClick={() => setModalAberto(true)}
                            className="bg-blue-600 hover:bg-blue-800 text-white text-sm px-5 py-2 rounded-lg transition-colors duration-150 cursor-pointer font-bold mt-5"
                        >
                            Avaliar livro
                        </button>
                    </div>

                    <div>
                        {todasReviewsDoLivro.length > 0 ? (
                            todasReviewsDoLivro.map((review) => (
                                <ReviewCard review={review} key={review.id} />
                            ))
                        ) : (
                            <p className="text-gray-500 mt-5">
                                Ainda não há resenhas para este livro.
                            </p>
                        )}
                    </div>
                </section>

                {modalAberto && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl shadow-xl w-[400px] relative">
                            <button
                                type="button"
                                onClick={() => setModalAberto(false)}
                                className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
                            >
                                ×
                            </button>

                            <h2 className="text-2xl font-bold mb-1">
                                Avaliação do Livro
                            </h2>

                            <p className="text-gray-600 mb-4">
                                {livro.titulo}
                            </p>

                            <form onSubmit={postarAvaliacao} className="flex flex-col gap-3">
                                <label className="text-sm font-semibold">
                                    Nome:
                                </label>
                                <input
                                    type="text"
                                    placeholder="Escreva seu nome"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    className="border rounded-lg p-2"
                                />

                                <label className="text-sm font-semibold">
                                    Comentário do livro:
                                </label>
                                <textarea
                                    placeholder="Escreva seu comentário"
                                    rows="4"
                                    value={comentario}
                                    onChange={(e) => setComentario(e.target.value)}
                                    className="border rounded-lg p-2"
                                />

                                <label className="text-sm font-semibold">
                                    Nota do livro:
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="5"
                                    placeholder="Nota de 0 a 5"
                                    value={nota}
                                    onChange={(e) => setNota(e.target.value)}
                                    className="border rounded-lg p-2"
                                />

                                <button
                                    type="submit"
                                    className="bg-yellow-400 hover:bg-yellow-500 py-2 rounded-lg font-semibold mt-2"
                                >
                                    Postar avaliação
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </>
    );
}

export default LivroDetalhe;