/*
 * Test suite for articles
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');

let loginCookie = null;

const url = path => `http://localhost:3100${path}`;

describe('Validate functions of articles', () => {

    it('login', (done) => {
        let payload = { username: 'testUser', password: '123' };
        fetch(url('/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(res => {
            loginCookie = res.headers.get('set-cookie');
            done();
            return null;
        });
    });

    it('validate POST /article', (done) => {
        let payload = { text: "article!" };
        fetch(url('/article'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'cookie': loginCookie },
            body: JSON.stringify(payload)
        }).then(res => {
            expect(res.status).toEqual(200);
            return res.json();
        }).then(res => {
            const articles = res.articles;
            expect(articles.length).toEqual(articles.length);
            expect(articles[0].author).toEqual('testUser');
            expect(articles[0].body).toEqual('article!');
            expect(articles[0].comments.length).toEqual(0);
            done();
        });
    });

    it('validate GET /articles', (done) => {
        fetch(url('/articles'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'cookie': loginCookie },
        }).then(res => {
            expect(res.status).toEqual(200);
            return res.json();
        }).then(res => {
            const articles = res.articles;
            expect(articles.length).toEqual(articles.length);
            expect(articles[0].author).toEqual('testUser');
            expect(articles[0].body).toEqual('article!');
            expect(articles[0].comments.length).toEqual(0);
            done();
        });
    });

    it('validate GET /articles/id(user)', (done) => {
        fetch(url('/articles/6196d2b3192667a6e251f9f7'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'cookie': loginCookie },
        }).then(res => {
            expect(res.status).toEqual(200);
            return res.json();
        }).then(res => {
            const articles = res.articles;
            expect(articles.length).toEqual(1);
            expect(articles[0].author).toEqual("Charm");
            expect(articles[0].body).toEqual("olalallaa");
            done();
        });
    });

    it('validate GET /articles/id(user)', (done) => {
        fetch(url('/articles/Charm'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'cookie': loginCookie },
        }).then(res => {
            expect(res.status).toEqual(200);
            return res.json();
        }).then(res => {
            const articles = res.articles;
            expect(articles.length).toEqual(5);
            done();
        });
    });


    it('logout user', (done) => {
        fetch(url('/logout'), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', "cookie": loginCookie },
        });
        done();
    });

});