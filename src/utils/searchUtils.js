import { generateEmbedding } from './embeddings.js';
import { translateToEnglish } from './translation.js';

/**
 * 🔥 Genera un embedding y construye el pipeline para $vectorSearch en MongoDB
 * @param {string} query - Consulta del usuario
 * @param {number} top_k - Número de resultados deseados
 * @param {number} numCandidates - Número de candidatos iniciales (default 200)
 * @returns {Promise<Array>} - Pipeline de búsqueda listo para usar en MongoDB
 */
export const buildVectorSearchPipeline = async (
  query,
  indexName,
  top_k,
  numCandidates = 200,
) => {
  // const translatedQuery = await translateToEnglish(query);
  const embedding = await generateEmbedding(query);
  if (!embedding) return null;

  return [
    {
      $vectorSearch: {
        index: indexName,
        queryVector: embedding,
        path: 'embedding',
        numCandidates,
        limit: top_k,
      },
    },
  ];
};
