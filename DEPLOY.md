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

## Deploy na Hostinger

A Hostinger não lista "TanStack Start" porque ele é um framework **Vite** que
gera um **servidor Node.js**. Então o deploy funciona — basta tratar como uma
aplicação **Node.js**, e NÃO como site estático.

### Passo a passo (hPanel → Node.js)

1. Em **Websites → Gerenciar → Aplicativo Node.js**, crie um novo app.
2. Em **Framework/Tipo**, escolha **"Other"** (ou Node.js genérico). Não escolha
   "Vite" puro, pois aquela opção espera um site estático sem servidor SSR.
3. **Versão do Node**: 20 ou superior.
4. **Arquivo de inicialização (startup file)**: `.output/server/index.mjs`
5. **Comando de build**: `npm install && npm run build`
6. **Comando de start**: `node .output/server/index.mjs`
7. Configure as variáveis de ambiente (mesma lista da seção acima) no painel,
   lembrando que as `VITE_*` precisam existir **antes** do build.

> A Hostinger define a porta automaticamente via variável `PORT` — o servidor
> Node já a respeita, então não fixe a porta manualmente.

Se o seu plano for de **hospedagem compartilhada estática** (sem suporte a
Node.js), o SSR não roda lá. Nesse caso use um plano **Cloud/VPS** da Hostinger
com Node.js, ou publique direto pelo botão **Publish** do Lovable.

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
