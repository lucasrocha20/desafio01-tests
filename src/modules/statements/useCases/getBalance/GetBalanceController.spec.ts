import request from 'supertest';
import { Connection, createConnection } from 'typeorm';

import { app } from '../../../../app';


let connection: Connection;

describe("Get Balance Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able get balance from user controller", async () => {
        await request(app).post("/api/v1/users").send({
            name: "Lucas Rocha",
            email: "lucas@teste.com",
            password: "12346",
        });

        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: "lucas@teste.com",
            password: "12346",
        });

        const response = await request(app).get("/api/v1/statements/balance")
          .set({
            Authorization: `Bearer ${responseToken.body.token}`
          });

        expect(response.body).toHaveProperty("balance");
    });
});
