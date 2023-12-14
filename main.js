import * as cron from 'node-cron';
import { makeCostcoSpecialOfferMessage } from './modules/costco.js'
import { sendHotDeal } from './modules/discord.js'

const mode = process.argv.length > 2 ? process.argv.pop() : 'cron';

if (mode == 'cron') {
  // run everyday at 3 p.m
  cron.schedule('0 15 * * *', async () => {
    await main();
  });
} else if (mode == 'onetime') {
  await main(true);
}

async function main (onetime = false) {
  const messageQueue = await makeCostcoSpecialOfferMessage(onetime);
  await sendHotDeal(messageQueue);
}
