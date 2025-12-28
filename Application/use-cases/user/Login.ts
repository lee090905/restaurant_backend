import { IUserRepository } from "../../../Entities/User/IUserRepository"
import { IEncrypter } from "../../../Contracts/IEncrypter";
import { ITokenGenerator } from "../../../Contracts/ITokenGenerator";


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
  
  async execute(credentials: Credentials): Promise<string> {
    const user = await this.userRepository.findByUsername(credentials.username)
    if (!user) {
      throw new Error("Invalid Username")
    }
    
    const result = await this.encrypter.compare(credentials.password, user.password)
    if (!result) {
      throw new Error("Invalid Password")
    }

    const token = this.tokenGenerator.generate({
      userId: user.id,
      username: user.username,
      role: user.role
    })

    return token
  }
}