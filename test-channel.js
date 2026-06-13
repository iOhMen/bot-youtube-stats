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

async function testChannelConnection() {
  try {
    const response = await youtube.channels.list({
      part: ["snippet", "statistics"],
      mine: true,
    });

    const channel = response.data.items?.[0];

    if (!channel) {
      console.log("No se encontró ningún canal conectado.");
      return;
    }

    console.log("=====================================");
    console.log("Conexión exitosa con YouTube");
    console.log("Canal:", channel.snippet.title);
    console.log("Suscriptores:", channel.statistics.subscriberCount);
    console.log("Videos:", channel.statistics.videoCount);
    console.log("Vistas totales:", channel.statistics.viewCount);
    console.log("=====================================");
  } catch (error) {
    console.error("Error conectando con YouTube:");
    console.error(error.response?.data || error.message);
  }
}

testChannelConnection();