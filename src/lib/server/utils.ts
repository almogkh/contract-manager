import { createHash } from 'node:crypto';

/**
 * Computes a SHA-256 hash of a given password.
 *
 * This function takes a password as input, creates a SHA-256 hash using the Node.js 
 * crypto module, and returns the hexadecimal representation of the hash. 
 * This is useful for securely storing passwords by hashing them instead of storing plain text.
 *
 * @param {string} password - The plain text password to be hashed.
 * @returns {string} The SHA-256 hash of the password in hexadecimal format.
 */
export function computeHash(password: string): string {
    // Create a new hash object using the SHA-256 algorithm
    const hash = createHash('sha256');

    // Update the hash object with the password
    hash.update(password);

    // Calculate the hash digest and convert it to a hexadecimal string
    return hash.digest('hex');
}
