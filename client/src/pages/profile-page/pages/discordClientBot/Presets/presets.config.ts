export default [
  {
    name: "Отправить сообщение",
    method: "post",
    endpoint: "channels/YOUR CHANNEL ID HERE/messages",
    body: "{\"content\": \"YOUR MESSAGE HERE\"}"
  },
  {
    name: "Поставить емодзи",
    method: "put",
    endpoint: "channels/CHANNEL ID/messages/MESSAGE ID/reactions/EMOJI/@me",
    body: "{}"
  },
  {
    name: "Убрать емодзи",
    method: "delete",
    endpoint: "/channels/CHANNEL ID/messages/MESSAGE ID/reactions/EMOJI/@me",
    body: "{}"
  }
];