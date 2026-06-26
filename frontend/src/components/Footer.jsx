import { Link } from "react-router-dom";

function Footer() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-2xl font-bold">BookWise AI</h2>
          <p className="text-gray-400 text-sm mt-3">
            Plataforma para descobrir livros, ler resenhas da comunidade e receber recomendações inteligentes.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Navegação</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Início</li>
            <li>Livros</li>
            <li>Resenhas</li>
            <li>Recomendações</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Tecnologias</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>React</li>
            <li>Tailwind CSS</li>
            <li>Node.js</li>
            <li>Express</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
        © {anoAtual} BookWise AI. Desenvolvido em equipe.
      </div>
    </footer>
  );
}

export default Footer;