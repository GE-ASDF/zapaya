async function getChatByNumberId(client,chatId){
    let chat = await client.getChatById(chatId);
    return chat;
}

module.exports = getChatByNumberId;