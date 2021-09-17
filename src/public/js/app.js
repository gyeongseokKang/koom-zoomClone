const socket = io();

const welcomDiv = document.getElementById("welcome");
const form = welcomDiv.querySelector("form");

const room = document.getElementById("room");

room.hidden = true;

let roomName = "";
const showRoom = () => {
  welcomDiv.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#msg");
  const nameForm = room.querySelector("#name");
  msgForm.addEventListener("submit", handleMessageSubmit);
  nameForm.addEventListener("submit", handleNicknameSubmit);
};
const handleRoomSubmit = (event) => {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
};

const handleMessageSubmit = (event) => {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${input.value}`);
    input.value = "";
  });
};
const handleNicknameSubmit = (event) => {
  event.preventDefault();
  const input = room.querySelector("#name input");
  socket.emit("nickname", input.value);
};

const addMessage = (msg) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = msg;
  ul.appendChild(li);
};

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${user}someone joined!`);
});

socket.on("bye", (left, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${left}  left ㅜㅜ!`);
});

socket.on("new_message", (msg) => addMessage(msg));

socket.on("room_change", (rooms) => {
  if (rooms.length === 0) {
    roomList.innerHTML = "";
    return;
  }
  const roomList = welcomDiv.querySelector("ul");
  roomList.innerHTML = "";

  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.appendChild(li);
  });
});
