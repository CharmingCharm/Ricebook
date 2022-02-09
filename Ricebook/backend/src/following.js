const Profile = require('./model.js').Profile;

//get the list of users being followed by the requested user
const getFriends = (req, res) => {
    let username = req.params.user;
    if (!username) {
        username = req.username;
    }

    Profile.findOne({ username: username }).exec(function (err, profile) {
        if (err) {
            res.status(400).send({ Msg: err });
            return;
        }
        if (!profile) {
            res.status(404).send({ Msg: "No such logined user!" });
            return;
        }
        res.status(200).send({
            username: username,
            following: profile.following
        });
        return;
    })
}

const getFriendsHeadlines = (req, res) => {
    let username = req.params.user;
    if (!username) {
        username = req.username;
    }
    Profile.findOne({ username: username }).exec(function (err, profile) {
        if (err) {
            res.status(400).send({ Msg: err });
        }
        if (!profile) {
            res.status(404).send({ Msg: "No such logined user!" });
            return;
        }
        const following = profile.following;
        Profile.find({ username: { $in: following } }, function(err, profiles) {
            if (err) {
                res.status(400).send({ Msg: err });
                return;
            }
            res.status(200).send({ following: profiles });
        });
        return;
    })
}

const getHeadlinesByFollowing = (req, res) => {
    const following = req.body.following;
    Profile.find({ username: { $in: following } }, function(err, profiles) {
        if (err) {
            res.status(400).send({ Msg: err });
            return;
        }
        res.status(200).send({ following: profiles });
    });
}

//add :user to the following list for the logged in user
const addFriend = (req, res) => {
    let username = req.params.user;
    let loginUser = req.username;
    Profile.findOne({ username: username }).exec(function (err, profile) {
        if (err) {
            res.status(400).send({ Msg: err });
            return;
        }
        if (!profile) {
            res.status(404).send({ Msg: "No user is found!" });
            return;
        }
        Profile.findOneAndUpdate({ username: loginUser }, {
            $addToSet: {
                following: username
            }
        }, { new: true }, function (err, profile) {
            if (err) {
                res.status(400).send({ Msg: err });
                return;
            }
            res.status(200).send({
                username: loginUser,
                following: profile.following
            });
        });
    });
}


//remove :user to the following list for the logged in user
const deleteFriend = (req, res) => {

    let username = req.params.user;
    let loginUser = req.username;

    if (!username) {
        res.status(400).send({ Msg: "You need to provide a friend\'s name!" });
        return;
    }

    Profile.findOneAndUpdate({ username: loginUser }, {
        $pull: {
            following: username
        }
    }, { new: true }, function (err, profile) {
        if (err) {
            res.status(400).send({ Msg: err });
            return;
        }
        res.status(200).send({
            username: loginUser,
            following: profile.following
        });
    });
}


module.exports = (app) => {
    app.get("/following/:user?", getFriends);
    app.get("/followingH/:user?", getFriendsHeadlines);
    app.put("/following/:user", addFriend);
    app.post("/headlineF", getHeadlinesByFollowing);
    app.delete("/following/:user", deleteFriend);
}