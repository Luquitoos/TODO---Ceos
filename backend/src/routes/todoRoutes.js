import express from 'express';
import todoController from '../controllers/todoController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validateRequest, todoValidationRules } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// Aplicação do middleware de proteção a todas as rotas dos TODO's
// Middleware que protege rotas e adiciona dados do usuário à solicitação
router.use(protect);

// GET routes - rotas específicas antes das parametrizadas
router.get('/search', todoController.searchTodos);
router.get('/', todoController.getTodos);

// POST routes
// Aplicando validação na criação de TODO
router.post('/', todoValidationRules.create, validateRequest, todoController.createTodo);

/**
 * PUT routes
 * - IMPORTANTE: rotas específicas (/mark-all) devem vir ANTES das rotas com parâmetros (/:id)
 */
router.put('/mark-all', todoController.markAllCompleted);
router.put('/:id', todoValidationRules.update, validateRequest, todoController.updateTodo);

/**
 * DELETE routes
 * - IMPORTANTE: rotas específicas devem vir ANTES das rotas com parâmetros
 */
router.delete('/', todoController.deleteAllTodos);
router.delete('/:id', todoController.deleteTodo);

export default router;