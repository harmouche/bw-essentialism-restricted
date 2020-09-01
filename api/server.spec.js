const request = require('supertest')

const db = require('../database/connection');

const server = require('./server');
const { getMaxListeners } = require('./server');

describe('end point tests', function() {
    describe('POST /register and POST /login', function() {
        beforeAll(async() => {
                await db('users').truncate();
            })
            //test1
        it('POST /auth/register - should return status 201', function() {
                return request(server)
                    .post('/api/auth/register')
                    .send({ name: "user1", username: "user1@gmail.com", password: "123456789" })
                    .then(res => {
                        expect(res.status).toBe(201);
                    })
            })
            //test2
        it(' POST /auth/register - res.type should match json', function() {
                return request(server)
                    .post('/api/auth/register')
                    .send({ name: "harmouche",username: "harmouche@gmail.com", password: "harmouche123" })
                    .then(res => {
                        expect(res.type).toMatch(/json/i);
                    })
            })
            //test3
        it('POST /auth/login - should return status 200', function() {
                return request(server).post('/api/auth/login').send({ username: 'harmouche@gmail.com', password: 'harmouche123' }).then(res => {
                    expect(res.status).toBe(200);
                })
            })
            //test4
        it(' POST /auth/login - res.type should match json"', function() {
                return request(server)
                    .post('/api/auth/login')
                    .send({  username: "user1@gmail.com", password: "123456789" })
                    .then(res => {
                        expect(res.type).toMatch(/json/i);
                        console.log("response from test login", res.body.token)
                    })
            })
            //test5
        it(' GET /projects/ - res.type should match json', function() {
                return request(server)
                    .get('/api/projects/')
                    .then(res => {
                        expect(res.type).toMatch(/json/i);
                    })
            })
            //test6
        it(' GET /projects/ - should be defined', function() {
            return request(server)
                .get('/api/projects/')
                .then(res => {
                    expect(res.body).toBeDefined();
                })
        })
    })
})