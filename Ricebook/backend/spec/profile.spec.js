/*
 * Test suite for profile
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');

let loginCookie = null;

const url = path => `http://localhost:3000${path}`;

describe('Validate functions of auth and profile', () => {

    it('validate POST /register', (done) => {
        let payload = {
            username: "testUser",
            password: "123",
            email: "a@b.c",
            dob: "2000-01-01",
            zipcode: "77030"
        };
        fetch(url('/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then(res => {
                expect(res.status).toEqual(200);
                return res.json()
            })
            .then(res => {
                expect(res.username).toEqual('testUser');
                expect(res.result).toEqual('success');
                done();
            });
    });

    it('validate POST /login', (done) => {
        let payload = { username: 'testUser', password: '123' };
        fetch(url('/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(res => {
            expect(res.status).toEqual(200);
            loginCookie = res.headers.get('set-cookie');
            return res.json()
        }).then(res => {
            expect(res.username).toEqual('testUser');
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('validate GET /headline', (done) => {
        fetch(url('/headline'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'cookie': loginCookie },
        }).then(res => {
            expect(res.status).toEqual(200);
            return res.json();
        }).then(res => {
            expect(res.username).toEqual('testUser');
            expect(res.headline).toEqual('');
            done();
        });
    });

    it('validate PUT /headline', (done) => {
        let payload = { headline: "Happy!" };
        fetch(url('/headline'), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'cookie': loginCookie },
            body: JSON.stringify(payload)
        }).then(res => {
            expect(res.status).toEqual(200);
            return res.json()
        }).then(res => {
            expect(res.username).toEqual('testUser');
            expect(res.headline).toEqual('Happy!');
            done();
        });
    });

    it('validate PUT /logout', (done) => {
        fetch(url('/logout'), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', "cookie": loginCookie },
        }).then(res => {
            expect(res.status).toEqual(200)
            expect(res.statusText).toEqual('OK');
            done();
        });
    });

});