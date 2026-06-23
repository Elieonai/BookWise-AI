import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { livros } from "../data/livros";

function LivroDetalhe() {
    const { id } = useParams();
    const navigate = useNavigate();

    const livro = livros.find((l) => l.id === Number(id));

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

    return (
        <>
            <header>
                <Navbar />
            </header>

            <main className="max-w-5xl mx-auto px-6 py-10">
                <section className="mb-14">
                    <div className="flex flex-wrap gap-10">
                        <div>
                            <img
                                src={livro.capa}
                                alt={`Capa do livro ${livro.titulo}`}
                                className="w-64 rounded-md shadow-md object-cover"
                            />
                        </div>

                        <div className="flex flex-col gap-4 flex-1">
                            <h1 className="text-5xl font-bold leading-tight">{livro.titulo}</h1>

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
                                    <dt className="font-semibold inline">Sinopse:</dt>
                                    <dd className="text-gray-700 mt-1 ml-1 leading-relaxed inline">{livro.descricao}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </section>

                <section>
                    <h2>Resenhas da comunidade</h2>
                </section>


            </main>
        </>
    );
}

export default LivroDetalhe;