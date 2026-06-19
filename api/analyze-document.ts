import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("[WARNING] GEMINI_API_KEY environment variable is missing.");
}

const aiClient = new GoogleGenAI({
  apiKey: apiKey || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const promptInstructions = `Você é um leitor inteligente de extratos de investimentos e relatórios de Fundos Imobiliários (FIIs) brasileiros.
Analise minuciosamente as informações do documento anexado (que é uma tabela Excel/Planilha, extrato de B3/Corretora, extrato bancário ou relatório em PDF) para identificar a carteira de ativos do usuário.
Seu objetivo é extrair todas as posições de fundos imobiliários ativos de renda variável.

Você deve retornar uma estrutura JSON estrita contendo uma lista de ativos identificados. Cada ativo DEVE obrigatoriamente possuir os campos:
- symbol: Código do FII na B3 (composto de 4 letras maiúsculas e finalizando em 11 ou 11B, como MXRF11, HGLG11, BTLG11, KNRI11, CPTS11 etc.)
- quantity: Quantidade inteira de cotas que o investidor possui deste ativo. Se não conseguir achar no documento, use uma quantidade padrão fictícia de 10 cotas.
- averagePrice: Preço médio pago por cota em Reais (por exemplo 100.50, 9.80). Se não for fornecido de forma alguma, tente aproximar para um valor representativo ou use o preço padrão atual (ex: 100.00 para fundos de tijolo, 10.00 para base 10).

Filtre e retorne apenas FIIs reais (ignore ações, tesouro direto ou ativos não relacionados a FIIs se houver).
Retorne estritamente o array JSON conforme a chave correspondente sem tags de markdown adicionais.`;

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { fileData, mimeType, fileName } = req.body;

    if (!fileData || !mimeType) {
      return res.status(400).json({
        success: false,
        error: "Dados do arquivo ou tipo mime ausentes.",
      });
    }

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            mimeType,
            data: fileData,
          },
        },
        promptInstructions,
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              symbol: {
                type: Type.STRING,
              },
              quantity: {
                type: Type.INTEGER,
              },
              averagePrice: {
                type: Type.NUMBER,
              },
            },
            required: ["symbol", "quantity", "averagePrice"],
          },
        },
      },
    });

    const extractedText = response.text;
    if (!extractedText) {
      throw new Error("A IA respondeu com texto vazio.");
    }

    const extractedAssets = JSON.parse(extractedText.trim());

    return res.status(200).json({ success: true, assets: extractedAssets });
  } catch (error: any) {
    console.error("[API Error] Falha de leitura de arquivos com IA:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Erro desconhecido ao processar o extrato com IA.",
    });
  }
}
