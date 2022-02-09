const cookieKey = 'sid';
const cookieParser = require('cookie-parser');
const md5 = require('md5');
const redis = require('redis');


const User = require('./model.js').User;
const Profile = require('./model.js').Profile;

const redisPort = "redis://:p7c4637523188f74465966d26c1d5a117cb5b205cd663b2ee8ccc526a24b5ea94@ec2-174-129-0-248.compute-1.amazonaws.com:15259";
const redisClient = redis.createClient(redisPort);

redisClient.on('connect', function () {
    console.log("Redis connected!!");
})

const extraEncode = "CharmZhang";

const register = (req, res) => {
    const username = req.body.username;
    const displayname = req.body.displayname;
    const phone = req.body.phone;
    const email = req.body.email;
    const dob = req.body.dob;
    const zipcode = req.body.zipcode;
    const password = req.body.password;

    if (!username || !email || !dob || !zipcode || !password || !phone) {
        res.status(400).send({ Msg: "Please provide all the necessary information to register" });
        return;
    }

    User.find({ username: username }).exec(function (err, users) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        if (users.length > 0) {
            res.status(400).send({ Msg: "The username has been registered!" });
            return;
        }

        const salt = username + new Date().getTime();
        const hash = md5(password + salt);

        new User({
            username: username,
            salt: salt,
            hash: hash,
        }).save(function (err, user) {
            if (err) {
                res.status(400).send(err);
                return;
            }
        });
        new Profile({
            username: username,
            displayname: displayname,
            headline: "",
            following: [],
            email: email,
            phone: phone,
            dob: dob,
            zipcode: zipcode,
            avatar: "https://cdn-icons-png.flaticon.com/512/147/147144.png"
        }).save(function (err, profile) {
            if (err) {
                res.status(400).send(err);
                return;
            }
        })
        res.status(200).send({ result: "success", username: username });
        return;
    });
}



const login = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        res.status(400).send({ Msg: "You need to provide a username and password" });
        return;
    }

    User.findOne({ username: username }).exec(function (err, userObj) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        if (!userObj) {
            res.status(404).send({ Msg: "No user found!" });
            return;
        }
        const salt = userObj.salt;
        const hash = userObj.hash;

        if (md5(password + salt) !== hash) {
            res.status(400).send({ Msg: 'wrong password' });
            return;
        }
        
        const sessionKey = md5(extraEncode + new Date().getTime() + userObj.username);

        redisClient.hset("sessionUser", sessionKey, JSON.stringify(userObj));
        res.cookie(cookieKey, sessionKey, { maxAge: 3600 * 1000, httpOnly: true, sameSite: 'none', secure: true });
        res.status(200).send({ username: username, result: "success" });
        return;
    });
}


const isLoggedIn = (req, res, next) => {
    const sid = req.cookies[cookieKey];

    if (!sid) {
        return res.sendStatus(401);
    }
    
    redisClient.hget("sessionUser", sid, function(err, value) {
        if(err) {
            return res.sendStatus(401);
        }
        const userObj = JSON.parse(value);
        const username = userObj.username;
        if (username) {
            req.username = username;
            next();
        } else {
            res.sendStatus(401);
        }
    })

}


const logout = (req, res) => {
    const sid = req.cookies[cookieKey];
    redisClient.hdel("sessionUser", sid);
    redisClient.del("sessionUser");
    res.clearCookie(cookieKey);
    res.sendStatus(200);
}


//Changes the password for the logged in user.
const updatePassword = (req, res) => {
    const newPassword = req.body.password;
    const username = req.username;

    if (!newPassword) {
        res.status(400).send({ Msg: "You need to provide a password!" });
        return;
    }

    const newSalt = username + new Date().getTime();
    const newHash = md5(newPassword + newSalt);

    User.findOneAndUpdate({ username: username }, { $set: { salt: newSalt, hash: newHash } }, function (err, user) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        if (!user) {
            res.status(404).send({ Msg: "No matching user found" });
            return;
        }
        res.status(200).send({ username: username, result: "success" });
        return;
    });

}




module.exports = (app) => {
    app.post("/register", register);
    app.post("/login", login);
    app.use(isLoggedIn);
    app.put("/logout", logout);
    app.put("/password", updatePassword);
}
