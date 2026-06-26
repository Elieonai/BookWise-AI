const aiService = require("../services/aiService");
const agentService = require("../services/agentService");

const getRecommendations = async (req, res) => {
  try {
    const { bookTitle } = req.params;

    const recommendations = await aiService.getRecommendations(bookTitle);
    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const chatWithAgent = async (req, res) => {
  try {
    const { pergunta, historico } = req.body;

    if (!pergunta) {
      return res.status(400).json({
        error: "A pergunta é obrigatória.",
      });
    }

    const resposta = await agentService.conversarComAgente(
      pergunta,
      historico || []
    );

    res.status(200).json(resposta);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao conversar com o agente.",
      details: error.message,
    });
  }
};

module.exports = {
  getRecommendations,
  chatWithAgent,
};