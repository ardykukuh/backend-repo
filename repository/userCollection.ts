import { db } from "../config/firebaseConfig"; // `firebase-admin` Firestore client
import { User } from "../entities/user";
import { Timestamp } from "firebase-admin/firestore";

const usersCollection = db.collection("USERS");

export const addUserToFirestore = async (data: User): Promise<void> => {
  const userRef = await usersCollection.add({
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  console.log(`User added with ID: ${userRef.id}`);
};

export const updateUserInFirestore = async (id: string, data: Partial<User>): Promise<void> => {
  const userRef = usersCollection.doc(id);
  await userRef.set({ ...data, updatedAt: Timestamp.now() }, { merge: true });
};

export const fetchUserFromFirestore = async (id: string): Promise<User | null> => {
  const userRef = usersCollection.doc(id);
  const userSnap = await userRef.get();

  if (userSnap.exists) {
    return { id, ...userSnap.data() } as User;
  } else {
    return null;
  }
};
