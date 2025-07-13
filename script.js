// Get DOM elements
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// System prompt: Only answer questions about L'Oréal products, routines, and recommendations
const systemPrompt = {
  role: "system",
  content:
    "You are a helpful assistant for L'Oréal. Only answer questions related to L'Oréal products, beauty routines, and recommendations. If a question is not about L'Oréal, politely explain that you can only help with L'Oréal-related topics.",
};

// Store chat history (messages)
let messages = [systemPrompt];

// Show initial greeting
chatWindow.innerHTML =
  '<div class="msg ai">👋 Hello! How can I help you with L\'Oréal products or routines today?</div>';

// Function to add a message to the chat window
function addMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `msg ${sender}`;
  msgDiv.textContent = text;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Handle form submit
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get user input and clear the input box
  const userText = userInput.value.trim();
  if (!userText) return;
  userInput.value = "";

  // Add user message to chat window
  addMessage(userText, "user");

  // Add user message to messages array
  messages.push({ role: "user", content: userText });

  // Show loading message
  const loadingMsg = document.createElement("div");
  loadingMsg.className = "msg ai";
  loadingMsg.textContent = "Thinking...";
  chatWindow.appendChild(loadingMsg);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  try {
    // Send request to OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messages,
        max_tokens: 300,
      }),
    });

    const data = await response.json();

    // Get the assistant's reply
    const aiReply =
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content
        ? data.choices[0].message.content.trim()
        : "Sorry, I couldn't get a response. Please try again.";

    // Remove loading message
    chatWindow.removeChild(loadingMsg);

    // Add AI reply to chat window
    addMessage(aiReply, "ai");

    // Add AI reply to messages array
    messages.push({ role: "assistant", content: aiReply });
  } catch (error) {
    // Remove loading message
    chatWindow.removeChild(loadingMsg);
    addMessage("Sorry, there was a problem connecting to the assistant.", "ai");
  }
});
