import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { env } from "@/src/lib/env";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getKey() {
  const key = Buffer.from(env.ENCRYPTION_KEY_BASE64, "base64");
  if (key.length !== 32) {
    throw new Error("ENCRYPTION_KEY_BASE64 must decode to 32 bytes");
  }
  return key;
}

export function encrypt(plainText: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv.toString("base64"), authTag.toString("base64"), encrypted.toString("base64")].join(":");
}

export function decrypt(cipherText: string): string {
  const [ivBase64, authTagBase64, dataBase64] = cipherText.split(":");
  const decipher = createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivBase64, "base64"));
  decipher.setAuthTag(Buffer.from(authTagBase64, "base64"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataBase64, "base64")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}
