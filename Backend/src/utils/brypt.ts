import bcrypt from "bcrypt";

export const HashPassword = async (password: string): Promise<string> => {
  try {
    if (!password) {
      throw new Error("Password is required for hashing");
    }
    return await bcrypt.hash(password, 10);
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Failed to hash password");
  }
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    if (!password || !hashedPassword) {
      throw new Error(
        "Password and hashed password are required for comparison"
      );
    }
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw new Error("Failed to compare passwords");
  }
};
