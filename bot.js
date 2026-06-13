const { google } = require("googleapis");
require("dotenv").config();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const youtube = google.youtube({
  version: "v3",
  auth: oauth2Client,
});

const VIDEO_ID = process.env.VIDEO_ID;
const DRY_RUN = process.env.DRY_RUN === "true";

function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-US");
}

async function updateVideoTitle() {
  try {
    if (!VIDEO_ID || VIDEO_ID === "PENDIENTE") {
      console.log("VIDEO_ID todavía está pendiente.");
      console.log("Cuando tengas el video subido, coloca el ID real en el archivo .env.");
      return;
    }

    const response = await youtube.videos.list({
      part: ["snippet", "statistics"],
      id: [VIDEO_ID],
    });

    const video = response.data.items?.[0];

    if (!video) {
      console.log("No se encontró el video. Revisa que el VIDEO_ID sea correcto.");
      return;
    }

    const snippet = video.snippet;
    const stats = video.statistics;

    const views = formatNumber(stats.viewCount);
    const likes = formatNumber(stats.likeCount);
    const comments = formatNumber(stats.commentCount);

    const newTitle = `Este video tiene ${views} vistas, ${likes} likes, ${comments} comentarios`;

    console.log("Título actual:");
    console.log(snippet.title);
    console.log("");
    console.log("Nuevo título:");
    console.log(newTitle);

    if (snippet.title === newTitle) {
      console.log("El título ya está actualizado. No se hizo ningún cambio.");
      return;
    }

if (DRY_RUN) {
  console.log("");
  console.log("MODO PRUEBA ACTIVADO.");
  console.log("No se cambió el título en YouTube.");
  console.log("Cuando quieras activar cambios reales, coloca DRY_RUN=false en .env");
  return;
}

await youtube.videos.update({
  part: ["snippet"],
  requestBody: {
    id: VIDEO_ID,
    snippet: {
      title: newTitle,
      description: snippet.description || "",
      tags: snippet.tags || [],
      categoryId: snippet.categoryId,
      defaultLanguage: snippet.defaultLanguage,
      defaultAudioLanguage: snippet.defaultAudioLanguage,
    },
  },
});

console.log("");
console.log("Título actualizado correctamente.");
  } catch (error) {
    console.log("Error actualizando el video:");
    console.log(error.response?.data || error.message);
  }
}

if (require.main === module) {
  updateVideoTitle();
}

module.exports = {
  updateVideoTitle,
};