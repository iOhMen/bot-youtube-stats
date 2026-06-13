const cron = require("node-cron");
require("dotenv").config();

const { updateVideoTitle } = require("./bot");

const intervalMinutes = Number(process.env.UPDATE_INTERVAL_MINUTES || 15);

console.log("=====================================");
console.log("Bot automático iniciado");
console.log(`El video se revisará cada ${intervalMinutes} minutos`);
console.log("Presiona CTRL + C para detenerlo");
console.log("=====================================");

updateVideoTitle();

cron.schedule(`*/${intervalMinutes} * * * *`, async () => {
  await updateVideoTitle();
});