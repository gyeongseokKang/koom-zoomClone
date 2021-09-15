const socket = new WebSocket(`ws://${window.location.host}`);

const chatLayout = document.querySelector("#chatLayout");
chatLayout.style.cssText = "display: flex;justify-content: center;align-items: center;flex-direction: column;";

const messageForm = document.querySelector("#message");

const nickForm = document.querySelector("#nick");

function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

socket.addEventListener("open", () => {
  console.log("connected to Server");
});

socket.addEventListener("message", async (message) => {
  let messagetext = "";
  if (typeof message.data === "string") {
    messagetext = message.data;
  } else {
    messagetext = await message.data.text();
  }
  if (messagetext.includes(nickForm.querySelector("input").value)) return;
  const div = document.createElement("div");
  div.innerText = messagetext;
  div.style.cssText = "display: flex;justify-content: flex-start;width : 100%";
  chatLayout.appendChild(div);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from server");
});

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value));
  const div = document.createElement("div");
  div.innerText = `You : ${input.value}`;
  div.style.cssText = "display: flex;justify-content: flex-end;width : 100%";

  chatLayout.appendChild(div);
  input.value = "";
}
function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
}
messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
