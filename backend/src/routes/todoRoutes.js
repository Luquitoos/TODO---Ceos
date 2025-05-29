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

 //PUT routes - toas para marcar todas as tarefas e validar a atualização de status dela nauquele id
 
router.put('/mark-all', todoController.markAllCompleted);
router.put('/:id', todoValidationRules.update, validateRequest, todoController.updateTodo);

//DELETE routes - serve para deletar todas as todos de uma vez e valida a atualizao de status dela naquele id

router.delete('/', todoController.deleteAllTodos);
router.delete('/:id', todoController.deleteTodo);

export default router;
