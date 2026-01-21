import { IUserRepository } from "../../../Entities/User/IUserRepository"
import { IEncrypter } from "../../../Contracts/IEncrypter";
import { ITokenGenerator } from "../../../Contracts/ITokenGenerator";
import { LoginResult } from "../user/LoginResult";


export interface Credentials {
  username: string;
  password: string;
}

export class Login {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encrypter: IEncrypter,
    private readonly tokenGenerator: ITokenGenerator
  ) {}

  async execute(credentials: Credentials): Promise<LoginResult> {
    const user = await this.userRepository.findByUsername(credentials.username);
    if (!user) {
      throw new Error("Invalid username or password");
    }

    if (!user.password) {
      throw new Error("Invalid username or password");
    }

    const isValid = await this.encrypter.compare(
      credentials.password,
      user.password
    );

    if (!isValid) {
      throw new Error("Invalid username or password");
    }

    if (!user.role) {
      throw new Error("User role is missing");
    }


    const token = this.tokenGenerator.generate({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      token,
    };
  }
}
