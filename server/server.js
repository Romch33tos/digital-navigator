import express from 'express';
import cors from 'cors';
import { Agent } from 'node:https';
import fs from 'fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';
import rateLimit from 'express-rate-limit';
import { GigaChat } from 'langchain-gigachat';
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/huggingface_transformers';
import { MemoryVectorStore } from '@langchain/classic/vectorstores/memory';
import { Document } from '@langchain/core/documents';

import { hybridSearch } from './utils/search.js';
import { rewriteQuery } from './utils/queryRewriter.js';

const PORT = process.env.PORT || 3001;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const TOP_K_RESULTS = 2;
const LLM_TEMPERATURE = 0.1;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());

const httpsAgent = new Agent({ rejectUnauthorized: false });

const llm = new GigaChat({
  credentials: process.env.GIGACHAT_AUTH_KEY,
  model: 'GigaChat-2',
  scope: 'GIGACHAT_API_PERS',
  httpsAgent,
  temperature: LLM_TEMPERATURE,
});

const embeddings = new HuggingFaceTransformersEmbeddings({
  model: 'Xenova/all-MiniLM-L6-v2',
});

const systemPromptTemplate = fs.readFileSync(
  path.join(__dirname, '..', 'prompts', 'system.txt'),
  'utf-8'
);

const chatLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX_REQUESTS,
  message: { answer: 'Слишком много запросов. Пожалуйста, подождите минуту и попробуйте снова.' },
  standardHeaders: true,
  legacyHeaders: false,
});

let vectorStore = null;

async function initRAG() {
  try {
    const rawData = fs.readFileSync(path.join(__dirname, 'knowledge.json'), 'utf-8');
    const items = JSON.parse(rawData);

    const chunks = items.map(item => {
      const aliasesText = (item.aliases || []).join(', ');
      const entitiesText = (item.entities || []).join(', ');
      
      const extraContext = [
        aliasesText && `Похожие запросы: ${aliasesText}`,
        entitiesText && `Связанные сущности: ${entitiesText}`,
      ].filter(Boolean).join('\n');

      return new Document({
        pageContent: `Вопрос: ${item.question}\n${extraContext}\nОтвет: ${item.answer}`.trim(),
        metadata: { 
          category: item.category, 
          question: item.question 
        },
      });
    });

    console.log(`[RAG] Загружено ${chunks.length} записей. Построение индекса...`);
    vectorStore = await MemoryVectorStore.fromDocuments(chunks, embeddings);
    console.log('[RAG] Индекс успешно построен.');
  } catch (error) {
    console.error('[RAG] Ошибка при инициализации:', error);
  }
}

initRAG();

app.post('/api/chat', chatLimiter, async (req, res) => {
  const { question, history } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ 
      answer: 'Не понял вопрос. Попробуйте переформулировать.' 
    });
  }

  if (!vectorStore) {
    return res.status(503).json({ 
      answer: 'База знаний еще загружается. Попробуйте через минуту.' 
    });
  }

  try {
    const searchQuery = await rewriteQuery(llm, question, history);
    console.log(`[Query Rewrite] "${question}" -> "${searchQuery}"`);

    const relevantDocs = await hybridSearch(vectorStore, searchQuery, TOP_K_RESULTS);
    const context = relevantDocs.map(doc => doc.pageContent).join('\n\n---\n\n');

    const systemPrompt = systemPromptTemplate.replace('{context}', context);

    const chatMessages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: question }
    ];

    const completion = await llm.invoke(chatMessages);

    res.json({ 
      answer: completion.content || 'Не удалось получить ответ.' 
    });
  } catch (error) {
    console.error('[GigaChat API Error]', error);
    res.status(500).json({ 
      answer: 'Ошибка при запросе к GigaChat. Проверьте подключение.' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`[Server] Сервер запущен на порту ${PORT}`);
});
