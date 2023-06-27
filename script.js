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

    // Verifica se a mensagem está nas respostas automáticas pré-definidas
    if (automaticReplies.hasOwnProperty(message)) {
      var reply = automaticReplies[message];
      //showBotTyping();
      setTimeout(function () {
        createMessage("bot", reply);
      }, 1000);
    } else {
     // showBotTyping();
      sendToOpenAI(message);
    }
  }
}

function sendToOpenAI(message) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer SUA-CHAVE-API' // Chave de API do OpenAI
    },
    body: JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": [
        //{"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": message}
      ]
    })
  };

  showBotTyping(); // Mostra a animação antes de enviar a requisição

  fetch('https://api.openai.com/v1/chat/completions', options)
    .then((response) => response.json())
    .then((data) => {
      var reply = data.choices[0].message.content;
      createMessage("bot", reply); // Cria a mensagem do bot após receber a resposta
    })
    .catch((err) => {
      console.error(err);
    });
}


function showBotTyping() {
  var typingIndicator = document.createElement("div");
  typingIndicator.classList.add("message", "bot");

  var typingAnimation = document.createElement("div");
  typingAnimation.classList.add("typing-animation");

  for (var i = 0; i < 3; i++) {
    var dot = document.createElement("div");
    dot.classList.add("dot");
    typingAnimation.appendChild(dot);
  }

  typingIndicator.appendChild(typingAnimation);
  messagesContainer.appendChild(typingIndicator);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeBotTyping() {
  var typingIndicator = messagesContainer.querySelector(".typing-animation");
  if (typingIndicator) {
    typingIndicator.parentNode.remove();
  }
}

function createMessage(sender, content) {
  removeBotTyping();

  var messageContainer = document.createElement("div");
  messageContainer.classList.add("message", sender);

  var messageContent = document.createElement("p");
  messageContent.innerText = content;

  messageContainer.appendChild(messageContent);
  messagesContainer.appendChild(messageContainer);

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  // Verifica se o remetente é o bot e remove a animação de digitação
  if (sender === "bot") {
    removeBotTyping();
  }
}

chatButton.addEventListener("click", toggleChat);
closeButton.addEventListener("click", toggleChat);
sendButton.addEventListener("click", sendMessage);
inputField.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

inputField.value = "";
inputField.focus();
