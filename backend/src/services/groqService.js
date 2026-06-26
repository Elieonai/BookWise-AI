require("dotenv").config();
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

async function enviarParaGroq(messages) {
  const response = await groq.chat.completions.create({
    model: GROQ_MODEL,
    temperature: 0.3,
    max_tokens: 700,
    messages,
  });

  return response.choices[0].message.content;
}

module.exports = {
  enviarParaGroq,
};