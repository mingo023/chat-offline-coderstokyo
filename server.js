const express = require('express');
const cookieParser = require('cookie-parser');
const cookie = require('cookie');

const authRoutes = require('./routes/auth-route');
const authMiddleware = require('./middlewares/auth');

const db = require('./db/db');

const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.set('view engine', 'pug');

app.use(cookieParser('supperrrrrrsecret!!!'));

app.get('/', authMiddleware, (req, res) => {
  // console.log(req.user);
  res.render('chat', { messages: [{ person: 'fr', content: 'ahaha' }] });
});

app.use('/auth', authRoutes);

io.use((socket, next) => {
  socket.cookie = socket.handshake.headers.cookie.split(';')[0];
  // console.log(decodeURIComponent.)
  const userId = cookieParser.signedCookie(
    cookie.parse(socket.cookie).userId,
    'supperrrrrrsecret!!!'
  );

  socket.userId = userId;
  next();
}).on('connection', function(socket) {
  console.log('Connected');

  socket.on('send-message', data => {
    db.get('messages')
      .push({
        text: data.msg,
        user: socket.userId
      })
      .write();

    socket.broadcast.emit('send-message', {
      msg: data.msg,
      cookie: socket.cookie
    });
  });
});

http.listen(3001, () => console.log('Running'));
