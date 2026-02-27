/* Test File
 * Author: James Ortiz Jr.
 * Date: 02/26/2026
 */

const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

describe("Comment Routes", () => {

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a new comment", async () => {
    const res = await request(app)
      .post("/userMakeComment")
      .send({
        userId: "111",
        postId: "222",
        text: "Testing comment"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.text).toBe("Testing comment");
  });

  it("should fetch all comments", async () => {
    const res = await request(app)
    .get("/userGetAllUserComments");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

});