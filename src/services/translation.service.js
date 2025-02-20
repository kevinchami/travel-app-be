import translate from 'google-translate-api-x';

/**
 * Traduce un texto al inglés.
 * @param {string} query - Texto a traducir.
 * @returns {Promise<string>} - Texto traducido.
 */
export const translateToEnglish = async query => {
  try {
    const result = await translate(query, { to: 'en' });
    console.log(`🔄 Translated Query: ${query} → ${result.text}`);
    return result.text;
  } catch (error) {
    console.error('❌ Error translating query to English:', error);
    return query; // Si falla la traducción, usa la consulta original
  }
};

/**
 * Traduce un texto al hebreo.
 * @param {string} query - Texto a traducir.
 * @returns {Promise<string>} - Texto traducido.
 */
export const translateToHebrew = async query => {
  try {
    const result = await translate(query, { to: 'he' });
    console.log(`🔄 Translated Query: ${query} → ${result.text}`);
    return result.text;
  } catch (error) {
    console.error('❌ Error translating query to Hebrew:', error);
    return query;
  }
};

/**
 * Traduce un texto al español.
 * @param {string} query - Texto a traducir.
 * @returns {Promise<string>} - Texto traducido.
 */
export const translateToSpanish = async query => {
  try {
    const result = await translate(query, { to: 'es' });
    console.log(`🔄 Translated Query: ${query} → ${result.text}`);
    return result.text;
  } catch (error) {
    console.error('❌ Error translating query to Spanish:', error);
    return query;
  }
};
