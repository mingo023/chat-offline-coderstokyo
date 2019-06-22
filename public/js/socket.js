const socket = io('localhost:3001');
const cookie = document.cookie;

const boxMessages = document.querySelector('.middle-content');
const inputEl = document.querySelector('input');
const btnEl = document.querySelector('.submit');

function addMessage(message, person = 'me') {
  boxMessages.innerHTML += `
    <div class=${person}>
      <span>Dinamo Smith</span>
      <div class="chat-content">${message}</div>
      <small>02:05</small>
    </div>`;
}

btnEl.addEventListener('click', () => {
  const msg = inputEl.value;

  socket.emit('send-message', { msg });
  addMessage(msg);
  inputEl.value = '';
  boxMessages.scrollTo(0, 1000);
});

socket.on('send-message', data => {
  addMessage(data.msg, data.cookie === cookie ? 'me' : 'fr');
  boxMessages.scrollTo(0, 1000);
});
