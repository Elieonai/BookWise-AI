import { books } from "../data/books";
import BookList from "../components/BookList";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-amber-50/40">
      <Navbar />
      <Hero />

      

      <main className="max-w-5xl mx-auto px-6 py-10">

        <SearchBar />      
        <BookList books={books} />
        
      </main>

      <Footer />
      
    </div>
  );
}

export default Home;