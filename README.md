# TodoCEOs

## Sobre o Projeto

Este projeto foi desenvolvido como parte do processo seletivo para CEOs, implementando uma aplicação completa de gerenciamento de tarefas (TODO) com sistema de autenticação e interface web moderna.

## Requisitos Implementados

> Como na questão de Projetos da fase individual, foi exigido o desenvolvimento de uma aplicação REST. No entanto, nesta etapa, a aplicação está conectada a um frontend. As seguintes funcionalidades foram implementadas:

- ✅ **GET**: Visualizar a lista de TODO's já existentes
- ✅ **POST**: Criar um novo TODO
- ✅ **PUT**: Editar um TODO já existente
- ✅ **DELETE**: Eliminar um TODO da lista
- ✅ **Sign in / Sign up**: Sistema básico de login
- ✅ **Search Bar**: Campo que filtra os TODO's pelo nome
- ✅ **Clean Architecture**: Organização do projeto seguindo o padrão
- ✅ **Separação em camadas**: Model, Services, Controllers
- ✅ **Containerização**: Aplicação e banco de dados conteinerizados com Docker

## Equipe

- Adler Sebastian
- Bruno Aguiar
- Isabella Lelis
- Lucas Magalhães

## Tecnologias Utilizadas

### Backend
- **Node.js** com Express.js
- **MongoDB** (MongoDB Atlas)
- **JWT** para autenticação
- **Bcrypt** para hash de senhas
- **Docker** para containerização

### Frontend
- **Next.js 14** (React)
- **Tailwind CSS** para estilização
- **Heroicons** para ícones
- **Axios** para requisições HTTP
- **Docker** para containerização

## Estrutura do Projeto

```
TodoCEOs/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Controladores da aplicação
│   │   ├── models/         # Modelos de dados
│   │   ├── services/       # Lógica de negócio
│   │   ├── middleware/     # Middlewares
│   │   └── routes/         # Rotas da API
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/            # Páginas do Next.js
│   │   └── components/     # Componentes React
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yaml
└── README.md
```

## Configuração do Ambiente (ATUALMENTE DEIXEI OS ENVS NO GIT PARA FACILITAR A AVALIAÇÃO DOS MEMBROS DA CEOS, MAS IREI TIRAR)

### 1. Configuração do Backend

Crie um arquivo `.env` na pasta `backend/` com o seguinte conteúdo:

```env
# Configuração do Banco de Dados
MONGODB_URI="seu link do mongo db atlas"

# Configuração do Servidor
PORT=5000
NODE_ENV=development

# Segurança
JWT_SECRET="código de segurança (um token que você pode gerar em https://www.uuidgenerator.net/)"
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

### 2. Configuração do Frontend

Crie um arquivo `.env.local` na pasta `frontend/` com o seguinte conteúdo:

```env
# URL da API do backend para desenvolvimento local
NEXT_PUBLIC_API_URL=http://localhost:5000

# Configurações do Next.js
NEXT_TELEMETRY_DISABLED=1
```

## Como Executar o Projeto

### Opção 1: Execução Manual (Desenvolvimento)

#### Backend
```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Inicie o servidor
npm start
```

O backend estará disponível em: `http://localhost:5000`

#### Frontend
```bash
# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Faça o build da aplicação
npm run build

# Inicie o servidor
npm start
```

O frontend estará disponível em: `http://localhost:3000`

### Opção 2: Execução com Docker (Recomendado)

#### Pré-requisitos
- Docker instalado
- Docker Compose instalado

#### Comandos para execução

```bash
# Na raiz do projeto, construa e inicie os containers
docker-compose up --build

# Para executar em background
docker-compose up --build -d

# Para parar os containers
docker-compose down
```

Após executar os comandos:
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`

## Funcionalidades da Aplicação

### Autenticação
- **Cadastro de usuário**: Criação de nova conta
- **Login**: Autenticação com email e senha
- **Proteção de rotas**: Acesso restrito a usuários autenticados

### Gerenciamento de TODOs
- **Listar tarefas**: Visualização de todas as tarefas do usuário
- **Criar tarefa**: Adição de novas tarefas
- **Editar tarefa**: Modificação de tarefas existentes
- **Excluir tarefa**: Remoção de tarefas
- **Buscar tarefas**: Filtro por nome/título
- **Marcar como concluída**: Alteração do status da tarefa

## API Endpoints

### Autenticação
- `POST /api/auth/register` - Cadastro de usuário
- `POST /api/auth/login` - Login de usuário

### TODOs
- `GET /api/todos` - Listar todas as tarefas do usuário
- `POST /api/todos` - Criar nova tarefa
- `PUT /api/todos/:id` - Atualizar tarefa
- `DELETE /api/todos/:id` - Excluir tarefa

## Notas de Desenvolvimento

- A aplicação utiliza **Clean Architecture** com separação clara entre camadas
- O sistema de autenticação utiliza **JWT tokens**
- O banco de dados é **MongoDB Atlas** (cloud)
- A aplicação está totalmente **containerizada** para facilitar deploy
- O frontend utiliza **Server-Side Rendering** com Next.js
- Design responsivo implementado com **Tailwind CSS**

## Troubleshooting

### Problemas Comuns

1. **Erro de conexão com MongoDB**: Verifique se a string de conexão no `.env` está correta
2. **Erro de CORS**: Certifique-se de que as URLs no `.env` estão corretas
3. **Containers não iniciam**: Verifique se as portas 3000 e 5000 não estão em uso

### Logs dos Containers

```bash
# Ver logs do backend
docker-compose logs backend

# Ver logs do frontend
docker-compose logs frontend

# Ver logs de todos os serviços
docker-compose logs
```

