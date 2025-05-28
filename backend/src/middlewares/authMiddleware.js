import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import { isTokenBlacklisted } from '../services/tokenBlacklistService.js'

const JWT_SECRET = process.env.JWT_SECRET

/*
  Middleware que protege rotas e adiciona dados do usuário, além de verificar o token, também busca e adiciona os dados do usuário
  
  Como funciona:
  1. Extrai o token do cabeçalho Authorization
  2. Verifica se o token não está na blacklist (logout)
  3. Verifica se o token é válido usando JWT
  4. Busca o usuário no banco de dados
  5. Adiciona o usuário à requisição para uso nas rotas protegidas
 */
export const protect = async (req, res, next) => {
  try {
    // Extrai o token do header Authorization
    // O formato esperado é: "Bearer <token>"
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    // Verifica se o token foi fornecido
    if (!token) {
      return res.status(401).json({ message: 'Acesso negado! Token não fornecido.' })
    }

    // Verifica se o token está na blacklist
    if (isTokenBlacklisted(token)) {
      return res.status(401).json({ message: 'Token inválido. Realize login novamente.' })
    }

    // Verifica e decodifica o token
    // jwt.verify lança erro se o token for inválido ou expirado
    const decoded = jwt.verify(token, JWT_SECRET)
    
    // Busca o usuário no banco, excluindo o campo password
    // O -password é uma funcionalidade do mongoose para excluir campos sensíveis
    const user = await User.findById(decoded.id).select('-password')
    
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' })
    }

    // Adiciona o usuário à requisição para uso posterior nas rotas
    req.user = user
    req.token = token // Adiciona o token à requisição para uso no logout
    next()
  } 
  catch (error) {
    // Tratamento específico para diferentes tipos de erro JWT
    if (error.name === 'JsonWebTokenError') {
      // Token mal formatado ou assinatura inválida
      return res.status(400).json({ message: 'O Token é inválido' })
    }
    if (error.name === 'TokenExpiredError') {
      // Token expirado
      return res.status(401).json({ message: 'O Token expirou' })
    }
    // Outros erros de autenticação
    res.status(401).json({ message: 'Não autorizado: ' + error.message })
  }
}

/* 
  Middleware simplificado que apenas verifica se o token é válido, 
  servindo para rotas que precisam apenas confirmar que o usuário está autenticado, 
  sem necessidade de acessar dados do usuário 
*/
export const checkToken = (req, res, next) => {
  // Extrai o token do header Authorization
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado! Token não fornecido.' })
  }

  // Verifica se o token está na blacklist
  if (isTokenBlacklisted(token)) {
    return res.status(401).json({ message: 'Token inválido. Realize login novamente.' })
  }

  try {
    // Verifica se o token é válido
    const decoded = jwt.verify(token, JWT_SECRET)
    
    req.userId = decoded.id
    req.token = token
    
    // Se chegou aqui, token é válido
    next()
  } 
  catch (error) {
    // Tratamento de erros similar ao middleware protect
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'O Token é inválido' })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'O Token expirou' })
    }
    res.status(400).json({ message: 'Erro na verificação do token: ' + error.message })
  }
}