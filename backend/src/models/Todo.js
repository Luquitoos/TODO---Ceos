import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'O título é obrigatório'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'A descrição é obrigatória'],
    trim: true
  },
  dueDate: {
    type: Date,
    required: false // não é obrigatório ter prazo
  },
  dueTime: {
    type: String,
    required: false,
    default: null
  },
  completed: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Todo = mongoose.model('Todo', todoSchema)

export default Todo
