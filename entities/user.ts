export interface User {
  id?: string; // Unique user ID
  name: string;
  email: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}
