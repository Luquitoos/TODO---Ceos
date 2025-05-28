import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import { errorHandler } from './middlewares/errorMiddleware.js'

const app = express()

// Configuração CORS explícita
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://todo-ceos.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json())

// Adiciona middleware para debugar requisições
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.get('/', (req, res) => {
  res.json({
    message: 'API TODO está rodando com sucesso! 🚀',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// rotas
app.use('/auth', authRoutes)
app.use('/todos', todoRoutes)

// tratamento de erro
app.use(errorHandler)

export default app
