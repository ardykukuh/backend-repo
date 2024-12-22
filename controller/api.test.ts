import { Request, Response } from "express";
import { addUserData, updateUserData, fetchUserData } from "../controller/api";
import { addUserToFirestore, updateUserInFirestore, fetchUserFromFirestore } from "../repository/userCollection";

// Mock the Firestore repository functions
jest.mock("../repository/userCollection", () => ({
  addUserToFirestore: jest.fn(),
  updateUserInFirestore: jest.fn(),
  fetchUserFromFirestore: jest.fn(),
}));

describe("API Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();
    mockRequest = {};
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
  });

  describe("addUserData", () => {
    it("should add a user and return success", async () => {
      mockRequest.body = { name: "John Doe", email: "johndoe@example.com", phone: "1234567890" };
      (addUserToFirestore as jest.Mock).mockResolvedValueOnce(undefined);

      await addUserData(mockRequest as Request, mockResponse as Response);

      expect(addUserToFirestore).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "John Doe",
          email: "johndoe@example.com",
          phone: "1234567890",
        })
      );
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({ message: "User added successfully" });
    });

    it("should return a 400 error if name or email is missing", async () => {
      jest.clearAllMocks();
      mockRequest.body = { phone: "1234567890" };
      await addUserData(mockRequest as Request, mockResponse as Response);
      expect(addUserToFirestore).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Name and email are required" });
    });

    it("should return a 500 error if adding user fails", async () => {
      mockRequest.body = { name: "John Doe", email: "johndoe@example.com" };
      (addUserToFirestore as jest.Mock).mockRejectedValueOnce(new Error("Failed to add user"));

      await addUserData(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Error adding user" });
    });
  });

  describe("updateUserData", () => {
    it("should update a user and return success", async () => {
      mockRequest.body = { id: "userId", name: "Updated Name", email: "updated@example.com" };
      (updateUserInFirestore as jest.Mock).mockResolvedValueOnce(undefined);

      await updateUserData(mockRequest as Request, mockResponse as Response);

      expect(updateUserInFirestore).toHaveBeenCalledWith("userId", {
        name: "Updated Name",
        email: "updated@example.com",
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ message: "User updated successfully" });
    });

    it("should return a 400 error if ID is missing", async () => {
      jest.clearAllMocks();
      mockRequest.body = { name: "Updated Name", email: "updated@example.com" };

      await updateUserData(mockRequest as Request, mockResponse as Response);

      expect(updateUserInFirestore).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: "ID is required" });
    });

    it("should return a 500 error if updating user fails", async () => {
      mockRequest.body = { id: "userId", name: "Updated Name", email: "updated@example.com" };
      (updateUserInFirestore as jest.Mock).mockRejectedValueOnce(new Error("Failed to update user"));

      await updateUserData(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Error updating user" });
    });
  });

  describe("fetchUserData", () => {
    it("should fetch a user and return the user data", async () => {
      mockRequest.body = { id: "userId" };
      (fetchUserFromFirestore as jest.Mock).mockResolvedValueOnce({
        id: "userId",
        name: "Test User",
        email: "testuser@example.com",
      });

      await fetchUserData(mockRequest as Request, mockResponse as Response);

      expect(fetchUserFromFirestore).toHaveBeenCalledWith("userId");
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        id: "userId",
        name: "Test User",
        email: "testuser@example.com",
      });
    });

    it("should return a 400 error if ID is missing", async () => {
      jest.clearAllMocks();
      mockRequest.body = {};

      await fetchUserData(mockRequest as Request, mockResponse as Response);

      expect(fetchUserFromFirestore).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: "ID is required" });
    });

    it("should return a 404 error if user is not found", async () => {
      mockRequest.body = { id: "userId" };
      (fetchUserFromFirestore as jest.Mock).mockResolvedValueOnce(null);

      await fetchUserData(mockRequest as Request, mockResponse as Response);

      expect(fetchUserFromFirestore).toHaveBeenCalledWith("userId");
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return a 500 error if fetching user fails", async () => {
      mockRequest.body = { id: "userId" };
      (fetchUserFromFirestore as jest.Mock).mockRejectedValueOnce(new Error("Failed to fetch user"));

      await fetchUserData(mockRequest as Request, mockResponse as Response);

      expect(fetchUserFromFirestore).toHaveBeenCalledWith("userId");
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Error fetching user" });
    });
  });
});
