import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-lime-800/75 text-white shadow">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Capiventure AI
        </h1>

        <nav>
          <ul className="flex gap-6">
            <li>
              <Link to="/" className="hover:text-lime-900">Início</Link>
            </li>

            <li>
              <Link to="/books" className="hover:text-lime-900">Livros</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}