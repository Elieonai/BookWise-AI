import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-lime-900 text-white mt-16">
      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

        <div>
          <h2 className="text-2xl font-bold mb-3 text-center">
            Capiventure AI
          </h2>

          <p className="text-lime-200 text-sm text-center">
            Plataforma colaborativa de reviews de livros com recomendações inteligentes utilizando IA.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-center">
            Navegação
          </h3>

          <ul className="space-y-2 text-lime-200 text-sm flex justify-center gap-4">
            <li>
              <Link to="/">Início</Link>
            </li>

            <li>
              <Link to="/books">Livros</Link>
            </li>
          </ul>
        </div>

        <div className="text-center">
          <h3 className="font-semibold mb-3">
            Projeto
          </h3>

          <p className="text-lime-200 text-sm mb-2">
            Desenvolvido em React, Tailwind CSS e IA.
          </p>

          <a
            href="https://github.com/Elieonai/BookWise-AI"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lime-300 hover:text-white underline break-all text-sm"
          >
            github.com/Elieonai/BookWise-AI
          </a>
        </div>

      </div>

      <div className="border-t border-lime-700 py-4 text-center text-lime-100 text-sm">
        © 2026 Capiventure AI. Todos os direitos reservados.
      </div>
    </footer>
  );
}