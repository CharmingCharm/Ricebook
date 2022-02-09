const express = require("express");
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
const cors = require('cors');
const auth = require('./src/auth');
const profile = require('./src/profile');
const articles = require('./src/articles');
const following = require('./src/following');
const port = process.env.PORT || 3100;

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

var allowedOrigins = ['http://localhost:3000', 'https://qz40ricebook.surge.sh'];

app.use(cors({
     origin: allowedOrigins,
     methods: ['GET', 'PUT', 'POST', 'DELETE'],
     credentials: true,
     allowedHeaders: ['Content-Type', 'Authorization'],
     optionsSuccessStatus: 200,
}));

auth(app);
profile(app);
articles(app);
following(app);

// Get the port from the environment, i.e., Heroku sets it
const server = app.listen(port, () => {
     const addr = server.address();
     console.log(`Server listening at http://${addr.address}:${addr.port}`);
})

