const URLS = {
  COSTCO_SEARCH_RESULT_PAGE: 'https://www.costco.co.kr/c/SpecialPriceOffers?itm_source=homepage&itm_medium=blueNav&itm_campaign=SpecialPriceOffers&itm_term=SpecialPriceOffers&itm_content=InternalCATSpecialPriceOffers',
  COSTCO_SPECIAL_OFFER_WITH_CODE: (code) => `https://www.costco.co.kr/rest/v2/korea/products/search?fields=FULL&query=&pageSize=100&sort=price-asc&category=${code}&lang=ko&curr=KRW`,
  DISCORD_MESSAGE_WITH_CHANNEL_ID: (channelID) => `https://discord.com/api/v10/channels/${channelID}/messages`,
  DISCORD_CREATE_MESSAGE_THREAD: (channelID, messageID) => `https://discord.com/api/v10/channels/${channelID}/messages/${messageID}/threads`
}

export default URLS;