import mongoose from 'mongoose';

// conecté mongo con la nueva cuenta
export default async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to DB!');
  } catch (error) {
    console.error('DB Error: ', error);
  }

  // mongo con tu cuenta vieja
  /*
  const USER = process.env.DB_USER || '';
  const PASSWORD = process.env.DB_PASSWORD || '';
  const DB_NAME = process.env.DB_NAME;

  try {
    await mongoose.connect(
      `mongodb+srv://${USER}:${PASSWORD}@cluster0.79gwo.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
    );
    console.log('Connected to DB');
  } catch (error) {
    console.error('DB Error: ', error);
  }
*/
};
