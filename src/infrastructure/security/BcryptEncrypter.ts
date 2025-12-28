import { IEncrypter } from "../../../Contracts/IEncrypter";
import bcrypt from "bcryptjs";

export class BcryptEncrypter implements IEncrypter {
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
  }
  async compare(password: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(password, hashed);
  }
}