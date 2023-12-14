import * as cron from 'node-cron';
import { makeCostcoSpecialOfferMessage } from './modules/costco.js'
import { sendHotDeal } from './modules/discord.js'

// run everyday at 3 p.m
cron.schedule('* * * * * *', async () => {
  main();
});

async function main () {
  const messageQueue = await makeCostcoSpecialOfferMessage();
  await sendHotDeal(messageQueue);
}
