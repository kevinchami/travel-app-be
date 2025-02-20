import translate from 'google-translate-api-x';

export const translateToEnglish = async query => {
  try {
    const result = await translate(query, { to: 'en' });
    console.log(`🔄 Translated Query (EN): ${query} → ${result.text}`);
    return result.text;
  } catch (error) {
    console.error('❌ Error translating query to English:', error);
    return query; // If translation fails, return original query
  }
};

export const translateToHebrew = async query => {
  try {
    const result = await translate(query, { to: 'he' });
    console.log(`🔄 Translated Query (HE): ${query} → ${result.text}`);
    return result.text;
  } catch (error) {
    console.error('❌ Error translating query to Hebrew:', error);
    return query;
  }
};

export const translateToSpanish = async query => {
  try {
    const result = await translate(query, { to: 'es' });
    console.log(`🔄 Translated Query (ES): ${query} → ${result.text}`);
    return result.text;
  } catch (error) {
    console.error('❌ Error translating query to Spanish:', error);
    return query;
  }
};
