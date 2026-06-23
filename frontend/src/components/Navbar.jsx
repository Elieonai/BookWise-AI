function Navbar() {
  return (
    <header className="bg-blue-600 text-white shadow">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          BookWise AI
        </h1>

        <nav>
          <ul className="flex gap-6">
            <li className="cursor-pointer hover:text-gray-200">
              Início
            </li>

            <li className="cursor-pointer hover:text-gray-200">
              Livros
            </li>

            <li className="cursor-pointer hover:text-gray-200">
              Reviews
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;