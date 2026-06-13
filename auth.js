const express = require("express");
const { google } = require("googleapis");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const scopes = [
  "https://www.googleapis.com/auth/youtube"
];

app.get("/", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });

  res.send(`
    <h2>Conectar bot con YouTube</h2>
    <p>Haz clic aquí para autorizar tu canal:</p>
    <a href="${authUrl}">Autorizar con Google</a>
  `);
});

app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.send("No se recibió ningún código de autorización.");
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    console.log("=====================================");
    console.log("TU REFRESH TOKEN ES:");
    console.log(tokens.refresh_token);
    console.log("=====================================");

    res.send(`
      <h2>Autorización completada</h2>
      <p>Revisa la terminal. Allí aparece tu REFRESH_TOKEN.</p>
      <p>No compartas ese token con nadie.</p>
    `);
  } catch (error) {
    console.error("Error obteniendo token:", error);
    res.send("Error obteniendo el token. Revisa la terminal.");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});