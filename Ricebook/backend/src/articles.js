const mongoose = require('mongoose');
const Article = require('./model.js').Article;
const Profile = require('./model.js').Profile;
const parseFD = require('./picUpload');


const updateArticle = (req, res) => {
    let pid = req.params.id;
    let text = req.body.text;
    let cid = req.body.commentId;
    if (!pid) {
        res.status(400).send({ Msg: "Please provide an valid id!" });
        return;
    }
    if (!text) {
        res.status(400).send({ Msg: "Please provide target text!" });
        return;
    }

    if (!cid) {
        Article.findByIdAndUpdate(pid, { $set: { body: text } }, { new: true }, function (err, article) {
            if (err) {
                res.status(400).send({ Msg: err });
                return;
            }
            if (!article) {
                res.status(404).send({ Msg: "No such article!" });
                return;
            }
            res.status(200).send({ articles: [article] });
            return;
        });
    } else if (cid == -1) {
        let curTime = new Date().getTime();
        Article.findByIdAndUpdate(pid, {
            $push: {
                comments: {
                    author: req.username,
                    date: curTime,
                    text: text
                }
            }
        }, {
            new: true
        }, function (err, article) {
            if (err) {
                res.status(400).send({ Msg: err });
                return;
            }
            if (!article) {
                res.status(404).send({ Msg: "No such article!" });
                return;
            }
            res.status(200).send({ articles: [article] });
            return;
        });
    } else {
        Article.findOneAndUpdate({
            _id: pid,
            "comments._id": cid,
        }, {
            $set: {
                "comments.$.text": text,
                "comments.$.date": new Date().getTime()
            }
        }, {
            new: true
        }, function (err, article) {
            if (err) {
                res.status(400).send({ Msg: err });
                return;
            }
            if (!article) {
                res.status(404).send({ Msg: "No such article!" });
                return;
            }
            res.status(200).send({ articles: [article] });
            return;
        });
    }
}

//add article to the database
const postArticle = (req, res) => {
    const username = req.username;
    const text = req.content;
    const img = (!req.fileurl) ? "" : req.fileurl;

    if (!text) {
        res.status(400).send({ Msg: "The text of the article is missing" });
        return;
    };

    new Article({ author: username, body: text, date: new Date(), picture: img, comments: [] })
        .save(function (err, article) {
            if (err) {
                res.status(400).send({ Msg: err });
                return;
            }
            res.status(200).send({ articles: [article] });
            return;
        });
}

//get the articles
const getArticles = (req, res) => {
    let articleId;
    let username;
    let page = null;

    if (req.query.id && mongoose.Types.ObjectId.isValid(req.query.id)) {
        articleId = req.query.id;
    } else if (req.query.id && isNaN(req.query.id)) {
        username = req.query.id;
    } else if (req.query.id) {
        page = parseInt(req.query.id);
    }

    if (articleId) {
        Article.findById(articleId).exec(function (err, article) {
            if (err) {
                res.status(400).send({ Msg: err });
                return;
            }
            if (!article) {
                res.status(404).send({ Msg: "There is no matching article" });
                return;
            }
            res.status(200).send({ articles: [article] });
        });
        return;
    }
    if (username) {
        let allArticle = Article.find({ author: username });
        if(req.query.key != null) {
            allArticle = allArticle.find({ $or: [
                { author: { $regex: req.query.key, $options: 'i' } },
                { body: { $regex: req.query.key, $options: 'i' } },
            ] });
        }
        allArticle.sort({ date: -1 }).skip(3 * (page - 1)).limit(3).exec(function(err, articles) {
            if(err) {
                res.status(400).send({ Msg: err });
                return;
            }
            res.status(200).send({ articles: articles });
            return;
        });

    } else if(page) {
        const username = req.username;
        if (!username) {
            res.status(400).send({ Msg: "There is no logged-in user" });
            return;
        }
        Profile.findOne({ username: username }).exec(async function (err, profile) {
            if(err) {
                res.status(400).send({ Msg: err });
                return;
            }
            if(!profile) {
                res.status(404).semd({ Msg: "None login user called " + username });
                return;
            }
            const following = [username, ...profile.following];
            let allArticle = Article.find({ author: { $in: following } });
            if(req.query.key != null) {
                allArticle = allArticle.find({ $or: [
                    { author: { $regex: req.query.key, $options: 'i' } },
                    { body: { $regex: req.query.key, $options: 'i' } },
                ] });
            }
            allArticle.sort({ date: -1 }).skip(3 * (page - 1)).limit(3).exec(function(err, articles) {
                if(err) {
                    res.status(400).send({ Msg: err });
                    return;
                }
                res.status(200).send({ articles: articles });
                return;
            });
        });
    } else {
        res.status(404).send({ Msg: "No articles fetched!" });
        return;
    }

}

const getArticleLength = (req, res) => {
    let articleId;
    let username;

    if (req.query.id && mongoose.Types.ObjectId.isValid(req.query.id)) {
        articleId = req.query.id;
    } else if (req.query.id && isNaN(req.query.id)) {
        username = req.query.id;
    }

    if (articleId) {
        Article.find({ _id: articleId }).exec(function(err, articles) {
            if (err) {
                res.status(400).send({ Msg: err });
                return;
            }
            res.status(200).send({ length: articles.length });
        });
        return;
    } else if (username) {
        Article.find({ author: username }).exec(function(err, articles) {
            if (err) {
                res.status(400).send({ Msg: err });
                return;
            }
            res.status(200).send({ length: articles.length });
        });
        return;
    } else {
        const username = req.username;
        if (!username) {
            res.status(400).send({ Msg: "There is no logged-in user" });
            return;
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
            const following = [username, ...profile.following];
            let allArticle = Article.find({ author: { $in: following } });
            if(req.query.key != null) {
                allArticle = allArticle.find({ $or: [
                    { author: { $regex: req.query.key, $options: 'i' } },
                    { body: { $regex: req.query.key, $options: 'i' } },
                ] });
            }
            allArticle.count(function(err, count) {
                if(err) {
                    res.status(400).send({ Msg: err });
                    return;
                }
                res.status(200).send({ length: count });
                return;
            });
            return;
        });
        return;
    }
}

const searchArticles = (req, res) => {
    const username = req.username;
    const key = req.query.key;
    const page = req.query.page;
    if (!username) {
        res.status(400).send({ Msg: "There is no logged-in user" });
        return;
    }
    Profile.findOne({ username: username }).exec(function (err, profile) {
        if (err) {
            res.status(400).send({ Msg: err });
            return;
        }
        if (!profile) {
            res.status(404).send("Didn't find the logged-in user's matching profile");
            return;
        }
        const following = [username, ...profile.following];
        Article.find({ author: { $in: following } }).find().exec(function (err, articles) {
            if (err) {
                res.status(400).send({ Msg: err });
                return;
            }
            res.status(200).send({ count: articles.length });
            return;
        });
        return;
    });
    return;
}


module.exports = (app) => {
    app.post("/article", parseFD("img"), postArticle);
    app.get("/articles", getArticles);
    app.put("/articles/:id", updateArticle);
    app.get("/articlesL", getArticleLength);
}


