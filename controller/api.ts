import { Request, Response } from "express";
import { UpdateUserDto, FetchUserDto } from "../dto/userDto";
import { updateUserInFirestore, fetchUserFromFirestore, addUserToFirestore } from "../repository/userCollection";
export const addUserData = async (req: Request, res: Response): Promise<void> => {
  
  const { name, email, phone }: { name: string; email: string; phone?: string } = req.body;

  if (!name || !email) {
    res.status(400).json({ error: "Name and email are required" });
    return;
  }

  try {
    // Passing data without `id` because Firestore auto-generates it
    await addUserToFirestore({
      name,
      email,
      phone,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding user" });
  }
};
export const updateUserData = async (req: Request, res: Response): Promise<void> => {
  const { id, name, email }: UpdateUserDto & { id: string } = req.body;

  if (!id) {
    res.status(400).json({ error: "ID is required" });
    return;
  }

  try {
    await updateUserInFirestore(id, { name, email });
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
};

export const fetchUserData = async (req: Request, res: Response): Promise<void> => {
  const { id }: FetchUserDto = req.body;

  if (!id) {
    res.status(400).json({ error: "ID is required" });
    return;
  }

  try {
    const user = await fetchUserFromFirestore(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
};
