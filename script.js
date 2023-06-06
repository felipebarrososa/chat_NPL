var chatButton = document.getElementById("chat-button");
var chatBox = document.getElementById("chat-box");
var closeButton = document.getElementById("close-button");
var sendButton = document.getElementById("send-button");
var inputField = document.querySelector("#chat-input input[type='text']");
var messagesContainer = document.getElementById("chat-messages");

var automaticReplies = {
  "ola": "Olá! Como posso ajudar?",
  "informacao": "Aguarde um momento, vou verificar essa informação para você.",
  "pergunta": "Desculpe, não entendi. Poderia reformular a pergunta?",
  "descobrir": "Essa é uma ótima pergunta! Vamos descobrir a resposta juntos.",
  "obrigado": "Obrigado por entrar em contato! Estou aqui para ajudar."
};

function toggleChat() {
  chatBox.classList.toggle("open");
}

function sendMessage() {
  var message = inputField.value.trim();

  if (message !== "") {
    createMessage("user", message);
    inputField.value = "";
    inputField.focus();
    setTimeout(sendAutomaticReply, 1000);
  }
}

function sendAutomaticReply() {
  var userMessage = getLastUserMessage();
  var reply = getAutomaticReply(userMessage);
  var decodedReply = decodeURIComponent(escape(reply));
  createMessage("bot", decodedReply);
}

function getLastUserMessage() {
  var messageElements = document.querySelectorAll(".user .message p");
  var lastMessageElement = messageElements[messageElements.length - 1];
  if (lastMessageElement) {
    return lastMessageElement.innerText.toLowerCase();
  }
  return "";
}

function getAutomaticReply(userMessage) {
    userMessage = userMessage.toLowerCase();
    for (var i = 0; i < automaticReplies.length; i++) {
      var keywords = automaticReplies[i].keywords;
      var reply = automaticReplies[i].reply;
      for (var j = 0; j < keywords.length; j++) {
        var keyword = keywords[j].toLowerCase();
        if (userMessage.includes(keyword)) {
          return reply;
        }
      }
    }
    return "Desculpe, não entendi. Poderia reformular a pergunta?";
  }
  

function createMessage(sender, content) {
  var messageContainer = document.createElement("div");
  messageContainer.classList.add("message", sender);

  var messageContent = document.createElement("p");
  messageContent.innerText = content;

  messageContainer.appendChild(messageContent);
  messagesContainer.appendChild(messageContainer);

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

chatButton.addEventListener("click", toggleChat);
closeButton.addEventListener("click", toggleChat);
sendButton.addEventListener("click", sendMessage);
inputField.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});
