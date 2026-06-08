# Deploy em Node.js

Este projeto usa TanStack Start. Por padrão, dentro do Lovable o build é feito
para Cloudflare, mas quando você **clona o projeto e roda na sua própria
infraestrutura**, ele é compilado para um **servidor Node.js standalone**
(preset `node-server` do Nitro, configurado em `vite.config.ts`).

## Pré-requisitos

- Node.js 20+ instalado
- As variáveis de ambiente do backend (veja abaixo)

## Passos

```bash
# 1. Instalar dependências
npm install

# 2. Gerar o build de produção (Node server)
npm run build

# 3. Iniciar o servidor
node .output/server/index.mjs
```

Por padrão o servidor sobe na porta `3000`. Para mudar:

```bash
PORT=8080 node .output/server/index.mjs
```

## Variáveis de ambiente

Crie um arquivo `.env` (ou configure no seu provedor) com:

```bash
# Públicas (expostas ao navegador)
VITE_SUPABASE_URL="https://<seu-projeto>.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="<sua-publishable-key>"
VITE_SUPABASE_PROJECT_ID="<seu-project-id>"

# Lado servidor (NÃO expor ao navegador)
SUPABASE_URL="https://<seu-projeto>.supabase.co"
SUPABASE_PUBLISHABLE_KEY="<sua-publishable-key>"
SUPABASE_SERVICE_ROLE_KEY="<sua-service-role-key>"
```

> As variáveis `VITE_*` são embutidas no bundle durante o `npm run build`,
> então precisam estar definidas **antes** de buildar. As demais são lidas em
> tempo de execução pelo servidor Node.

## Rodar com PM2 (opcional)

```bash
npm install -g pm2
pm2 start .output/server/index.mjs --name agua-quente-fria
pm2 save
```

## Docker (opcional)

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/.output ./.output
ENV PORT=3000
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```
