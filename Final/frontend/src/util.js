const url = path => `https://qz40ricebookserver.herokuapp.com${path}`;
// const url = path => `https://http://localhost:3100${path}`;
let oldLength = null;

export function login(username, password, callback) {
    let payload = {
        username: username,
        password: password
    };
    fetch(url('/login'), {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(res => {
        return res.json();
    }).then(res => {
        callback(res);
    });
}

export function logout() {
    fetch(url('/logout'), {
        method: 'PUT',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
    }).then(res => {
        return res.json();
    });
}

export function register(username, displayname, password, email, phone, dob, zipcode, callback) {
    let payload = {
        username: username,
        displayname: displayname,
        password: password,
        email: email,
        phone: phone,
        dob: dob,
        zipcode: zipcode
    };
    fetch(url('/register'), {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    }).then(res => {
        return res.json();
    }).then(res => {
        callback(res);
    });
}

export function getArticles(id, key, callback) {
    if(key == null || key == "") {
        key = "";
    } else {
        key = "&key=" + key;
    }
    fetch(url('/articles' + "?id=" + id + key), {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
    }).then(res => {
        return res.json();
    }).then(res => {
        callback(res);
    });  
}

export function getArticlesLength(id, key, callback) {
    if(key == null || key == "") {
        key = "";
    } else {
        key = "&key=" + key;
    }
    fetch(url('/articlesL' + "?" + id + key), {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
    }).then(res => {
        return res.json();
    }).then(res => {
        callback(res);
    });  
}

export function updateArticle(id, text, commentId, callback) {
    let payload = { text: text };
    if(commentId != null) {
        payload['commentId'] = commentId;
    }
    fetch(url('/articles/' + id), {
        method: 'PUT',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    }).then(res => {
        return res.json();
    }).then(res => {
        callback(res);
    });   
}

export function postArticle(fd, callback) {
    fetch(url('/article'), {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        body: fd
    }).then(res => {
        return res.json();
    }).then(res => {
        callback(res);
    });   
}

export function getHeadline(user, callback) {
    if(user == null) {
        user = "";
    } else {
        user = "/" + user;
    }
    fetch(url('/headline' + user), {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify(payload),
    }).then(res => {
        return res.json();
    }).then(res => {
        callback(res);
    });
}

export function updateHeadline(newHeadline, callback) {
    let payload = { headline: newHeadline };
    fetch(url('/headline'), {
        method: 'PUT',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    }).then(res => {
        return res.json();
    }).then(res => {
        callback(res);
    });
}

export function getFollower(user, callback) {
    if(user == null) {
        user = "";
    } else {
        user = "/" + user;
    }
    fetch(url('/following' + user), {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
    }).then(res => {
        return res.json();
    }).then(res => {
        callback(res);
    });
}

export function getFollowerAndHeadlines(user, callback) {
    if(user == null) {
        user = "";
    } else {
        user = "/" + user;
    }
    fetch(url('/followingH' + user), {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
    }).then(res => {
        return res.json();
    }).then(res => {
        callback(res);
    });
}

export function getHeadlinesByFollowers(following, callback) {
    let payload = { following: following };
    fetch(url('/headlineF'), {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    }).then(res => {
        return res.json();
    }).then(res => {
        callback(res);
    });
}

export function addFollower(user, callback) {
    fetch(url('/following/' + user), {
        method: 'PUT',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
    }).then(res => {
        return res.json();
    }).then(res => {
        callback(res);
    });
}

export function deleteFollower(user, callback) {
    fetch(url('/following/' + user), {
        method: 'DELETE',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
    }).then(res => {
        return res.json();
    }).then(res => {
        callback(res);
    });
}

export function getAvatar(user, callback) {
    if(!user) {
        user = "";
    } else {
        user = "/" + user;
    }
    fetch(url('/avatar' + user), {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
    }).then(res => {
        return res.json();
    }).then(res => {
        callback(res);
    });
}

export function updateAvatar(fd, callback, waitCallBack) {
    waitCallBack(true);
    fetch(url('/avatar'), {
        method: 'PUT',
        credentials: 'include',
        mode: 'cors',
        body: fd,
    }).then(res => {
        return res.json();
    }).then(res => {
        callback(res);
        waitCallBack(false);
    });
}

export function getUsername(callback) {
    fetch(url('/username'), {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
    }).then(res => {
        return res.json();
    }).then(res => {
        callback(res);
    });
}

export function getDisplayName(user, callback) {
    if(user == null) {
        user = "";
    } else {
        user = "/" + user;
    }
    fetch(url('/displayname' + user), {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
    }).then(res => {
        return res.json();
    }).then(res => {
        callback(res);
    });
}

export function updateDisplayName(user, displayname, callback) {
    let payload = { displayname: displayname };
    if(user != null) {
        payload['username'] = user;
    }
    fetch(url('/displayname'), {
        method: 'PUT',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    }).then(res => {
        return res.json();
    }).then(res => {
        callback(res);
    });
}

export function getEmail(user, callback) {
    if(user == null) {
        user = "";
    } else {
        user = "/" + user;
    }
    fetch(url('/email' + user), {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
    }).then(res => {
        return res.json();
    }).then(res => {
        callback(res);
    });
}

export function updateEmail(user, email, callback) {
    let payload = { email: email };
    if(user != null) {
        payload['username'] = user;
    }
    fetch(url('/email'), {
        method: 'PUT',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    }).then(res => {
        return res.json();
    }).then(res => {
        callback(res);
    });
}

export function getZipcode(user, callback) {
    if(user == null) {
        user = "";
    } else {
        user = "/" + user;
    }
    fetch(url('/zipcode' + user), {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
    }).then(res => {
        return res.json();
    }).then(res => {
        callback(res);
    });
}

export function updateZipcode(zipcode, callback) {
    let payload = { zipcode: zipcode };
    fetch(url('/zipcode'), {
        method: 'PUT',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    }).then(res => {
        return res.json();
    }).then(res => {
        callback(res);
    });
}

export function getPhone(user, callback) {
    if(user == null) {
        user = "";
    } else {
        user = "/" + user;
    }
    fetch(url('/phone' + user), {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
    }).then(res => {
        return res.json();
    }).then(res => {
        callback(res);
    });
}

export function updatePhone(phone, callback) {
    let payload = { phone: phone };
    fetch(url('/phone'), {
        method: 'PUT',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    }).then(res => {
        return res.json();
    }).then(res => {
        callback(res);
    });
}

export function getDob(user, callback) {
    if(user == null) {
        user = "";
    } else {
        user = "/" + user;
    }
    fetch(url('/dob' + user), {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
    }).then(res => {
        return res.json();
    }).then(res => {
        callback(res);
    });
}

export function updateDob(dob, callback) {
    let payload = { dob: dob };
    fetch(url('/dob'), {
        method: 'PUT',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    }).then(res => {
        return res.json();
    }).then(res => {
        callback(res);
    });
}


export function updatePassword(newPassword, callback) {
    let payload = { password: newPassword };
    fetch(url('/password'), {
        method: 'PUT',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    }).then(res => {
        return res.json();
    }).then(res => {
        callback(res);
    });
}