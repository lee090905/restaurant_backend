import { Request, Response } from "express"
import { IUserRepository} from "../../Entities/User/IUserRepository"
import { IEncrypter } from "../../Contracts/IEncrypter"
import { ITokenGenerator } from "../../Contracts/ITokenGenerator"
import { Login } from '../../Application/use-cases/user/Login'


export class AuthController {
    constructor(
        private readonly userRepository: IUserRepository, 
        private readonly encrypter: IEncrypter, 
        private readonly tokenGenerator: ITokenGenerator
    ){}
    

    login = async (req: Request, res: Response) => {
        try {
            const body = req.body as {
                username: string
                password: string
            }

            if (!body || !body.username || !body?.password) {
                res.status(401).json({
                    success: false,
                    message: "Tên đăng nhập và mật khẩu là bắt buộc"
                })  
            }

            const action = new Login(
                this.userRepository,
                this.encrypter,
                this.tokenGenerator
            )

            const token = await action.execute(body);

            return res.status(200).json({ 
                success: true, 
                token 
            });
        } catch (error: any) {
            console.error(error);
            return res.status(400).json({ 
                success: false, 
                message: error.message || "Sai tài khoản hoặc mật khẩu" 
            });
        }
    }

    logout = async (req: Request, res: Response) => {
        try {
            // In a real-world scenario, you might want to handle token blacklisting here
        } catch (error: any) {
            console.error(error);
            return res.status(400).json({ 
                success: false, 
                message: error.message || "Logout failed" 
            });
        }
        return res.status(200).json({ 
            success: true, 
            message: "Logged out successfully" 
        });
    }
}