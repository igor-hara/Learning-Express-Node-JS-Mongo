import express from 'express';
import morgan from 'morgan';

// import usersRouter from './routes/users.js';
// import productsRouter from './routes/products.js';
import routes from './routes/index.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import '../src/strategies/local-strategy.js';

import { users } from './utils/helpers.js';


const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
    secret: `${process.env.SESSION_SECRET}`,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60
    }
  }
));
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

const PORT = process.env.PORT || 3000;

app.post('/api/auth', passport.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

app.get('/api/auth/status', (req, res) => {
  console.log('req user ', req.user);
  // see object how user and passport are connected (stores and connects user id into passport)
  console.log('session user ', req.session);
  return req.user ? res.send(req.user) : res.sendStatus(401);
});

app.post('/api/auth/logout', (req, res) => {
  // check user is logged in
  if (!req.user) return res.sendStatus(401);

  req.logout(err => {
    if (err) return res.sendStatus(400);

    // Uništi sesiju
    req.session.destroy(err => {
      if (err) return res.sendStatus(500);
      console.log('Session destroyed');

      // Očisti cookie sesije iz browsera
      res.clearCookie('connect.sid', { path: '/' });

      console.log('User logged out and session destroyed');
      res.sendStatus(200);
    });
  });

});

app.get('/', (req, res) => {

  console.log(req.session);
  console.log(req.session.id);
  // tracks user with this session id
  req.session.visited = true;
  res.cookie('my-cookie', 'test', { maxAge: 60000 * 60 });
  res.send('Hello World!');
});

// Session part 2. session exercise, example for Auth
// app.post('/api/auth', (req, res) => {
//   const { name, password } = req.body;
//
//   // TODO: validate username and password
//
//   const findUser = users.find(user => user.name === name && user.password === password);
//
//   // console.log('findUser', findUser);
//   if (!findUser) {
//     return res.sendStatus(401).send({ msg: 'Invalid username or password' });
//   }
//   req.session.user = findUser;
//   return res.status(200).send(findUser);
// });

// check if user is logged in
// app.get('/api/auth/status', (req, res) => {
//
//   // show i.e. map users from sessionStore
//   req.sessionStore.get(req.sessionID, (err, session) => {
//     console.log('user-session: ', session);
//   });
//
//   return req.session.user ? res.status(200).send(req.session.user) : res.status(401).send({ msg: 'Not Authenticated' });
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// PUT - updates every single field
// PATCH - update specific property of an user, product like username or price
// DELETE
