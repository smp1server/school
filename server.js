const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const users = {}; // { username: password }
const posts = []; // { id, username, text, likes: Set, comments: [{username, text}] }
let postId = 1;
const followers = {}; // { username: Set of usernames they follow }

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Register endpoint
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (users[username]) {
    return res.send('Username already exists. <a href="/register.html">Try again</a>');
  }
  users[username] = password;
  res.cookie('username', username, { httpOnly: false });
  res.redirect('/');
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username] === password) {
    res.cookie('username', username, { httpOnly: false });
    res.redirect('/');
  } else {
    res.send('Invalid login. <a href="/login.html">Try again</a>');
  }
});

// Logout endpoint (optional, for completeness)
app.get('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/login.html');
});

// Add post endpoint
app.post('/post', (req, res) => {
  const username = req.cookies.username;
  if (!username || !users[username]) return res.status(401).send('Not logged in');
  const text = req.body.text;
  if (!text) return res.status(400).send('No post text');
  posts.push({ id: postId++, username, text, likes: new Set(), comments: [] });
  res.status(200).end();
});

// Like a post
app.post('/api/like/:id', (req, res) => {
  const username = req.cookies.username;
  const post = posts.find(p => p.id == req.params.id);
  if (!username || !post) return res.status(400).json({ error: 'Invalid' });
  post.likes.add(username);
  res.json({ success: true, likes: post.likes.size });
});

// Comment on a post
app.post('/api/comment/:id', (req, res) => {
  const username = req.cookies.username;
  const post = posts.find(p => p.id == req.params.id);
  const text = req.body.text;
  if (!username || !post || !text) return res.status(400).json({ error: 'Invalid' });
  post.comments.push({ username, text });
  res.json({ success: true, comments: post.comments });
});

// Get all posts (for index)
app.get('/api/posts', (req, res) => {
  // Convert Set to Array for likes
  res.json(posts.slice().reverse().map(p => ({
    ...p,
    likes: Array.from(p.likes)
  })));
});

// Get user profile and posts
app.get('/profile/:username', (req, res) => {
  const { username } = req.params;
  if (!users[username]) return res.status(404).send('User not found');
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// API: Get profile data
app.get('/api/profile/:username', (req, res) => {
  const { username } = req.params;
  if (!users[username]) return res.status(404).json({ error: 'User not found' });
  const userPosts = posts.filter(p => p.username === username).reverse().map(p => ({
    ...p,
    likes: Array.from(p.likes)
  }));
  const followerList = Array.from(followers[username] || []);
  res.json({ username, posts: userPosts, followers: followerList });
});

// API: Follow user
app.post('/api/follow/:username', (req, res) => {
  const follower = req.cookies.username;
  const followee = req.params.username;
  if (!follower || !users[follower] || !users[followee] || follower === followee) {
    return res.status(400).json({ error: 'Invalid follow' });
  }
  if (!followers[follower]) followers[follower] = new Set();
  followers[follower].add(followee);
  res.json({ success: true });
});

// Default route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});