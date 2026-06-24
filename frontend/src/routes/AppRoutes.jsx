import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import LivroDetalhe from "../pages/LivroDetalhe"
import BooksListPage from "../pages/BooksListPage";

export default function AppRoutes () {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books/:id" element={<LivroDetalhe />} />
            <Route path="/books" element={<BooksListPage />} />
            
        </Routes>
    )
}