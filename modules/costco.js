import URLS from './urls.js';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

async function findSpecialOfferCode(onetime = false) {
  const url = URLS.COSTCO_SEARCH_RESULT_PAGE;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    const productListSlot = data.contentSlots.contentSlot.filter(slot => slot.slotId == 'ProductListSlot-ProductList')[0];
    const component = productListSlot.components.component.filter(component => component.uid == 'spobanner')[0];

    const $ = cheerio.load(component.content);
    const link = $('a')[0];
    const categoryUrl = $(link).attr('href');

    const match = categoryUrl.match(/\/([^/]*)$/);
    if (match) {
      return match[1];
    } else {
      console.log('No match found');
    }
  } catch (error) {
    console.error('Error fetching and parsing HTML:', error);
  }
}

export async function makeCostcoSpecialOfferMessage(onetimeall = false) {
  const code = await findSpecialOfferCode();
  const url = URLS.COSTCO_SPECIAL_OFFER_WITH_CODE(code);
  const headers = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  try {
    const response = await fetch(url, { method: 'GET', headers });
    const data = await response.json();

    let messageContent = `🗓️ ${formatDate(new Date)} 🎁 코스트코 스페셜 할인 도착! 🎁\n`;

    // only for under 100,000KRW, new products
    const products = data.products.filter(p => p.price.value < 100000 && (isToday(new Date(p.discountStartDate)) || onetimeall));

    const messageQueue = [];
    for (let i = 0; i < products.length; i++) {
      const discountStartDate = new Date(products[i].discountStartDate);
      const discountEndDate = new Date(products[i].discountEndDate);

      const formattedStartDate = formatDate(discountStartDate);
      const formattedEndDate = formatDate(discountEndDate);

      let newLine = `${i + 1}. [${products[i].name}](https://costco.co.kr${products[i].url}) | ~~${products[i].basePrice.formattedValue}~~ **${products[i].price.formattedValue}** (*${formattedStartDate}~${formattedEndDate}*)\n`;
      if (messageContent.length + newLine.length > 2000) {
        messageQueue.push(messageContent);
        messageContent = '';
      }
      messageContent += newLine;
    }
    return messageQueue;
  } catch (err) {
    console.error(err);
  }
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}/${month}/${day}`;
}


function isToday(date) {
  const today = new Date();

  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}