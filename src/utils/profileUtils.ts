
import md5 from "md5";

/**
 * Generate a Gravatar URL from an email address
 * @param email User's email address
 * @param size Image size in pixels (default: 200)
 * @returns Gravatar URL
 */
export const getGravatarUrl = (email: string, size: number = 200): string => {
  // Trim whitespace and convert to lowercase
  const normalizedEmail = email.trim().toLowerCase();
  
  // Generate an MD5 hash of the email
  const hash = md5(normalizedEmail);
  
  // Construct and return the Gravatar URL
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
};
