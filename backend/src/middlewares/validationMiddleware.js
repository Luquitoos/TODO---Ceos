import { body, validationResult } from 'express-validator'

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    // faz um verificação quando o usuario tentar criar a senha no registrar ela tem menos de 6 digitos
    const passwordError = errors.array().find(
      err => err.path === 'password' && err.msg === 'Digite uma senha igual ou superior a 6 digitos'
    )
    
    if (passwordError) {
      return res.status(400).json({
        message: 'Digite uma senha igual ou superior a 6 digitos',
        errors: errors.array()
      })
    }
    
    return res.status(400).json({
      message: 'Erro de validação',
      errors: errors.array()
    })
  }
  next()
}

export const authValidationRules = {
  signup: [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Digite uma senha igual ou superior a 6 digitos'),
    body('name').notEmpty().withMessage('Nome é obrigatório')
  ],
  signin: [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Senha é obrigatória')
  ]
}

export const todoValidationRules = {
  create: [
    body('title').notEmpty().trim().withMessage('Título é obrigatório'),
    body('description').notEmpty().trim().withMessage('Descrição é obrigatória')
  ],
  update: [
    body('title').optional().trim(),
    body('description').optional().trim(),
    body('completed').optional().isBoolean()
  ]
}
