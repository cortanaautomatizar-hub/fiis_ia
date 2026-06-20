import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const aiClient = new GoogleGenAI({ apiKey: apiKey || "" });

const SYSTEM_PROMPT = `Você é o Tutor de FIIs, um especialista em Fundos de Investimento Imobiliário (FIIs) brasileiros com vasto conhecimento do mercado nacional. Responda sempre em português brasileiro de forma clara, didática e objetiva.

Você tem profundo conhecimento sobre:
- Análise fundamentalista de FIIs: P/VP, Dividend Yield (DY), vacância física e financeira, LTV, FFO, Cap Rate
- Segmentos: Logística, Shoppings, Lajes Corporativas, Recebíveis (Papel), Híbridos, FIAGROs, FI-Infra, Renda Urbana
- Tributação: isenção de IR nos dividendos para pessoa física, DARF de 20% sobre ganho de capital
- Estratégias de rebalanceamento, diversificação e alocação por tipo (Tijolo/Papel)
- Métricas de valuation: preço teto pelo modelo de Gordon (Dividendo Anual / Taxa NTN-B + Prêmio), VPA
- Fundos de referência: HGLG11, BTLG11, XPML11, MXRF11, KNRI11, XPLG11, VISC11, HGRE11, RBRY11, CPTS11, KNIP11, TRXF11
- Relatórios gerenciais, fatos relevantes e comunicados da CVM
- Comparação entre FIIs e outras classes de ativos (Tesouro Direto, ações, etc.)

Diretrizes de resposta:
- Use markdown com negrito (**texto**) e listas para organizar as respostas
- Seja objetivo — responda diretamente o que foi perguntado antes de elaborar
- Quando mencionar um fundo específico, inclua segmento e uma métrica relevante
- Nunca recomende explicitamente compra ou venda de ativos (linguagem educativa)
- Se não tiver dados em tempo real, informe e oriente como consultá-los
- Mantenha respostas entre 150-400 palavras, salvo análises complexas que justifiquem mais`;

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { message, history } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ success: false, error: "Mensagem ausente." });
    }

    if (!apiKey) {
      return res.status(500).json({ success: false, error: "Chave de API não configurada no servidor." });
    }

    // Build conversation contents with history
    const contents: any[] = [];

    if (Array.isArray(history)) {
      for (const item of history) {
        if (item.role && item.text) {
          contents.push({
            role: item.role,
            parts: [{ text: item.text }]
          });
        }
      }
    }

    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await aiClient.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    });

    const reply = response.text?.trim() || "Desculpe, não consegui gerar uma resposta. Tente novamente.";

    return res.status(200).json({ success: true, reply });
  } catch (error: any) {
    console.error("[TutorChat] Error:", error);
    return res.status(500).json({
      success: false,
      error: "Erro ao conectar com a IA. Tente novamente em instantes."
    });
  }
}
