import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import LivroDetalhe from "../pages/LivroDetalhe"

export default function AppRoutes () {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/livros/:id" element={<LivroDetalhe />} />
            
        </Routes>
    )
}