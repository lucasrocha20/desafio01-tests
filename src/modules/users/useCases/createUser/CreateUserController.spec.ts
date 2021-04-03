import request from 'supertest';
import { Connection, createConnection } from 'typeorm';

import { app } from '../../../../app';


let connection: Connection;

describe("Create User Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to create a new user", async () => {
        const response = await request(app).post("/api/v1/users").send({
            name: "Lucas Rocha",
            email: "lucas@teste.com",
            password: "12346",
        });

        expect(response.status).toBe(201);
    });

    it("should be able to create a user with same email", async () => {
      await request(app).post("/api/v1/users").send({
        name: "Lucas Rocha 2",
        email: "teste1@teste.com",
        password: "1234678",
      });

      const response = await request(app).post("/api/v1/users").send({
          name: "Lucas Rocha 3",
          email: "teste1@teste.com",
          password: "1234678",
      });

      expect(response.status).toBe(400);
  });
});
