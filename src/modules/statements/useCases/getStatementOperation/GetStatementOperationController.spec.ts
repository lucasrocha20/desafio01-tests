import request from 'supertest';
import { Connection, createConnection } from 'typeorm';

import { app } from '../../../../app';


let connection: Connection;

describe("Get Statement Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able get operation with id", async () => {
        await request(app).post("/api/v1/users").send({
            name: "Lucas Rocha",
            email: "lucas@teste.com",
            password: "12346",
        });

        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: "lucas@teste.com",
            password: "12346",
        });

        const response = await request(app).post("/api/v1/statements/deposit").send({
          amount: 50,
          description: "Teste"
        }).set({
            Authorization: `Bearer ${responseToken.body.token}`
          });

        const result = await request(app).get(`/api/v1/statements/${response.body.id}`).set({
            Authorization: `Bearer ${responseToken.body.token}`
          });

        expect(response.body).toHaveProperty("amount");
        expect(response.body.amount).toBe(50);
        expect(response.status).toBe(201);
    });
});
