import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import bcrypt from "bcrypt";
import User from "../models/User.js"; 
let mongo;
beforeAll(async () => { 
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});
afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});
beforeEach(async () => {
  await User.deleteMany();
});
describe("User Model", () => {
  it("sparar en giltig användare", async () => {
    const user = await User.create({ email: "test@example.com", password: "password123" });
    expect(user).toBeDefined();
    expect(user.email).toBe("test@example.com");
  });
  it("hashar lösenordet korrekt", async () => {
    const rawPassword = "mySecret";
    const user = await User.create({ email: "secure@example.com", password: rawPassword });
    const isMatch = await bcrypt.compare(rawPassword, user.password);
    expect(isMatch).toBe(true);
  });
  it("kastar fel utan e-post", async () => {
    await expect(User.create({ password: "test123" })).rejects.toThrow();
  });
  it("kastar fel utan lösenord", async () => {
    await expect(User.create({ email: "fail@example.com" })).rejects.toThrow();
  });
  it("tillåter inte duplicerad e-post", async () => {
    await User.create({ email: "unique@example.com", password: "123456" });
    await expect(User.create({ email: "unique@example.com", password: "abcdef" })).rejects.toThrow();
  });
  it("tillåter inte att admin-flaggan ändras efter skapande", async () => {
    const user = await User.create({ email: "admincheck@example.com", password: "test123" });
    user.admin = true;
    await user.save();
    const fresh = await User.findById(user._id);
    expect(fresh.admin).toBe(false); 
  });
});
