import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <header className="bg-lime-800/75 text-white shadow">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                    Capiventure AI
                </h1>

                <nav aria-label="Navegação principal">
                    <ul className="flex gap-6">
                        <li>
                            <Link to="/" className="hover:text-lime-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-100">Início</Link>
                        </li>

                        <li>
                            <Link to="/books" className="hover:text-lime-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-100">Livros</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}