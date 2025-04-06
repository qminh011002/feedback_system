import bcrypt from 'bcrypt';

/**
 * Hashes a plain text password.
 * @param password - The plain text password to hash.
 * @returns The hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
	const saltRounds = 10; // Adjust the salt rounds as needed
	const hashedPassword = await bcrypt.hash(password, saltRounds);
	return hashedPassword;
}

/**
 * Compares a plain text password with a hashed password.
 * @param password - The plain text password.
 * @param hashedPassword - The hashed password to compare against.
 * @returns True if the passwords match, false otherwise.
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
	const isMatch = await bcrypt.compare(password, hashedPassword);
	return isMatch;
}
