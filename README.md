# Brev.ly - Encurtador de URLs

Sistema completo de encurtamento de URLs com frontend React e backend Node.js.

## 🏗️ Estrutura do Projeto

```
brev-ly/
├── web/          # Frontend (React + Vite + Tailwind CSS)
├── server/       # Backend (Node.js + Fastify + PostgreSQL)
└── README.md
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 20+
- Docker & Docker Compose
- Git

### Backend (API)

```bash
cd server

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# Subir o banco de dados PostgreSQL
docker compose up -d

# Executar migrations
npm run db:migrate

# Iniciar o servidor de desenvolvimento
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

### Frontend (Web)

```bash
cd web

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## 📋 Funcionalidades

### Backend
- ✅ Criar link encurtado
- ✅ Listar links cadastrados
- ✅ Obter URL original por link encurtado
- ✅ Deletar link
- ✅ Incrementar contador de acessos
- ✅ Exportar links para CSV (Cloudflare R2)

### Frontend
- ✅ Formulário de cadastro de links
- ✅ Listagem de links cadastrados
- ✅ Copiar link encurtado
- ✅ Deletar link
- ✅ Contador de acessos
- ✅ Exportar CSV
- ✅ Página de redirecionamento
- ✅ Página 404 personalizada

## 🛠️ Tecnologias

### Backend
- Node.js + TypeScript
- Fastify
- Drizzle ORM
- PostgreSQL
- Cloudflare R2
- Docker

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

## 📝 Configuração de Portas

- **Frontend**: 5173
- **Backend**: 3000
- **PostgreSQL**: 5433

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais.

