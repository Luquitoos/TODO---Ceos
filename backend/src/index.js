import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Conectar ao MongoDB
    await connectDB();
    
    // Iniciar servidor
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar servidor:', error.message);
    process.exit(1);
  }
};

startServer();
