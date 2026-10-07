# Auditor SEO Rápido - Documentación
**Realizado por: ESD Designs (www.esddesigns.es)**

¡Gracias por adquirir Auditor SEO Rápido! Esta es una herramienta SaaS ligera y moderna construida con Node.js, Express y Vanilla JS.

## Requisitos previos
Para ejecutar esta aplicación necesitas tener instalado **Node.js** en tu ordenador o servidor. Puedes descargarlo gratis desde [nodejs.org](https://nodejs.org/).

## Cómo ejecutarlo localmente

1. Descomprime el archivo `.zip` que acabas de descargar.
2. Abre una terminal (o consola de comandos) y navega hasta la carpeta donde has extraído los archivos.
3. Instala las dependencias necesarias ejecutando el siguiente comando:
   ```bash
   npm install
   ```
4. Inicia el servidor ejecutando:
   ```bash
   npm start
   ```
5. Abre tu navegador y visita: `http://localhost:3000`

## Cómo desplegarlo en un servidor público (Render.com)
Si quieres que tu herramienta sea accesible para cualquier persona en internet, te recomendamos usar Render.com (ofrece un plan gratuito).

1. Crea una cuenta en GitHub y sube los archivos de este proyecto a un nuevo repositorio (no subas la carpeta `node_modules`).
2. Crea una cuenta en [Render.com](https://render.com/).
3. Haz clic en **New** -> **Web Service**.
4. Conecta tu cuenta de GitHub y selecciona el repositorio de la aplicación.
5. Configura el despliegue con los siguientes datos:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Haz clic en "Create Web Service". ¡En unos minutos tendrás una URL pública funcionando!

---
*Para soporte técnico o dudas sobre desarrollo web, visita [esddesigns.es](https://www.esddesigns.es).*
