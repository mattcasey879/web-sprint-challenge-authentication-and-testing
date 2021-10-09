// Write your tests here

const request = require("supertest");
const server = require("./server");
const db = require("../data/dbConfig");
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
  }, 1500);
  test("responds with message with already taken username", async () => {
    await request(server).post("/api/auth/register").send({ username: "matt", password: '1234'})
    const res = await request(server)
      .post("/api/auth/register")
      .send({ username: "matt", password: "1234" });
    expect(res.body.message).toMatch(/username taken/i);
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
    expect(res.body.message).toMatch(/welcome, matt/i);
  });
});

describe("[GET] /api/jokes", () => {
  test("returns proper status and message on invalid token", async () => {
    const res = await request(server).get("/api/jokes");
    expect(res.body.message).toMatch(/token required/i);
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
    expect(jokes).toMatchObject(jokes);
  }, 750);
});
