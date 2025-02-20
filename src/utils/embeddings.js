import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';

dotenv.config();

// Inicializar el cliente Hugging Face para embeddings
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export const generateEmbedding = async text => {
  try {
    const response = await hf.featureExtraction({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      inputs: text,
    });

    return response;
  } catch (error) {
    console.error('❌ Error generando embedding:', error);
    return null;
  }
};
