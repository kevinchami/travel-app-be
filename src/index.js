import app from './app.js';
import { createSearchIndexes } from './utils/createSearchIndexes.js';

const PORT = process.env.PORT || '3001';

async function startServer() {
  try {
    await createSearchIndexes(); // Insert your async function here
  } catch (error) {
    console.error('Error creating search indexes:', error);
  }

  app.listen(PORT, () =>
    console.log(
      `==> 😎 Listening on port ${PORT}. Open http://localhost:${PORT} in your browser.`,
    ),
  );
}

startServer();
