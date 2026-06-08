# Deploy em VPS (Node.js) — Hostinger

> **Importante:** este app é um **TanStack Start com SSR**, ou seja, ele roda
> como um **servidor Node.js** — não é um site estático. Por isso o assistente
> de "Criar Site / detectar framework" da Hostinger mostra
> *"Unsupported framework or invalid project structure"*: aquele fluxo espera
> arquivos estáticos. **Num VPS isso não acontece** — você mesmo sobe o
> servidor Node, sem detector de framework.

Ao rodar `npm run build` na sua própria infraestrutura, o projeto é compilado
para um **servidor Node.js standalone** (preset `node-server` do Nitro,
configurado em `vite.config.ts`).

---

## 1. Pré-requisitos no VPS

Acesse o VPS por SSH e instale o Node.js 20+:

```bash
# Instalar nvm e Node 20
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
node -v   # deve mostrar v20.x
```

Instale também o git (se ainda não tiver):

```bash
sudo apt update && sudo apt install -y git
```

---

## 2. Clonar e buildar o projeto

### Opção A — VPS por SSH (recomendado)

```bash
# Clonar o repositório
git clone <url-do-seu-repositorio> agua-quente-fria
cd agua-quente-fria

# Criar o arquivo de variáveis de ambiente (veja a seção 3)
nano .env

# Instalar dependências e gerar o build de produção
npm install
npm run build
```

O build gera a pasta `.output/` com o servidor Node pronto.

### Opção B — importador Git da Hostinger/hPanel

Se a tela mostrar **"Unsupported framework or invalid project structure"**, isso
é o detector automático da Hostinger não reconhecendo **TanStack Start**. O
projeto agora inclui `engines`, `main`, `.nvmrc` e script `start`, mas se o
detector ainda bloquear a seleção do repositório, use **Other** quando disponível
ou faça o deploy via **VPS por SSH** acima, que não depende desse detector.

Configurações manuais quando a Hostinger permitir continuar:

```text
Framework: Other
Node.js: 20.x
Build command: npm install && npm run build
Start command: npm run start
Entry file: .output/server/index.mjs
Output directory: .output
```

---

## 3. Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto **antes do build**:

```bash
# Públicas (embutidas no bundle durante o build)
VITE_SUPABASE_URL="https://<seu-projeto>.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="<sua-publishable-key>"
VITE_SUPABASE_PROJECT_ID="<seu-project-id>"

# Lado servidor (lidas em tempo de execução — NÃO expor ao navegador)
SUPABASE_URL="https://<seu-projeto>.supabase.co"
SUPABASE_PUBLISHABLE_KEY="<sua-publishable-key>"
SUPABASE_SERVICE_ROLE_KEY="<sua-service-role-key>"
```

> As variáveis `VITE_*` são **embutidas no build**, então precisam existir
> **antes** de rodar `npm run build`. As demais são lidas em tempo de execução.

---

## 4. Iniciar o servidor

```bash
# Teste rápido (porta padrão 3000)
node .output/server/index.mjs

# Em outra porta
PORT=8080 node .output/server/index.mjs
```

Acesse `http://SEU_IP:3000` para confirmar que está no ar.

---

## 5. Manter rodando com PM2 (recomendado)

```bash
npm install -g pm2

# Iniciar (lê o .env automaticamente da pasta do projeto)
pm2 start .output/server/index.mjs --name agua-quente-fria

# Subir junto com o servidor após reboot
pm2 startup
pm2 save
```

Comandos úteis:

```bash
pm2 logs agua-quente-fria   # ver logs
pm2 restart agua-quente-fria
pm2 stop agua-quente-fria
```

---

## 6. Nginx como reverse proxy (porta 80/443 + domínio)

Para servir no seu domínio com HTTPS, coloque o Nginx na frente do Node:

```bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/agua-quente-fria
```

Conteúdo:

```nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ativar e recarregar:

```bash
sudo ln -s /etc/nginx/sites-available/agua-quente-fria /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### HTTPS gratuito (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d seudominio.com -d www.seudominio.com
```

---

## 7. Atualizar o site depois de mudanças

```bash
cd agua-quente-fria
git pull
npm install
npm run build
pm2 restart agua-quente-fria
```

---

## Alternativa com Docker

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

```bash
docker build -t agua-quente-fria .
docker run -d -p 3000:3000 --env-file .env --name agua agua-quente-fria
```

---

## Não tem VPS?

Se você só tem **hospedagem compartilhada/estática** da Hostinger (sem Node.js),
o SSR não roda lá. Nesse caso:
- contrate um plano **VPS** da Hostinger (a partir do KVM 1), **ou**
- publique direto pelo botão **Publish** do Lovable, que hospeda o SSR
  automaticamente e permite conectar seu domínio próprio.
