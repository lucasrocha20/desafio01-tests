import request from 'supertest';
import { Connection, createConnection } from 'typeorm';

import { app } from '../../../../app';


let connection: Connection;

describe("Create Statement Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able create a new deposit for user controller", async () => {
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

        expect(response.body).toHaveProperty("id");
        expect(response.status).toBe(201);
    });

    it("should be able create a new withdraw for user controller", async () => {
      await request(app).post("/api/v1/users").send({
          name: "Lucas Rocha",
          email: "lucas@teste.com",
          password: "12346",
      });

      const responseToken = await request(app).post("/api/v1/sessions").send({
          email: "lucas@teste.com",
          password: "12346",
      });

      await request(app).post("/api/v1/statements/deposit").send({
        amount: 50,
        description: "Teste"
      }).set({
          Authorization: `Bearer ${responseToken.body.token}`
        });

      const response = await request(app).post("/api/v1/statements/withdraw").send({
        amount: 10,
        description: "Teste 2"
      }).set({
          Authorization: `Bearer ${responseToken.body.token}`
        });

      expect(response.body).toHaveProperty("id");
      expect(response.status).toBe(201);
    });
});
