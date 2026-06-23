const express = require("express");
const app = express();

app.use(express.json())

const port = 8000;

app.get('/', (req, res) => {
    res.json({ message: 'API de Review de Livros' })
})

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}!`);
});