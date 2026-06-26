import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ReviewCard from "../components/ReviewCard";
import { getBooks } from "../services/booksService";
import { getReviews } from "../services/reviewsService";

export default function ReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [booksById, setBooksById] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadReviews() {
            try {
                setLoading(true);

                const [reviewsData, booksData] = await Promise.all([
                    getReviews(),
                    getBooks()
                ]);
                const booksMap = booksData.reduce((acc, book) => {
                    acc[String(book.id)] = book;
                    return acc;
                }, {});

                setReviews(reviewsData);
                setBooksById(booksMap);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadReviews();
    }, []);

    if (loading) return <p className="text-center mt-10 text-gray-500">Carregando resenhas...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

    return (
        <div className="min-h-screen bg-amber-50/40">
            <Navbar />

            <main className="max-w-5xl mx-auto px-6 py-10">
                <section className="mb-10">
                    <h1 className="text-5xl mb-3">Resenhas</h1>
                    <p className="text-gray-600">
                        Veja as avaliações compartilhadas pela comunidade.
                    </p>
                </section>

                <section>
                    {reviews.length > 0 ? (
                        <div className="flex flex-col gap-5">
                            {reviews.map((review) => {
                                const book = booksById[String(review.bookId)];

                                return (
                                    <article key={review.id}>
                                        {book && (
                                            <Link
                                                to={`/books/${review.bookId}`}
                                                className="inline-block text-sm font-semibold text-lime-800 hover:text-lime-950"
                                            >
                                                {book.titulo}
                                            </Link>
                                        )}

                                        <ReviewCard review={review} />
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500">Ainda não há resenhas cadastradas.</p>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
}