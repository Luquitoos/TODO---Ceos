import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
    });
    console.log(`Banco de Dados MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error ao conectar ao Banco de Dados: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;