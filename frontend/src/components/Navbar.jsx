function Navbar() {
  return (
    <header className="bg-lime-800/75 text-white shadow">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          BookWise AI
        </h1>

        <nav>
          <ul className="flex gap-6">
            <li className="cursor-pointer hover:text-lime-900">
              Início
            </li>

            <li className="cursor-pointer hover:text-lime-900">
              Livros
            </li>

            <li className="cursor-pointer hover:text-lime-900">
              Reviews
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;