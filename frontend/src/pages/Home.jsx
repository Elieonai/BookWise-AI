import { livros } from "../data/livros";
import BookList from "../components/BookList";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="bg-gradient-to-r from-blue-700 to-indigo-900">
        <div className="max-w-7xl mx-auto px-6 py-16 flex items-center justify-between">

          <div className="text-white max-w-xl">
            <h1 className="text-5xl font-bold mb-4">
              Descubra sua próxima leitura
            </h1>

            <p className="text-lg text-blue-100 mb-6">
              Explore livros, leia avaliações e encontre
              recomendações inteligentes para sua próxima aventura.
            </p>

            <button className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
              Explorar Livros
            </button>
          </div>

          <img
            src="/capivara.png"
            alt="Mascote BookWise AI"
            className="w-72"
          />

        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex justify-center mb-10">
          <input
            type="text"
            placeholder="Pesquise seu livro de sua escolha"
            className="w-full max-w-md border border-gray-400 rounded-full px-5 py-2 outline-none text-sm"
          />
        </div>

        <BookList livros={livros} />
      </main>

      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-3">
              BookWise AI
            </h2>

            <p className="text-gray-400 text-sm">
              Plataforma colaborativa de reviews de livros com recomendações inteligentes utilizando IA.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">
              Navegação
            </h3>

            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Início</li>
              <li>Livros</li>
              <li>Reviews</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">
              Projeto
            </h3>

            <p className="text-gray-400 text-sm">
              Desenvolvido em React e Tailwind CSS para o projeto BookWise AI.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 py-4 text-center text-gray-400 text-sm">
          © 2026 BookWise AI. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}

export default Home;