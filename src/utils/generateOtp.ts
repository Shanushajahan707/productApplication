import crypto from "crypto";

export const generateRandomString = (): string => {
  return crypto.randomInt(1000, 10000).toString(); 
};
