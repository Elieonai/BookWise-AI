import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ReviewCard from "../components/reviewCard";
import Footer from "../components/Footer";
import { getBookById } from "../services/booksService";
import ResumeCard from "../components/ResumeCard";

function LivroDetalhe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [modalAberto, setModalAberto] = useState(false);

    const [livro, setLivro] = useState(null);
    const [resume, setResume] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [recomendacoes, setRecomendacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [nome, setNome] = useState("");
    const [comentario, setComentario] = useState("");
    const [nota, setNota] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);

                const livroData = await getBookById(id);
                setLivro(livroData);

                const resumeData = await fetch(`api/ai/reviews-summary/${id}`)
                setResume(resumeData);

                const reviewsRes = await fetch(`/api/reviews/${id}`);
                const reviewsData = await reviewsRes.json();
                setReviews(reviewsData);

                const aiRes = await fetch(`/api/ai/recommendations/${encodeURIComponent(livroData.titulo)}`);
                const aiData = await aiRes.json();
                setRecomendacoes(aiData);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [id]);

    async function postarAvaliacao(e) {
        e.preventDefault();

        if (!nome.trim() || !comentario.trim() || !nota.trim()) {
            alert("Preencha todos os campos!");
            return;
        }

        if (Number(nota) < 0 || Number(nota) > 5) {
            alert("A nota precisa ser entre 0 e 5!");
            return;
        }

        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookId: Number(id),
                    nome,
                    comentario,
                    nota: Number(nota)
                })
            });

            const novaReview = await response.json();
            setReviews(prev => [...prev, novaReview]);

            setNome("");
            setComentario("");
            setNota("");
            setModalAberto(false);

        } catch (err) {
            alert("Erro ao postar avaliação!");
        }
    }

    if (loading) return <p className="text-center mt-10 text-gray-500">Carregando...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
    if (!livro) return <p className="text-center mt-10 text-gray-500">Livro não encontrado.</p>;

    console.log(<ResumeCard />);
    

    return (
        <>
            <header>
                <Navbar />
            </header>

            <main className="max-w-5xl mx-auto px-6 py-10">
                <section className="mb-10">
                    <div className="flex flex-wrap gap-10">
                        <img
                            src={livro.capa}
                            alt={`Capa do livro ${livro.titulo}`}
                            className="w-64 h-100 rounded-md shadow-md object-cover"
                        />

                        <div className="flex flex-col gap-4 flex-1">
                            <h1 className="text-5xl leading-tight">{livro.titulo}</h1>

                            <dl className="flex flex-col gap-2 text-lg">
                                <div className="flex items-center gap-2">
                                    <dt className="font-semibold">Avaliação:</dt>
                                    <dd>{"⭐".repeat(livro.avaliacao ?? 0)}</dd>
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
                                    <dt className="font-semibold inline">Sinopse: </dt>
                                    <dd className="text-gray-700 mt-1 ml-1 leading-relaxed inline">
                                        {livro.descricao ?? livro.sinopse}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </section>

                {/* Recomendações da IA */}
                {recomendacoes.length > 0 && (
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">✨ Gostou deste? A IA recomenda...</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {recomendacoes.map((rec, index) => (
                                <div key={index} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <p className="font-bold text-sm">{rec.livro}</p>
                                    <p className="text-xs text-gray-500 mt-1">{rec.autor}</p>
                                    <p className="text-xs text-gray-700 mt-2">{rec.sinopse}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Reviews */}
                <section>
                    <h2 className="text-4xl">Resenhas da comunidade</h2>

                    {/* RESUMO DE REVIEWS */}
                    <ResumeCard livro={livro.titulo} resumo={resume}/>

                    <button
                        type="button"
                        onClick={() => setModalAberto(true)}
                        className="bg-blue-600 hover:bg-blue-800 text-white text-sm px-5 py-2 rounded-lg transition-colors duration-150 cursor-pointer font-bold mt-5"
                    >
                        Avaliar livro
                    </button>

                    <div>
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <ReviewCard review={review} key={review.id} />
                            ))
                        ) : (
                            <p className="text-gray-500 mt-5">Ainda não há resenhas para este livro.</p>
                        )}
                    </div>
                </section>

                {/* Modal */}
                {modalAberto && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl shadow-xl w-100 relative">
                            <button
                                type="button"
                                onClick={() => setModalAberto(false)}
                                className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
                            >
                                ×
                            </button>

                            <h2 className="text-2xl font-bold mb-1">Avaliação do Livro</h2>
                            <p className="text-gray-600 mb-4">{livro.titulo}</p>

                            <form onSubmit={postarAvaliacao} className="flex flex-col gap-3">
                                <label className="text-sm font-semibold">Nome:</label>
                                <input
                                    type="text"
                                    placeholder="Escreva seu nome"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    className="border rounded-lg p-2"
                                />

                                <label className="text-sm font-semibold">Comentário do livro:</label>
                                <textarea
                                    placeholder="Escreva seu comentário"
                                    rows="4"
                                    value={comentario}
                                    onChange={(e) => setComentario(e.target.value)}
                                    className="border rounded-lg p-2"
                                />

                                <label className="text-sm font-semibold">Nota do livro:</label>
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