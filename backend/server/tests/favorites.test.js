const request = require ("supertest");
const mongoose = require("mongoose");
const app = require("../server");

describe("Favorites routes", () => {
    afterAll(async () => {
        await mongoose.connection.close();
    });

    test("POST /favorites - should add a favorite item", async () => {
        const response = await request(app)
            .post("/favorites")
            .send({
                userId: "12345",
                movieId: "13579"});

        expect(response.statusCode).toBe(201);
        expect(response.body.userId).toBe("12345");
        expect(response.body.movieId).toBe("13579");
        expect(response.body._id).toBeDefined();
  });

  test("GET /favorites returns an array", async () => {
    const res = await request(app).get("/favorites");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
