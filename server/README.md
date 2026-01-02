# Brev.ly Server

Backend API para o encurtador de URLs Brev.ly.

## 🚀 Executar em Desenvolvimento

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# Subir apenas o PostgreSQL
docker compose up pg -d

# Executar migrations
npm run db:migrate

# Iniciar o servidor
npm run dev
```

## 🐳 Executar com Docker

### Opção 1: Apenas o PostgreSQL (desenvolvimento)

```bash
docker compose up pg -d
```

### Opção 2: PostgreSQL + Aplicação (produção)

```bash
# Construir a imagem
docker build -t brevly-server:latest .

# Ou subir tudo com docker-compose
docker compose up -d
```

A API estará disponível em `http://localhost:3000`

## 📋 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento com hot-reload
- `npm run build` - Build para produção
- `npm run start` - Executar build de produção
- `npm run db:generate` - Gerar migrations do Drizzle
- `npm run db:migrate` - Executar migrations
- `npm run db:studio` - Abrir Drizzle Studio

## 🛠️ Tecnologias

- **Node.js** + **TypeScript**
- **Fastify** - Framework web
- **Drizzle ORM** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados
- **Cloudflare R2** - Storage para CSV exports
- **Docker** - Containerização

## 📝 Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://docker:docker@localhost:5433/brevly

CLOUFARE_ACCOUNT_ID=your_account_id
CLOUDFARE_ACCESS_KEY_ID=your_access_key_id
CLOUDFARE_SECRET_KEY_ID=your_secret_key_id
CLOUDFARE_BUCKET=your_bucket_name
CLOUDFARE_URL_BUCKET=https://your-bucket-url.r2.cloudflarestorage.com
```

## 🔌 Endpoints da API

### Links

- `POST /links` - Criar link
- `GET /links` - Listar links (com paginação)
- `GET /links/:shortenedUrl` - Obter link por URL encurtada
- `DELETE /links/:shortenedUrl` - Deletar link
- `PATCH /links/:shortenedUrl/access` - Incrementar contador de acessos
- `POST /links/export` - Exportar links para CSV

### Documentação

- `GET /docs` - Swagger UI com documentação interativa

## 🏗️ Estrutura

```
server/
├── src/
│   ├── app/
│   │   └── functions/          # Lógica de negócio
│   ├── infra/
│   │   ├── db/                 # Database e migrations
│   │   ├── http/               # Rotas HTTP
│   │   ├── storage/            # Cloudflare R2
│   │   └── utils/              # Utilidades
│   └── env.ts                  # Validação de env vars
├── docker/
│   └── init.sql                # SQL de inicialização
├── Dockerfile
└── docker-compose.yml
```

