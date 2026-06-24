export default function Hero () { 
  return ( 
  
    <section className="relative bg-[url('/banner1.png')] bg-cover bg-center min-h-400px"> 
    
      <div className="max-w-7xl mx-auto px-6 py-16 flex items-center justify-between">

        <div className="relative z-10 items-center justify-between p-6"> 
          
          <h1 className="text-5xl text-lime-900 font-bold mb-4"> Descubra sua próxima leitura </h1> 
          <p className="text-lg text-lime-800 mb-6"> Explore livros, leia avaliações e encontre recomendações inteligentes para sua próxima aventura. </p> 
            
            <div className="flex gap-4"> 
              <button className="cursor-pointer bg-lime-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-lime-800"> Explorar Livros </button> 
              <button className="cursor-pointer bg-lime-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-lime-800"> Ver Mais Avaliados </button> 
            </div>

         </div>

      </div>

    </section> 
    
  ); 
}