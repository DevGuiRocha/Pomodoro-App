# Pomodoro App

Este é um projeto simples, feito para desenvolver meu próprio Pomodoro do jeito que acho legal e interessante.

Um timer Pomodoro com lista de tarefas, tempos personalizáveis, temas e notificações — tudo salvo localmente no navegador, sem necessidade de backend.

## Tech Stack

- **[Next.js](https://nextjs.org/) 16** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS**
- Persistência via **localStorage** (sem backend)
- **Web Notification API** e **Web Audio API** (nativas do navegador)

## Funcionalidades

- ⏱️ **Timer Pomodoro** com três modos: Foco, Pausa Curta e Pausa Longa
- 🔁 **Ciclo automático** — ao terminar um foco vai para a pausa; após N focos (configurável), uma pausa longa
- ⏭️ **Pular ciclo** — avança para o próximo modo manualmente (com opção de contar, ou não, como ciclo concluído)
- ⚙️ **Tempos personalizáveis** — 3 presets prontos (Clássico 25/5/15, Curto 15/3/10, Estendido 50/10/20) ou valores próprios, além de definir quantos focos até a pausa longa
- ✅ **Lista de tarefas** — adicionar, concluir, remover e **reordenar por prioridade** (arrastar e soltar)
- 🎨 **Tema** — Claro, Escuro ou Sistema
- 🔔 **Notificações do navegador** ao terminar um ciclo (habilitáveis pelo usuário)
- ⌨️ **Atalhos de teclado** — `Espaço` (iniciar/pausar), `R` (resetar), `S` (pular)
- 💾 **Tudo persiste** entre sessões (tarefas, tempos, tema e preferências)
- 🔊 Alerta sonoro ao final de cada ciclo

## Como rodar localmente

Pré-requisitos: **Node.js 18+**.

```bash
# instalar dependências
npm install

# ambiente de desenvolvimento
npm run dev

# build de produção
npm run build && npm start
```

O app fica disponível em [http://localhost:3000](http://localhost:3000).

## Estrutura do projeto

```
src/
├── app/                  # App Router (layout, página, estilos globais)
├── components/
│   ├── PomodoroApp.tsx   # Orquestra estado, tema e layout geral
│   ├── Timer.tsx         # Display do timer, controles e atalhos
│   ├── TaskList.tsx      # Lista de tarefas com drag-and-drop
│   └── SettingsPanel.tsx # Modal de configurações (abas: Tempo / Tema / Notificações)
└── lib/                  # Hooks e lógica (timer, durações, tarefas, tema, etc.)
```

## Deploy

Otimizado para deploy na [Vercel](https://vercel.com/): basta importar o repositório — o Next.js é detectado automaticamente, sem configuração extra.

> ℹ️ As notificações exigem contexto seguro (HTTPS), o que a Vercel já provê. Em desenvolvimento, `localhost` também funciona.

## Autor

- Guilherme Rocha — [LinkedIn](https://www.linkedin.com/in/guilherme-rocha-828701b6/)
