import { useState } from "react";

function CapivAIChat() {
  const [aberto, setAberto] = useState(false);
  const [pergunta, setPergunta] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mensagens, setMensagens] = useState([
    {
      autor: "capivai",
      texto: "Olá! Eu sou a CapivAI 🦫📚 Me diga o tipo de livro que você quer ler hoje.",
    },
  ]);

  async function enviarMensagem(e) {
    e.preventDefault();

    if (!pergunta.trim()) return;

    const textoUsuario = pergunta;

    setMensagens((anteriores) => [
      ...anteriores,
      { autor: "usuario", texto: textoUsuario },
    ]);

    setPergunta("");
    setCarregando(true);

    try {
      const response = await fetch("http://localhost:3000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pergunta: textoUsuario,
        }),
      });

      const data = await response.json();

      setMensagens((anteriores) => [
        ...anteriores,
        {
          autor: "capivai",
          texto: data.resposta || "Não consegui encontrar uma recomendação agora.",
        },
      ]);
    } catch (error) {
      setMensagens((anteriores) => [
        ...anteriores,
        {
          autor: "capivai",
          texto: "Ops! Não consegui conectar com o servidor agora.",
        },
      ]);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <>
      {aberto && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-green-200 overflow-hidden">
          <div className="bg-green-700 text-white p-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">CapivAI 🦫</h3>
              <p className="text-xs text-green-100">
                Seu assistente de leitura
              </p>
            </div>

            <button
              onClick={() => setAberto(false)}
              className="text-white text-xl font-bold hover:text-green-200"
            >
              ×
            </button>
          </div>

          <div className="h-80 overflow-y-auto p-4 bg-[#fffaf0] space-y-3">
            {mensagens.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.autor === "usuario" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-2 text-sm leading-relaxed ${
                    msg.autor === "usuario"
                      ? "bg-green-700 text-white"
                      : "bg-white text-gray-800 border border-green-100"
                  }`}
                >
                  {msg.texto}
                </div>
              </div>
            ))}

            {carregando && (
              <div className="text-sm text-gray-500">
                CapivAI está procurando livros...
              </div>
            )}
          </div>

          <form onSubmit={enviarMensagem} className="p-3 bg-white flex gap-2">
            <input
              type="text"
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              placeholder="Pergunte algo sobre livros..."
              className="flex-1 border border-green-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600"
            />

            <button
              type="submit"
              className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800"
            >
              ➤
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setAberto(!aberto)}
        className="fixed bottom-6 right-6 z-50 w-20 h-20 rounded-full bg-white shadow-xl border-4 border-green-700 flex items-center justify-center hover:scale-105 transition"
        title="Abrir CapivAI"
      >
        <img
          src="/capivara-semfundo.png"
          alt="CapivAI"
          className="w-16 h-16 object-contain"
        />
      </button>
    </>
  );
}

export default CapivAIChat;