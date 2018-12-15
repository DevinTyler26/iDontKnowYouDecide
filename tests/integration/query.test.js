const request = require("supertest");
const config = require("config");

let server;

describe("/api/query", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
  });
  describe("GET /", () => {
    const requestData = {
      term: "chicken"
    };
    it("should query yelp for locations", async () => {
      const res = await request(server)
        .get("/api/query")
        .send(requestData);
      expect(res.status).toBe(200);
      expect(res.body).toBeTruthy();
    });
  });
});
