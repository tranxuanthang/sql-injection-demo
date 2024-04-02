const fastify = require('fastify')({ logger: true });
const path = require('path');
const sqlite3 = require('better-sqlite3');
const db = new sqlite3('./data.db');

// Create or reset database
db.exec('DROP TABLE IF EXISTS users; CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT);');
db.exec(`INSERT INTO users (username, password) VALUES ('admin', 'ThisIsAStrongPassword'), ('thang', '111111');`);

fastify.register(require('@fastify/view'), {
  engine: {
    ejs: require('ejs'),
  },
});

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
});

fastify.register(require('@fastify/formbody'));

fastify.register(require('@fastify/cookie'), {
  secret: "example", // Use an actual secret in production
});

let sessions = {};

function createSession(user) {
  const sessionId = Math.random().toString(36);
  sessions[sessionId] = user;
  return sessionId;
}

function getUserFromSession(request) {
  const sessionId = request.cookies.sessionId;
  return sessions[sessionId];
}

fastify.addHook('preHandler', async (request, reply) => {
  request.user = getUserFromSession(request);
});

fastify.get('/login', async (request, reply) => {
  return reply.view('/views/login.ejs', { error: '' });
});

fastify.post('/login', async (request, reply) => {
  const { username, password } = request.body;
  // Vulnerable to SQL injection
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  console.log('Query that will be executed:', query);

  const user = db.prepare(query).get();

  if (!user) {
    return reply.view('/views/login.ejs', { error: 'Invalid username or password.' });
  }

  const sessionId = createSession({ username: user.username }); // Assuming 'user' is obtained from DB
  return reply.setCookie('sessionId', sessionId, { path: '/', httpOnly: true }).redirect('/');
});

fastify.post('/logout', async (request, reply) => {
  // Assuming you have a simple sessionId-based session management
  const sessionId = request.cookies.sessionId;
  if (sessionId) {
    delete sessions[sessionId]; // Remove the user's session
    reply.clearCookie('sessionId', { path: '/' }); // Clear the session cookie
  }
  reply.redirect('/login');
});

fastify.get('/', async (request, reply) => {
  if (!request.user) {
    reply.redirect('/login');
  } else {
    const { username } = request.user;
    const isAdmin = username === 'admin';
    return reply.view('/views/dashboard.ejs', { username, isAdmin });
  }
});

// Run the server
fastify.listen({ host: '0.0.0.0', port: 3000 }, (err, address) => {
  if (err) throw err;
  console.log(`Server is now running on ${address}`);
});
