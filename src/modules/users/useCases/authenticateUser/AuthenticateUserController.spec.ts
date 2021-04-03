import request from 'supertest';
import { Connection, createConnection } from 'typeorm';

import { app } from '../../../../app';


let connection: Connection;

describe("Authenticate User Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able authenticated a user", async () => {
        await request(app).post("/api/v1/users").send({
            name: "Lucas Rocha",
            email: "lucas@teste.com",
            password: "12346",
        });

        const response = await request(app).post("/api/v1/sessions").send({
            email: "lucas@teste.com",
            password: "12346",
        });

        expect(response.body).toHaveProperty("token");
    });

    it("should not be able authenticated a user that does not exists", async () => {
      const response = await request(app).post("/api/v1/sessions").send({
          email: "lucas3@teste.com",
          password: "1234698",
      });

      expect(response.status).toBe(401);
    });
});
