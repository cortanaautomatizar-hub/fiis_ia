import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase body payload limits to support large base64-encoded PDF and Excel files
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Lazy initialize Gemini client to prevent startup crashes if key is initially absent
  let ai: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("[WARNING] GEMINI_API_KEY environment variable is missing.");
      }
      ai = new GoogleGenAI({
        apiKey: apiKey || "",
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return ai;
  }

  // API endpoint for analyzing PDF & Excel document reports
  app.post("/api/analyze-document", async (req, res) => {
    try {
      const { fileData, mimeType, fileName } = req.body;
      
      if (!fileData || !mimeType) {
        return res.status(400).json({ 
          success: false, 
          error: "Dados do arquivo ou tipo mime ausentes." 
        });
      }

      console.log(`[API] Recebida solicitação de análise. Arquivo: "${fileName || 'Sem nome'}", MimeType: "${mimeType}"`);

      // Initialize Gemini Client
      const aiClient = getGeminiClient();

      const documentPart = {
        inlineData: {
          mimeType: mimeType,
          data: fileData,
        },
      };

      const promptInstructions = `Você é um leitor inteligente de extratos de investimentos e relatórios de Fundos Imobiliários (FIIs) brasileiros.
Analise minuciosamente as informações do documento anexado (que é uma tabela Excel/Planilha, extrato de B3/Corretora, extrato bancário ou relatório em PDF) para identificar a carteira de ativos do usuário.
Seu objetivo é extrair todas as posições de fundos imobiliários ativos de renda variável.

Você deve retornar uma estrutura JSON estrita contendo uma lista de ativos identificados. Cada ativo DEVE obrigatoriamente possuir os campos:
- symbol: Código do FII na B3 (composto de 4 letras maiúsculas e finalizando em 11 ou 11B, como MXRF11, HGLG11, BTLG11, KNRI11, CPTS11 etc.)
- quantity: Quantidade inteira de cotas que o investidor possui deste ativo. Se não conseguir achar no documento, use uma quantidade padrão fictícia de 10 cotas.
- averagePrice: Preço médio pago por cota em Reais (por exemplo 100.50, 9.80). Se não for fornecido de forma alguma, tente aproximar para um valor representativo ou use o preço padrão atual (ex: 100.00 para fundos de tijolo, 10.00 para base 10).

Filtre e retorne apenas FIIs reais (ignore ações, tesouro direto ou ativos não relacionados a FIIs se houver).
Retorne estritamente o array JSON conforme a chave correspondente sem tags de markdown adicionais.`;

      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [documentPart, promptInstructions],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                symbol: {
                  type: Type.STRING,
                  description: "Código do FII na B3 (Ex: HGLG11, MXRF11)",
                },
                quantity: {
                  type: Type.INTEGER,
                  description: "Quantidade total de cotas em carteira",
                },
                averagePrice: {
                  type: Type.NUMBER,
                  description: "Preço médio pago por cota em R$",
                },
              },
              required: ["symbol", "quantity", "averagePrice"],
            },
          },
        },
      });

      const extractedText = response.text;
      if (!extractedText) {
        throw new Error("A IA respondeu com um de extrato vazio.");
      }

      console.log(`[API] Gemini respondeu com sucesso:`, extractedText.substring(0, 150) + "...");
      const extractedAssets = JSON.parse(extractedText.trim());
      
      res.json({ 
        success: true, 
        assets: extractedAssets 
      });
    } catch (error: any) {
      console.error("[API Error] Falha de leitura de arquivos com IA:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Erro desconhecido ao processar o extrato com IA."
      });
    }
  });

  // Vite development integration or static files delivery in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[System] Servidor full-stack rodando na porta ${PORT}`);
  });
}

startServer();
