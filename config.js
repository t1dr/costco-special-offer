import dotenv from "dotenv";
dotenv.config();

const Config = {
  appID: process.env.APP_ID, // not needed for this project
  token: process.env.DISCORD_TOKEN,
  publicKey: process.env.PUBLIC_KEY, // not needed for this project
  channelID: process.env.CHANNEL_ID
}

export default Config;