import { Link } from "react-router-dom";
export default function Hero({ onVerMais }) {
  return (
    <section className="relative min-h-[400px] overflow-hidden">

      {/* FUNDO /}
      <div className="absolute inset-0">
        <img
          src="/banner2.png"
          alt="Banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/ CAPIVARA (camada flutuante) /}
      <img
        src="/capivara-semfundo.png"
        alt="Capivara"
        className="
          absolute bottom-[4%] right-[4%]
          w-[220px] sm:w-[280px] md:w-[300px] lg:w-[340px]
          object-contain
        "
      />

      {/ CONTEÚDO */}
      <div className="relative max-w-7xl mx-auto px-6 py-16 pr-0 lg:pr-[380px">
        <div className="max-w-md lg:max-w-xl">

          <h1 className="text-3xl sm:text-4xl lg:text-5xl text-lime-900 font-bold mb-4">
            Boas histórias a gente compartilha
          </h1>



          <p className="text-base sm:text-lg text-lime-800 mb-6">
            Reviews sinceros, recomendações inteligentes e leitores de todo o Brasil.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/books"
              className="inline-block bg-lime-700 hover:bg-lime-800 text-white font-semibold px-8 py-3 rounded-xl transition duration-300"
            >
              Explorar Livros
            </Link>
            <button className="bg-lime-700 hover:bg-lime-800 text-white px-6 py-3 rounded-lg transition">
            <a
              href="#top-rated-books"

            >
              Ver Mais Avaliados
            </a>
            </button>
          </div>

        </div>
      </div>

    </section>
  );
}