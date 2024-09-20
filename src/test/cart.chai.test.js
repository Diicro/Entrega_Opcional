import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const request = supertest("https://entrega-opcional.onrender.com");

const user = {
  email: "ni-co68@hotmail.com",
  passWord: "casa",
};
const user2 = {
  email: "Dicrokills@gmail",
  passWord: "asco",
};
let reqSession = {};

describe("Cart test de respuestas", function () {
  this.timeout(10000);

  it("POST /api/sessions/pplogin se loguea y crea una session existosamente", async () => {
    const res = await request.post("/api/sessions/pplogin").send(user);

    const cookieSession = res.headers["set-cookie"];
    reqSession = cookieSession;

    expect(res.statusCode).to.be.equal(302);
    expect(res.forbidden).to.deep.equal(false);
  });
  it("GET /api/carts optiene todos los carritos existentes solo admin", async () => {
    const res = await request.get("/api/carts").set("Cookie", [reqSession]);
    expect(res.body).to.be.an("object");
    expect(res.statusCode).to.be.equal(200);
    expect(res.forbidden).to.deep.equal(false);
  });
  it("GET /api/carts/:cid optiene los productos del carrito por id del carrito , solo admin", async () => {
    const cid = 0;
    const res = await request
      .get(`/api/carts/${cid}`)
      .set("Cookie", [reqSession]);
    expect(res.body).to.be.an("array");
    expect(res.statusCode).to.be.equal(200);
  });
  it("POST /api/carts/:cid/product/:pid añade un producto al carrito solo user y premium", async () => {
    const cid = 1;
    const pid = 5;
    const res = await request
      .post(`/api/carts/${cid}/product/${pid}`)
      .set("Cookie", [reqSession]);
    expect(res.body.payload).to.be.a("string");
    expect(res.body).to.have.all.keys("payload");
    expect(res.statusCode).to.be.equal(200);
  });

  it("DELETE /api/carts/:cid/products Elimina los productos de un carrito,solo admin", async () => {
    const cid = 1;
    const res = await request
      .delete(`/api/carts/${cid}/products`)
      .set("Cookie", [reqSession]);

    expect(res.text).to.be.an("string").that.include(`${cid}`);
    expect(res.statusCode).to.be.equal(200);
  });
});
