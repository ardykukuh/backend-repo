import request from "supertest";
import express, { Router } from "express";
import userRoutes from "./userRoutes";
import { addUserData, updateUserData, fetchUserData } from "../controller/api";
import { authMiddleware } from "../middleware/authMiddleware";

jest.mock("../controller/api", () => ({
  addUserData: jest.fn((req, res) => res.status(201).json({ message: "User added" })),
  updateUserData: jest.fn((req, res) => res.status(200).json({ message: "User updated" })),
  fetchUserData: jest.fn((req, res) => res.status(200).json({ id: "123", name: "John Doe" })),
}));

jest.mock("../middleware/authMiddleware", () => ({
  authMiddleware: jest.fn((req, res, next) => next()),
}));

describe("User Routes", () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/api", userRoutes);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/add-user", () => {
    it("should call authMiddleware and addUserData", async () => {
      const response = await request(app)
        .post("/api/add-user")
        .set("Authorization", "Bearer token")
        .send({ name: "Jane Doe", email: "jane.doe@example.com" });

      expect(authMiddleware).toHaveBeenCalled();
      expect(addUserData).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User added");
    });
  });

  describe("PUT /api/update-user-data", () => {
    it("should call authMiddleware and updateUserData", async () => {
      const response = await request(app)
        .put("/api/update-user-data")
        .set("Authorization", "Bearer token")
        .send({ id: "123", name: "John Updated", email: "updated@example.com" });

      expect(authMiddleware).toHaveBeenCalled();
      expect(updateUserData).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User updated");
    });
  });

  describe("POST /api/fetch-user-data", () => {
    it("should call authMiddleware and fetchUserData", async () => {
      const response = await request(app)
        .post("/api/fetch-user-data")
        .set("Authorization", "Bearer token")
        .send({ id: "123" });

      expect(authMiddleware).toHaveBeenCalled();
      expect(fetchUserData).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: "123", name: "John Doe" });
    });
  });

  describe("Auth Middleware", () => {
    it("should return 401 if no token is provided", async () => {
      (authMiddleware as jest.Mock).mockImplementationOnce((req, res, next) => {
        res.status(401).json({ error: "Unauthorized" });
      });

      const response = await request(app)
        .post("/api/add-user")
        .send({ name: "Jane Doe", email: "jane.doe@example.com" });

      expect(authMiddleware).toHaveBeenCalled();
      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Unauthorized");
    });
  });
});
