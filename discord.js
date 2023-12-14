import URLS from './urls.js'
import Config from './config.js';

export async function sendHotDeal(messageQueue) {
  const mainChannelID = Config.channelID;
  let firstMessageID, threadChannelID;

  for (let i = 0; i < messageQueue.length; i++) {
    if (i == 0) { // send message to main channel
      const data = await sendMessageToChannel(mainChannelID, messageQueue[i]);
      firstMessageID = data.id;
    } else if (i == 1) { // make thread
      const threadName = '👉 할인 상품 더 보기';
      const data = await createMessageThread(mainChannelID, firstMessageID, threadName);
      threadChannelID = data.id;
      await sendMessageToChannel(threadChannelID, messageQueue[i]);
    } else { // send message to thread
      await sendMessageToChannel(threadChannelID, messageQueue[i]);
    }
  } 
}

async function sendMessageToChannel (channelID, content) {
  const url = URLS.DISCORD_MESSAGE_WITH_CHANNEL_ID(channelID);
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bot ${Config.token}`
  };
  const body = JSON.stringify({
    content
  });

  try {
    const response = await fetch(url, { method: 'POST', headers, body });
    const data = await response.json();

    return data;
  } catch (err) {
    console.error(err);
  }
}

async function createMessageThread (channelID, messageID, name) {
  const url = URLS.DISCORD_CREATE_MESSAGE_THREAD(channelID, messageID);
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bot ${Config.token}`
  };
  const body = JSON.stringify({
    name
  });

  try {
    const response = await fetch(url, { method: 'POST', headers, body });
    const data = await response.json();

    return data;
  } catch (err) {
    console.error(err);
  }
}