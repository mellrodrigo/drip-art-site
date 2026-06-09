# Deploy na Hostinger — Vite React estático

Este projeto agora está na mesma estrutura do **NGHair-Landing**: Vite React
estático, com `index.html`, `src/main.tsx`, `src/App.tsx` e saída em `dist/`.

Ou seja: **não precisa PM2, servidor Node, `.output/`, Nginx proxy ou processo
rodando em background**. A Hostinger deve tratar como aplicação Vite/React.

---

## Configuração no importador Git da Hostinger

Use estas opções:

```text
Framework: Vite ou React
Node.js: 20.x
Install command: npm install
Build command: npm run build
Output directory: dist
Start command: deixar vazio / não usar
```

Se aparecer opção de **Static site**, use ela.

---

## Variáveis de ambiente

Configure antes do build:

```bash
VITE_SUPABASE_URL="https://<seu-projeto>.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="<sua-publishable-key>"
VITE_SUPABASE_PROJECT_ID="<seu-project-id>"
```

Este build é frontend estático. Não use `SUPABASE_SERVICE_ROLE_KEY` nele.

---

## Deploy manual por SSH, se preferir

```bash
git clone <url-do-seu-repositorio> agua-quente-fria
cd agua-quente-fria
nano .env
npm install
npm run build
```

Depois publique o conteúdo da pasta `dist/` no diretório público do site.

---

## Atualizar o site depois de mudanças

```bash
cd agua-quente-fria
git pull
npm install
npm run build
```

Depois suba novamente o conteúdo de `dist/`.

---

## Diferença para a versão anterior

Antes este projeto era **TanStack Start SSR**, então a Hostinger tentava detectar
um framework que ela não suporta bem no importador. Agora ele é **Vite React**,
igual ao NGHair-Landing, que a Hostinger reconhece normalmente.
