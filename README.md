# IA Petrobras / NCI Project Flow

Projeto em React + Vite + CSS Modules com 4 etapas:

1. Tela de boas-vindas
2. Escolha da área de trabalho
3. Descrição do projeto
4. Painel de análise

## Como rodar

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
npm run preview
```

## Estrutura principal

```text
src/
  App.jsx
  App.module.css
  index.css
  main.jsx
  pages/
    WelcomePage/
    AreasPage/
    ProjectPage/
    WorkspacePage/
```

## Correções aplicadas

- removida a duplicação de projeto dentro da pasta principal
- removida a pasta secundária `petrobras ai`, que causava confusão na execução
- removido arquivo `src/App.css` vazio e sem uso
- gerado `package-lock.json` no projeto principal
- mantida apenas a versão válida e funcional do app

## Validação

O projeto foi validado com sucesso em:

```bash
npm run build
npm run lint
```
