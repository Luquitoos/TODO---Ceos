import * as authService from '../services/authService.js'

/*Controlador para registro de novos usuários com POST /auth/signup*/
export const signup = async (req, res) => {
  const { email, password, confirmPassword, name } = req.body

  // Validações de entrada
  if (!email || !password || !confirmPassword || !name) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' })
  }

  // Validação de formato de email básico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(422).json({ message: 'Email deve ter um formato válido' })
  }

  // Validação de senha mínima
  if (password.length < 6) {
    return res.status(422).json({ message: 'Digite uma senha igual ou superior a 6 digitos' })
  }

  // Verificar se o password que o usuario colocou é igual ao password de confirmação
  if (password !== confirmPassword) {
    return res.status(422).json({ message: 'A senha e a confirmação precisam ser iguais' })
  }

  try {
    const userData = await authService.signup({ email, password, name })
    // Modificado para retornar o token e os dados de usuário no mesmo formato do signin
    // para permitir login automático após o registro
    res.status(201).json({
      message: 'Usuário criado com sucesso',
      id: userData.id,
      email: userData.email,
      name: userData.name,
      token: userData.token,
      // Adicionar user para compatibilidade com o frontend
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email
      }
    })
  } 
  catch (error) {
    console.error('Erro no signup:', error)
    if (error.message.includes('já cadastrado')) {
      return res.status(422).json({ message: error.message })
    }
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

/* Controlador para login de usuários com POST /auth/signin */
export const signin = async (req, res) => {
  const { email, password } = req.body

  // Validações de entrada
  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' })
  }

  // Validação de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(422).json({ message: 'Email deve ter um formato válido' })
  }

  try {
    const userData = await authService.signin(email, password)
    // Modificado para incluir o objeto user para compatibilidade com o frontend
    res.status(200).json({
      message: 'Autenticação realizada com sucesso',
      id: userData.id,
      email: userData.email,
      name: userData.name,
      token: userData.token,
      // Adicionar user para compatibilidade com o frontend
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email
      }
    });
  } 
  catch (error) {
    console.error('Erro no signin:', error)
    if (error.message.includes('não encontrado') || error.message.includes('inválida')) {
      return res.status(401).json({ message: 'Credenciais inválidas' })
    }
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

/*Controlador para buscar usuário por ID com GET /auth/user/:id */
export const getUserById = async (req, res) => {
  const { id } = req.params

  // Validação de entrada
  if (!id) {
    return res.status(400).json({ message: 'ID do usuário é obrigatório' })
  }

  try {
    const user = await authService.getUserById(id)
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }
    
    res.status(200).json({ user })
  } 
  catch (error) {
    console.error('Erro ao buscar usuário:', error)
    
    // Tratamento específico para ID inválido
    if (error.message.includes('inválido') || error.message.includes('Falha na conversão para ObjectId')) {
      return res.status(400).json({ message: 'ID de usuário inválido' })
    }
    
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

/* Controlador para logout de usuários com POST /auth/logout */
export const logout = async (req, res) => {
  try {
    // Extrai o token do header Authorization
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    // Verifica se o token foi fornecido
    if (!token) {
      return res.status(400).json({ message: 'Token não fornecido para logout' })
    }

    // Chama o serviço de logout para invalidar o token
    const result = await authService.logout(token)
    
    res.status(200).json({
      message: result.message,
      tokenInvalidated: result.tokenInvalidated,
      note: 'Token invalidado com sucesso. Remova-o do armazenamento local.'
    });
    
  } catch (error) {
    console.error('Erro no logout:', error)
    
    // Tratamento específico para erros de token
    if (error.message.includes('Token inválido')) {
      return res.status(400).json({ message: 'Token inválido para logout' })
    }
    
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
}
