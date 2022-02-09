const { Profile } = require('./model.js');
const parseFD = require('./picUpload');

const getUserName = (req, res) => {
    let username = req.username;
    if(!username) {
        res.status(200).send({ username: null });
        return;
    }
    Profile.findOne({ username: username }).exec(function (err, profile) {
        if (err) {
            res.status(400).send({ Msg: err });
            return;
        }
        if (!profile) {
            res.status(404).send({ Msg: "No matching user found for getUserName" });
            return;
        }
        res.status(200).send({ username: username });
        return;
    });
}

//Get the headline for a user
const getHeadline = (req, res) => {
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
            res.status(404).send({ Msg: "No matching user found for getHeadline" });
            return;
        }
        res.status(200).send({ username: username, headline: profile.headline });
        return
    })
}

//Update the headline for the logged in user
const updateHeadline = (req, res) => {
    const username = req.username;
    const headline = req.body.headline;
    if (!username) {
        res.status(400).send({ Msg: "No username given" });
        return;
    }
    if (!headline) {
        res.status(400).send({ Msg: "Please provide a non-empty headline" });
        return;
    }
    Profile.findOneAndUpdate({ username: username }, { $set: { headline: headline } }, function (err, profile) {
        if (err) {
            res.status(400).send({ Msg: err });
            return;
        }
        res.status(200).send({ username: username, headline: headline });
        return;
    });
}

//Get the DisplayName for a user
const getDisplayName = (req, res) => {
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
            res.status(404).send({ Msg: "No matching user found for getHeadline" });
            return;
        }
        res.status(200).send({ username: username, displayname: profile.displayname });
        return
    })
}

//Update the DisplayName for the logged in user
const updateDisplayName = (req, res) => {
    let username;
    const displayName = req.body.displayname;
    if (!req.body.username) {
        username = req.username;
    } else {
        username = req.body.username;
    }

    Profile.findOneAndUpdate({ username: username }, { $set: { displayname: displayName } }, function (err, profile) {
        if (err) {
            res.status(400).send({ Msg: err });
            return;
        }
        res.status(200).send({ username: username, displayname: displayName });
        return;
    });
}

//get the avatar of the user
const getAvatar = (req, res) => {
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
            res.status(404).send({ Msg: "Didn't find the logged-in user's matching profile" });
            return;
        }
        res.status(200).send({ username: username, avatar: profile.avatar });
        return;
    });
}

//update the avatar of the user
const updateAvatar = (req, res) => {
    const username = req.username;
    let avatar = req.fileurl;
    if (!avatar) {
        res.status(400).send({ Msg: "You need to provide a avatar!" });
        return;
    }
    Profile.findOneAndUpdate({ username: username }, { $set: { avatar: avatar } }, function (err, profile) {
        if (err) {
            res.status(400).send({ Msg: err });
            return;
        }
        res.status(200).send({ username: username, avatar: avatar });
        return;
    })
}

//get the email address for the requested user
const getEmail = (req, res) => {
    let username = req.params.user;
    if (!username) {
        username = req.username;
    }

    // let username = req.username          //get the logged-in user's name 

    Profile.findOne({ username: username }).exec(function (err, profile) {
        if (err) {
            res.status(400).send({ Msg: err });
            return;
        }
        if (!profile) {
            res.status(404).send({ Msg: "No matching user found" });
            return;
        }
        res.status(200).send({ username: username, email: profile.email });
        return;
    })
}

//update the email addres for the logged in user
const updateEmail = (req, res) => {
    let email = req.body.email;
    if (!email) {
        res.status(400).send({ Msg: "You need to provide a email!" });
        return;
    }
    Profile.findOneAndUpdate({ username: req.username }, { $set: { email: email } }, function (err, profile) {
        if (err) {
            res.status(400).send({ Msg: err });
            return;
        }
        res.status(200).send({ username: req.username, email: email });
        return
    });
}

//get the zipcode for the requested user
const getZipcode = (req, res) => {
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
            res.status(404).send({ Msg: "No matching user found" });
            return;
        }
        res.status(200).send({ username: username, zipcode: profile.zipcode });
        return;
    });
}

//update the zipcode for the logged in user
const updateZipcode = (req, res) => {
    let zipcode = req.body.zipcode;
    if (!zipcode) {
        res.status(400).send("You need to provide a zipcode!")
        return;
    }
    Profile.findOneAndUpdate({ username: req.username }, { $set: { zipcode: zipcode } }, function (err, profile) {
        if (err) {
            res.status(400).send({ Msg: err });
            return;
        }
        res.status(200).send({ username: req.username, zipcode: zipcode });
        return;
    });
}


//get the date of birth in milliseconds for the requested user
const getDob = (req, res) => {
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
            res.status(404).send({ Msg: "No matching user found" });
            return;
        }
        res.status(200).send({ username: username, dob: profile.dob });
        return;
    });
}

//update the Dob for the logged in user
const updateDob = (req, res) => {
    let dob = req.body.dob;
    if (!dob) {
        res.status(400).send("You need to provide a birthday!")
        return
    }
    Profile.findOneAndUpdate({ username: req.username }, { $set: { dob: dob } }, function (err, profile) {
        if (err) {
            res.status(400).send({ Msg: err });
            return;
        }
        res.status(200).send({ username: req.username, dob: dob });
        return;
    });
}


//get the phone for the requested user
const getPhone = (req, res) => {
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
            res.status(404).send({ Msg: "No matching user found" });
            return;
        }
        res.status(200).send({ username: username, phone: profile.phone });
        return;
    });
}

//update the phone for the logged in user
const updatePhone = (req, res) => {
    let phone = req.body.phone;
    if (!phone) {
        res.status(400).send("You need to provide a phone!")
        return
    }
    Profile.findOneAndUpdate({ username: req.username }, { $set: { phone: phone } }, function (err, profile) {
        if (err) {
            res.status(400).send({ Msg: err });
            return;
        }
        res.status(200).send({ username: req.username, phone: phone });
        return;
    });
}


module.exports = (app) => {
    app.get("/username", getUserName)
    app.get("/headline/:user?", getHeadline)
    app.put("/headline", updateHeadline)
    app.get("/displayname/:user?", getDisplayName)
    app.put("/displayname", updateDisplayName)
    app.get("/avatar/:user?", getAvatar)
    app.put("/avatar", parseFD('avatar'), updateAvatar)
    app.get("/email/:user?", getEmail)
    app.put("/email", updateEmail)
    app.get("/zipcode/:user?", getZipcode)
    app.put("/zipcode", updateZipcode)
    app.get("/dob/:user?", getDob)
    app.put("/dob", updateDob)
    app.get("/phone/:user?", getPhone)
    app.put("/phone", updatePhone)
}