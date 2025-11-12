// Elements
const input = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const chatArea = document.getElementById("chatArea");
const contacts = document.querySelectorAll(".contact");
const contactsList = document.getElementById("contactsList");

// Modal Elements
const newChatBtn = document.getElementById("newChatBtn");
const newChatModal = document.getElementById("newChatModal");
const newUserName = document.getElementById("newUserName");
const newUserImg = document.getElementById("newUserImg");
const cancelChat = document.getElementById("cancelChat");
const createChat = document.getElementById("createChat");

// Chat Data
let chats = {
  sofia: [
    { text: "Hi! How’s the project going?", sender: "them" },
    { text: "Good! Just finishing the tasks section.", sender: "me" }
  ],
  ali: [{ text: "Let's finish the UI tomorrow.", sender: "them" }],
  mira: [{ text: "See you tomorrow!", sender: "them" }],
  john: [{ text: "Did you send the file?", sender: "them" }],
  mike: [{ text: "Check the mail I sent...", sender: "them" }]
};

// Current chat
let currentUser = "sofia";

// Load chat messages
function loadChat() {
  chatArea.innerHTML = "";

  if (!chats[currentUser]) chats[currentUser] = [];

  chats[currentUser].forEach(msg => {
    const div = document.createElement("div");
    div.className = `msg ${msg.sender === "me" ? "outgoing" : "incoming"}`;
    div.textContent = msg.text;
    chatArea.appendChild(div);
  });

  chatArea.scrollTop = chatArea.scrollHeight;
}

// Send message
function sendMessage() {
  let text = input.value.trim();
  if (!text) return;

  chats[currentUser].push({ text, sender: "me" });
  input.value = "";
  loadChat();
}

// Send button & Enter key
sendBtn.onclick = sendMessage;
input.addEventListener("keypress", e => e.key === "Enter" && sendMessage());

// Contact switching
contacts.forEach(contact => {
  contact.onclick = () => {
    document.querySelector(".contact.active")?.classList.remove("active");
    contact.classList.add("active");
    currentUser = contact.dataset.user;
    loadChat();
  };
});

// New chat modal
newChatBtn.onclick = () => newChatModal.classList.remove("hidden");
cancelChat.onclick = () => newChatModal.classList.add("hidden");

// Create new chat
createChat.onclick = () => {
  const name = newUserName.value.trim();
  const img = newUserImg.value.trim() || `https://i.pravatar.cc/40?u=${name}`;

  if (!name) return;

  const id = name.toLowerCase().replace(/\s+/g, "_");

  if (!chats[id]) chats[id] = [];

  const div = document.createElement("div");
  div.className = "contact";
  div.dataset.user = id;
  div.innerHTML = `
    <img src="${img}">
    <div>
      <p class="name">${name}</p>
      <p class="last-msg">New chat</p>
    </div>
  `;

  div.onclick = () => {
    document.querySelector(".contact.active")?.classList.remove("active");
    div.classList.add("active");
    currentUser = id;
    loadChat();
  };

  contactsList.appendChild(div);

  newUserName.value = "";
  newUserImg.value = "";
  newChatModal.classList.add("hidden");

  div.click(); // Auto open chat
};

// Initial load
loadChat();
