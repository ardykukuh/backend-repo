import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();
const secretKey = process.env.SECRET_KEY!; // Get the secret key from .env
console.log('secretKey',secretKey)
const exampleToken = jwt.sign({ id: "12345", name: "John Doe", email: "john.doe@example.com" }, secretKey, {
  expiresIn: "1h", // Token expires in 1 hour
});
console.log("Example Token:", exampleToken);

// export const generateToken = (payload: object): string => {
//   return jwt.sign(payload, secretKey, { expiresIn: "1h" });
// };
