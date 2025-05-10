import { ENCRYPTION_KEY } from "../config";

export async function decryptPrivateKey(
  encryptedText: string
): Promise<string> {
  if (!encryptedText || !encryptedText.includes(":")) {
    throw new Error("Invalid encrypted private key format");
  }

  const [ivHex, encryptedHex] = encryptedText.split(":");
  if (!ivHex || !encryptedHex) {
    throw new Error("Invalid encrypted text, missing iv or encrypted data");
  }

  const iv = hexToArrayBuffer(ivHex);
  const encryptedBuffer = hexToArrayBuffer(encryptedHex);

  const keyBuffer = new TextEncoder().encode(ENCRYPTION_KEY);

  const key = await window.crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-CBC" },
    false,
    ["decrypt"]
  );

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-CBC", iv: iv },
    key,
    encryptedBuffer
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}


function hexToArrayBuffer(hex: string): ArrayBuffer {
  const buffer = new ArrayBuffer(hex.length / 2);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < hex.length; i += 2) {
    view[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return buffer;
}

