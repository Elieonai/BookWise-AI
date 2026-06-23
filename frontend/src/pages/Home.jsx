import { livros } from "../data/livros";
import BookList from "../components/BookList";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

function Home() {
  return (
    <div className="min-h-screen bg-amber-50/40">
      <Navbar />
      <Hero />

      

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/*barra de pesquisa*/}

        <div className="flex justify-center mb-10">
          <div className="flex items-center w-full max-w-md bg-white border border-lime-500 rounded-full px-4 py-2 shadow-sm">

            <input 
              type="text"
              placeholder="Pesquise seu livro aqui"
              className="flex-1 outline-none text-sm bg-transparent" />

                <button className="cursor-pointer m1-2 text-lime-700 hover:text-lime-900">
                  🔍
                </button>
          </div>
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