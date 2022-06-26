const supertest = require('supertest');
const app = require("../index")
const User = require("../models/user.model")

describe("#userSignup", () => {
    describe("should not register user", () => {
        describe("when email already exists", () => {
            test("return success false", async () => {
                const response = await supertest(app)
                    .post('/api/v1.0/user/signin')
                    .send({
                        fName: "Manju",
                        lName: "Hegade",
                        email: "manju@gmail.com",
                        password: "123456789"
                    })
                    .expect(400);
                    expect(response.body.message).toBe('User already exists');
            });
        });
    })
    describe("should create user", () => {
        describe("when details is valid", () => {
            test("should return success true", async () => {
                const res = await supertest(app)
                    .post('/api/v1.0/user/signin')
                    .send({
                        fName: "Manju",
                        lName: "Hegade",
                        email: "manjuhmg1@gmail.com",
                        password: "123456789"
                    })
                    .expect(200);
                expect(res.body.message).toBe('User created successfully');
                expect(res.body.user.fName).toBe('Manju');
                expect(res.body.user.lName).toBe('Hegade');
                expect(res.body.user.email).toBe('manjuhmg1@gmail.com');
            })
        })
    })

})