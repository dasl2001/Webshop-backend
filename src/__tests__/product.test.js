import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Product from "../models/Product.js";  
import Category from "../models/Category.js";
jest.setTimeout(10000); 
let mongo; 
beforeAll(async () => { 
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});
afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});
beforeEach(async () => {
  await Product.deleteMany();
  await Category.deleteMany();
});
describe("Product Model Test", () => {
  it("should create & save product successfully", async () => {
    const category = await Category.create({
      name: "TestKategori",
      description: "Testbeskrivning",
      type: "Test",
    });
    const validProduct = new Product({
      name: "TestProdukt",
      price: 29.99,
      description: "God produkt",
      stock: 10,
      category: category._id,
    });
    const savedProduct = await validProduct.save();
    expect(savedProduct._id).toBeDefined();
    expect(savedProduct.name).toBe("TestProdukt");
    expect(savedProduct.category.toString()).toBe(category._id.toString());
  });
  it("should fail to save product without required fields", async () => {
    const product = new Product({ price: 15.5 });
    let error;
    try {
      await product.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.name).toBeDefined();
    expect(error.errors.category).toBeDefined();
  });
});

