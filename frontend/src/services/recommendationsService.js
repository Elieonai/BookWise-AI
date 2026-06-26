const aiBaseUrl = import.meta.env.VITE_AI_API_URL?.replace(/\/$/, "");

export async function getRecommendations(bookTitle) {
    if (!aiBaseUrl) {
        throw new Error("VITE_AI_API_URL não configurada.");
    }

    const response = await fetch(
        `${aiBaseUrl}/ai/recommendations/${encodeURIComponent(bookTitle)}`
    );

    if (!response.ok) {
        throw new Error("Erro ao carregar recomendações.");
    }

    return response.json();
}