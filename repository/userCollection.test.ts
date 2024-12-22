import { db } from "../config/firebaseConfig";
import { addUserToFirestore, updateUserInFirestore, fetchUserFromFirestore } from "../repository/userCollection";
import { User } from "../entities/user";

// Mock Firestore's methods
jest.mock("../config/firebaseConfig", () => {
  const mockAdd = jest.fn().mockResolvedValue({
    id: "generated-id", // Simulate Firestore generated ID
  });
  
  const mockSet = jest.fn().mockResolvedValue(undefined);
  const mockGet = jest.fn().mockResolvedValue({
    exists: true,
    data: () => ({
      id: "generated-id",
      name: "Updated User",
      email: "updateduser@example.com",
      phone: "987654321",
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  });
  const mockGetNull = jest.fn().mockResolvedValue({
    exists: false,
    data: null,
  });
  const mockDoc = jest.fn().mockImplementation((docId: string) => {
    if (docId === 'nonexistent-id') {
      return {
        set: mockSet,
        get: mockGetNull,
      };
    } else {
      return {
        set: mockSet,
        get: mockGet,
      };
    }
  });

  // const mockDoc = jest.fn().mockReturnValue({
  //   set: mockSet,
  //   get: mockGet,
  // });
  const mockCollection = jest.fn().mockReturnValue({
    add: mockAdd,
    doc: mockDoc,
  });

  return {
    db: {
      collection: mockCollection,
    },
  };
});

describe("User Collection Repository", () => {

  describe("addUserToFirestore", () => {
    it("[POSITIVE] should add a new user to Firestore", async () => {
      const newUser: User = {
        id: "generated-id", // Just for the interface, Firestore will not need this
        name: "New User",
        email: "newuser@example.com",
        phone: "123456789",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Call the function to add the user
      await addUserToFirestore({
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Assert that the collection method was called with the 'USERS' collection
      expect(db.collection).toHaveBeenCalledWith("USERS");

      // Assert that the add method was called with the correct user data
      expect(db.collection("USERS").add).toHaveBeenCalledWith(expect.objectContaining({
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        createdAt: expect.any(Object), // Timestamp
        updatedAt: expect.any(Object), // Timestamp
      }));
    });

    // it('should return null if user is not found', async () => {
    //   // Arrange
    //   const id = '123';

    //   // Mock Firestore get behavior for non-existent document
    //   (db.collection as jest.Mock).mockReturnValueOnce({
    //     doc: () => ({
    //       get: jest.fn().mockResolvedValueOnce({ exists: false })
    //     })
    //   });

    //   // Act
    //   const user = await fetchUserFromFirestore(id);

    //   // Assert
    //   expect(user).toBeNull();
    // });
    it("[NEGATIVE] should handle errors while adding a user to Firestore", async () => {
      // Simulate an error in the add function
      const newUser: User = {
        id: "generated-id", // Just for the interface, Firestore will not need this
        name: "New User",
        email: "newuser@example.com",
        phone: "123456789",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // db.collection("USERS").add.mockRejectedValue(new Error("Failed to add user"));
      (db.collection as jest.Mock).mockReturnValueOnce({
        add: jest.fn().mockRejectedValue(new Error("Failed to add user"))
      });
      // Call the function to add the user and assert that it throws an error
      try {
        await addUserToFirestore({
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } catch (error: any) {
        expect(error.message).toBe("Failed to add user");
      }
    });
  });

  describe("updateUserInFirestore", () => {
    it("[POSITIVE] should update an existing user in Firestore", async () => {
      const userId = "generated-id";
      const updateData = {
        name: "Updated User",
        email: "updateduser@example.com",
        phone: "987654321",
      };

      db.collection("USERS")
      // Call the function to update the user
      await updateUserInFirestore(userId, updateData);
      // Assert that the document's set method was called with updated data
      expect(db.collection("USERS").doc(userId).set).toHaveBeenCalledWith(expect.objectContaining({
        name: updateData.name,
        email: updateData.email,
        phone: updateData.phone,
        updatedAt: expect.any(Object), // Timestamp for update
      }),{ merge: true });
    });

    it("[NEGATIVE] should handle errors while updating user data in Firestore", async () => {
      const userId = "generated-id";
      const updateData = {
        name: "Updated User",
        email: "updateduser@example.com",
        phone: "987654321",
      };

      // Simulate error in Firestore's `set` method
      // db.collection("USERS").doc(userId).set.mockRejectedValue(new Error("Failed to update user"));
      (db.collection as jest.Mock).mockReturnValueOnce({
        doc: () => ({
          set: jest.fn().mockRejectedValue(new Error("Failed to update user"))
        })
      });
      try {
        await updateUserInFirestore(userId, updateData);
      } catch (error: any) {
        expect(error.message).toBe("Failed to update user");
      }
    });
  });

  describe("fetchUserFromFirestore", () => {
    it("[POSITIVE] should fetch a user from Firestore", async () => {
      const userId = "generated-id";

      const user = await fetchUserFromFirestore(userId);

      // Assert the correct user is fetched from Firestore
      expect(user).toEqual({
        id: "generated-id",
        name: "Updated User",
        email: "updateduser@example.com",
        phone: "987654321",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      db.collection("USERS").doc(userId);

      // Assert that the document's get method was called to retrieve the user
      expect(db.collection("USERS").doc(userId).get).toHaveBeenCalled();
    });

    it("[NEGATIVE] should handle errors while fetching user data from Firestore", async () => {
      const userId = "generated-id";

      // Simulate an error in the Firestore `get` method
      // db.collection("USERS").doc(userId).get.mockRejectedValue(new Error("Failed to fetch user"));
      (db.collection as jest.Mock).mockReturnValueOnce({
        doc: () => ({
          get: jest.fn().mockRejectedValue(new Error("Failed to update user"))
        })
      });
      try {
        await fetchUserFromFirestore(userId);
      } catch (error: any) {
        expect(error.message).toBe("Failed to fetch user");
      }
    });

    it("[NEGATIVE] should return null if the user does not exist", async () => {
      // Mock get to return no data (non-existent user)
      (db.collection("USERS").doc("nonexistent-id").get as jest.Mock).mockReturnValue({
        exists: false,
        data: null,
      });
      
      const user = await fetchUserFromFirestore("nonexistent-id");
      expect(user).toBeNull();
      // Ensure that the get method was called
      expect(db.collection("USERS").doc("nonexistent-id").get).toHaveBeenCalled();
    });
  });
});
