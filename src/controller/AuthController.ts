import { Request, Response } from "express";
import { IUserRepository } from "../../Entities/User/IUserRepository";
import { IEncrypter } from "../../Contracts/IEncrypter";
import { ITokenGenerator } from "../../Contracts/ITokenGenerator";
import { Login } from "../../Application/use-cases/user/Login";

export class AuthController {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encrypter: IEncrypter,
    private readonly tokenGenerator: ITokenGenerator
  ) {}

  login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body as {
        username: string;
        password: string;
      };

      if (!username || !password) {
        return res.status(400).json({
          message: "Username và password là bắt buộc",
        });
      }

      const loginUseCase = new Login(
        this.userRepository,
        this.encrypter,
        this.tokenGenerator
      );

      const result = await loginUseCase.execute({ username, password });

      /**
       * result PHẢI có dạng:
       * {
       *   user: { id, username, role },
       *   token: string,
       *   refreshToken?: string
       * }
       */

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(401).json({
        message: error.message || "Sai tài khoản hoặc mật khẩu",
      });
    }
  };

  logout = async (_req: Request, res: Response) => {
    // SPA + JWT: frontend tự xoá token là đủ
    return res.status(200).json({
      message: "Logged out",
    });
  };
}
