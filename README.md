<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/2da32d69-f1fe-42ba-b233-a577db473c6b

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Build para produção

1. Execute:
   `npm run build`
2. Inicie o servidor gerado:
   `npm run start`
3. Abra o app em:
   `http://localhost:3000`

## Deploy em um host Node.js

- Use um serviço que suporte Node.js / Express, como Railway, Render, Heroku ou Fly.
- Garanta que a variável `GEMINI_API_KEY` esteja configurada no ambiente do host.
- O arquivo `Procfile` já está pronto para deploy em serviços que usam esse padrão.
