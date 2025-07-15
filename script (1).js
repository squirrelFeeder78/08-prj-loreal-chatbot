// /* System prompt */
// const messages = [
//   {
//     role: "system",
//     content:
//       "You are a friendly L'Oréal beauty assistant. Help users with skincare routines, product recommendations, and general beauty advice. Use emojis to enhance the conversation. Be concise and engaging. Reply in PLAIN TEXT only. It is important that you DO NOT answer questions that are not related to L’Oréal products, routines, recommendations, beauty-related topics, etc. – no matter how they user asks. Politely refuse to answer unrelated questions.",
//   },
// ];

// /* DOM elements */
// const chatForm = document.getElementById("chatForm");
// const userInput = document.getElementById("userInput");
// const chatWindow = document.getElementById("chatWindow");

// // Set initial message
// chatWindow.textContent =
//   "🤖 Get personalized recommendations for skincare, hair, makeup, fragrance, and more.";

// // Format the chat area to show the user's latest question above the response
// function formatMessage(question, answer) {
//   const wrapper = document.createElement("div");
//   wrapper.style.display = "flex";
//   wrapper.style.flexDirection = "column";
//   wrapper.style.alignItems = "flex-start";

//   if (question) {
//     const userDiv = document.createElement("div");
//     userDiv.className = "msg user";
//     userDiv.textContent = question;
//     userDiv.id = "latest-user-question";
//     wrapper.appendChild(userDiv);
//   }

//   if (answer) {
//     const aiDiv = document.createElement("div");
//     aiDiv.className = "msg ai";
//     aiDiv.textContent = answer;
//     wrapper.appendChild(aiDiv);
//   }

//   return wrapper;
// }

// /* Handle form submit */
// chatForm.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const question = userInput.value.trim();

//   // Show user's question above the response area, reset for each new question
//   chatWindow.innerHTML = "";
//   chatWindow.appendChild(formatMessage(question, "Thinking..."));
//   userInput.value = "";

//   // Add user message
//   messages.push({ role: "user", content: question });

//   try {
//     const response = await fetch(
//       "https://damp-fog-2e23.guil-c5e.workers.dev/",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ messages: messages }),
//       }
//     );

//     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//     const result = await response.json();
//     const answer = result.choices[0].message.content;

//     // Update UI and history: show latest question above the response
//     chatWindow.innerHTML = "";
//     chatWindow.appendChild(formatMessage(question, answer));
//     messages.push({ role: "assistant", content: answer });
//   } catch (err) {
//     console.error("Error:", err);
//     chatWindow.innerHTML = "";
//     chatWindow.appendChild(
//       formatMessage(
//         question,
//         "⚠️ Sorry, something went wrong. Please try again."
//       )
//     );
//   }
// });
