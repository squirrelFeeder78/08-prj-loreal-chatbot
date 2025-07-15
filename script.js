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

// Track user context (name and past questions)
let userContext = {
  name: null,
  questions: [],
};

// Show initial greeting (bot first, then blank line for spacing)
chatWindow.innerHTML = "";
addMessage(
  "👋 Hello! How can I help you with L'Oréal products or routines today?",
  "ai"
);
const initialSpacer = document.createElement("div");
initialSpacer.style.height = "6px";
chatWindow.appendChild(initialSpacer);

// Function to add a message to the chat window
function addMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `msg ${sender}`;
  msgDiv.textContent = text;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Helper: Try to extract a name from user input (very basic)
function extractName(text) {
  // Look for "my name is ..." or "I'm ..." or "I am ..."
  const nameMatch = text.match(/(?:my name is|i'm|i am)\s+([a-zA-ZÀ-ÿ'\- ]+)/i);
  if (nameMatch) {
    return nameMatch[1].trim().split(" ")[0]; // Use first word as name
  }
  return null;
}

// Handle form submit
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get user input and clear the input box
  const userText = userInput.value.trim();
  if (!userText) return;
  userInput.value = "";

  // Remove any previous displayed user question (if present)
  const prevUserQ = document.getElementById("latest-user-question");
  if (prevUserQ) {
    chatWindow.removeChild(prevUserQ);
  }

  // Display the user's latest question just above the response
  const latestQDiv = document.createElement("div");
  latestQDiv.className = "msg user";
  latestQDiv.id = "latest-user-question";
  latestQDiv.textContent = userText;
  chatWindow.appendChild(latestQDiv);

  // Track user's question
  userContext.questions.push(userText);

  // Try to extract user's name if not already known
  if (!userContext.name) {
    const possibleName = extractName(userText);
    if (possibleName) {
      userContext.name = possibleName;
    }
  }

  // Add a blank line for spacing (optional, for extra clarity)
  const spacer = document.createElement("div");
  spacer.style.height = "6px";
  chatWindow.appendChild(spacer);

  // Show loading message on a new line (always after user's message)
  const loadingMsg = document.createElement("div");
  loadingMsg.className = "msg ai";
  loadingMsg.textContent = "Thinking...";
  chatWindow.appendChild(loadingMsg);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  // Add user message to messages array
  messages.push({ role: "user", content: userText });

  try {
    // Send request to OpenAI API
    // Add context instructions for the assistant
    let contextInstruction = "";
    if (userContext.name) {
      contextInstruction += `The user's name is ${userContext.name}. `;
    }
    if (userContext.questions.length > 1) {
      contextInstruction += `Here are the user's previous questions: ${userContext.questions
        .slice(0, -1)
        .join(" | ")}. `;
    }
    if (contextInstruction) {
      // Insert as a system message just before the user's message
      const contextMsg = { role: "system", content: contextInstruction };
      // Copy messages, insert context before last user message
      const messagesWithContext = messages
        .slice(0, -1)
        .concat([contextMsg, messages[messages.length - 1]]);
      var payloadMessages = messagesWithContext;
    } else {
      var payloadMessages = messages;
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: payloadMessages,
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

    // Add AI reply to chat window, just below the latest user question
    const aiMsgDiv = document.createElement("div");
    aiMsgDiv.className = "msg ai";
    aiMsgDiv.textContent = aiReply;
    chatWindow.appendChild(aiMsgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // Add AI reply to messages array
    messages.push({ role: "assistant", content: aiReply });
  } catch (error) {
    // Remove loading message
    chatWindow.removeChild(loadingMsg);
    addMessage("Sorry, there was a problem connecting to the assistant.", "ai");
  }
});
