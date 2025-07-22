// const express = require('express');
// const bodyParser = require('body-parser');
// const mongodb = require('./data/database');
// require('dotenv').config();
// const app = express();

// const port = process.env.PORT || 8080;

// app.use(bodyParser.json());
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//   );
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   next();
// });
// app.use('/', require('./routes/index.js'));


// mongodb.initDb((err) => {
//     if(err) {
//         console.log(err);
//     }
//     else {
//         app.listen(port, () => {console.log(`Database is listening and node Running on port: ${port}`)});
//     }
// });

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const GithubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
require('dotenv').config();

const mongoDB = require('./data/database');
const app = express();
const port = process.env.PORT || 8080;

// ---------- PASSPORT GITHUB STRATEGY ----------
passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
}, function (accessToken, refreshToken, profile, done) {
  return done(null, profile);
}));

// ---------- SERIALIZACIÓN ----------
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// ---------- MIDDLEWARE ----------
app
  .use(bodyParser.json())
  .use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
  }))
  .use(passport.initialize())
  .use(passport.session())
  .use((req, res, next) => {
    console.log('📦 Session:', req.session);
    next();
  })
  .use(cors({ origin: '*', methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'] }))
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization'
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'POST, GET, PUT, PATCH, OPTIONS, DELETE'
    );
    next();
  })
  .use('/', require('./routes/index.js'));

// Ruta de inicio
// app.get('/', (req, res) => { res.send( req.session.user !== undefined ? `✅ Logged in as ${req.session.user.displayName}` : '🚫 Logged out')});
app.get('/', (req, res) => {
  res.send(
    req.session.user
      ? `✅ Logged in as ${req.session.user.displayName || req.session.user.username || 'Unknown'}`
      : '🚫 Logged out'
  );
});



// Ruta de autenticación con GitHub
app.get('/github', passport.authenticate('github'));

// Ruta de retorno de GitHub (callback)
app.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs',
    session: false,
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  });

// Ruta protegida (ejemplo)
app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'No autorizado' });
  }
});


// ---------- CONEXIÓN A MONGODB ----------
mongoDB.initDb((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(port, () => {
      console.log(`Database is listening and node Running on port ${port}`);
    });
  }
});
