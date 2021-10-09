// Write your tests here

const request = require("supertest");
const server = require("./server");
const db = require("../data/dbConfig");
const jwtDecode = require("jwt-decode");
const bcrypt = require("bcrypt");
const jokes = require("./jokes/jokes-data");

beforeEach(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

test("sanity", () => {
  expect(true).toBe(true);
});
describe("[POST] api/auth/register", () => {
  test("creates a new user in the db", async () => {
    await request(server)
      .post("/api/auth/register")
      .send({ username: "sean", password: "1234" });
    const sean = await db("users").where("username", "sean").first();
    expect(sean).toMatchObject({ username: "sean" });
  }, 750);
  test("responds with message with already taken username", async () => {
    await request(server).post("/api/auth/register").send({ username: "matt", password: '1234'})
    const res = await request(server)
      .post("/api/auth/register")
      .send({ username: "matt", password: "1234" });
    expect(res.body.message).toMatch(/username already taken/i);
  });
});

describe("[POST] api/auth/login", () => {
  test("resonds with message and status on bad credentials", async () => {
    await request(server).post("/api/auth/register").send({ username: "bob", password: '1234'})
    let res = await request(server)
      .post("/api/auth/login")
      .send({ username: "bob", password: "123458" });
    expect(res.body.message).toMatch(/invalid credentials/i);
  });
  test("responds with correct status and message on valid login", async () => {
    await request(server).post("/api/auth/register").send({ username: "matt", password: '1234'})
    let res = await request(server)
      .post("/api/auth/login")
      .send({ username: "matt", password: "1234" });
    expect(res.body.message).toMatch(/welcome back matt/i);
  });
});

describe("[GET] /api/jokes", () => {
  test("returns proper status and message on invalid token", async () => {
    const res = await request(server).get("/api/jokes");
    expect(res.body.message).toMatch(/token required or invalid/i);
  }, 750);
  test("returns jokes if token is valid", async () => {
    await request(server)
      .post("/api/auth/register")
      .send({ username: "matt", password: "1234" });
    let res = await request(server)
      .post("/api/auth/login")
      .send({ username: "matt", password: "1234" });
    res = await request(server)
      .get("/api/login")
      .set("Authorization", res.body.token);
    expect(res.body).toMatchObject(jokes);
  }, 750);
});
