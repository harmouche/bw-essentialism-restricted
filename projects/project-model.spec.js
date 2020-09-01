const request  = require("supertest");

const db = require('../database/connection');
const server = require('../api/server');
const { returning, intersect } = require("../database/connection");
const Projects = require('./project-model');
// const supertest = require('supertest');

const testProject = {
  
    title: "Organize 11",
    summary: "need to get rid of items I don't use",
    importance: 3

}

const editProject = {
    id: 1,
    title: "sushi Dinner",
    summary: "testing summary",
    importance: 6,
    user_id: 1
}

describe('projects model', () => {
    describe('insert', () => {
        beforeEach(async () => {
            await db('projects').truncate();
        });

        let token = "";
        it(' POST /auth/login - res.type should match json"', function() {
            return request(server)
                .post('/api/auth/login')
                .send({  username: "user1@gmail.com", password: "123456789" })
                .then(res => {
                    token = res.body.token
                }) 
            })
        it('should insert the provided project into the db', async () => {
           
            const projects = await db('projects');
            console.log("token before post", token)
            request(server)
             .post('/api/projects')
            .set({ "Authorization": `Bearer ${token}` })
            .send(testProject)
             .then( res => {
                expect(res.status).toBe(201);
             })
            console.log("projects after post", projects)
         
            
        });

      

        it('should return the project we inserted', async () => {
           
            const projects = await db('projects');
            request(server)
             .get('/api/projects')
             .set({ "Authorization": `Bearer ${token}` })
             .then( res => {
                expect(res.status).toBe(201);
            })
         
            // it('should return the project we inserted', async () => {
           
            //     const projects = await db('projects');
            //     const id = req.body.id
            //     request(projects)
            //      .put(`/api/projects/${id}`)
            //      .set({ "Authorization": `Bearer ${token}` })
            //      .send(editProject)
            //      .then( res => {
            //         expect(res.status).toBe(201)});
            // })

        })
    });
});