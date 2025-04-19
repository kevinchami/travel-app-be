import {
  translateToEnglish,
  translateToHebrew,
  translateToSpanish,
} from '../services/translation.service.js';

export const translateQuery = async (req, res) => {
  const { query, lang } = req.body;

  if (!query || !lang) {
    return res.status(400).json({ error: 'Query and lang are required' });
  }

  try {
    let translatedText;
    switch (lang.toLowerCase()) {
      case 'en':
        translatedText = await translateToEnglish(query);
        break;
      case 'he':
        translatedText = await translateToHebrew(query);
        break;
      case 'es':
        translatedText = await translateToSpanish(query);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported language' });
    }

    return res.status(200).json({ translatedText });
  } catch (error) {
    console.error('❌ Error in translation:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const translateEnglish = async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Query is required' });

  try {
    const translatedText = await translateToEnglish(query);
    return res.status(200).json({ translatedText });
  } catch (error) {
    console.error('❌ Error in translateEnglish:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const translateHebrew = async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Query is required' });

  try {
    const translatedText = await translateToHebrew(query);
    return res.status(200).json({ translatedText });
  } catch (error) {
    console.error('❌ Error in translateHebrew:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const translateSpanish = async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Query is required' });

  try {
    const translatedText = await translateToSpanish(query);
    return res.status(200).json({ translatedText });
  } catch (error) {
    console.error('❌ Error in translateSpanish:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
