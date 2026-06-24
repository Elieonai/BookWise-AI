export default function SearchBar({ value, onChange}) {
    return (

        <div className="flex justify-center mb-10">
          <div className="flex items-center w-full max-w-md bg-white border border-lime-500 rounded-full px-4 py-2 shadow-sm">

            <input 
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Pesquise seu livro aqui"
              className="flex-1 outline-none text-sm bg-transparent" />

                <button className="cursor-pointer m1-2 text-lime-700 hover:text-lime-900">
                  🔍
                </button>
          </div>
        </div>

    );
}