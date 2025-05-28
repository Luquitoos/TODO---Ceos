import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import { addToBlacklist } from './tokenBlacklistService.js'

// Chave secreta para JWT usando a do env
const JWT_SECRET = process.env.JWT_SECRET

// Registra um novo usuário
export const signup = async ({ email, password, name }) => {
  // Verifica se já existe usuário com este email
  const userExists = await User.findOne({ email })
  if (userExists) {
    throw new Error('Email já cadastrado')
  }

  // Cria usuário com senha criptografada
  const user = await User.create({
    email,
    name,
    password: await bcrypt.hash(password, 10)
  })

  // Retorna dados do usuário e token
  return formatUserResponse(user)
}

// Autentica um usuário existente
export const signin = async (email, password) => {
  // Busca usuário e valida senha
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('Usuário não encontrado')
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw new Error('Senha inválida')
  }

  // Retorna dados do usuário e token
  return formatUserResponse(user)
}

// Busca usuário por ID
export const getUserById = async (userId) => {
  try {
    // Busca o usuário e remove a senha do retorno por segurança
    const user = await User.findById(userId).select('-password')
    return user
  } catch (error) {
    if (error.kind === 'ObjectId') {
      throw new Error('ID de usuário inválido')
    }
    throw new Error('Erro ao buscar usuário')
  }
}

// Realiza logout seguro invalidando o token
export const logout = async (token) => {
  try {
    // Decodifica o token para obter informações (sem verificar se está válido)
    const decoded = jwt.decode(token)
    
    if (!decoded || !decoded.exp) {
      throw new Error('Token inválido para logout')
    }
    
    // Adiciona o token à blacklist com seu tempo de expiração
    addToBlacklist(token, decoded.exp)
    
    return {
      message: 'Logout realizado com sucesso',
      tokenInvalidated: true
    }
  } catch (error) {
    throw new Error('Erro ao realizar logout: ' + error.message)
  }
}

// Função auxiliar para formatar resposta do usuário
const formatUserResponse = (user) => ({
  id: user._id,
  email: user.email,
  name: user.name,
  token: jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' })
})