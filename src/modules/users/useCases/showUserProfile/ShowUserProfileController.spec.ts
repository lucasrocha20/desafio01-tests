import request from 'supertest';
import { Connection } from 'typeorm';

import createConnection from "../../../../database/index";
import { app } from '../../../../app';


let connection: Connection;

describe("Show User Profile Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able show profile user", async () => {
        await request(app).post("/api/v1/users").send({
            name: "Lucas Rocha",
            email: "teste@teste.com",
            password: "12346",
        });

        const responseToken = await request(app).post("/api/v1/sessions").send({
          email: "teste@teste.com",
          password: "12346",
        });

        const { token } = responseToken.body;

        const response = await request(app).get("/api/v1/profile")
          .set({
              Authorization: `Bearer ${token}`
          });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id");
    });

    it("should not be able show profile user if token id invalid", async () => {
      const response = await request(app).get("/api/v1/profile")
        .set({
            Authorization: `Bearer TokenInvalido`
        });

      expect(response.status).toBe(401);
  });
});
