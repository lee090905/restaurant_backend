import { Request, Response } from "express";
import { IUserRepository, UserCreateData, UserUpdateData } from "../../Entities/User/IUserRepository";

export class UserController {
  constructor(private readonly userRepository: IUserRepository) {}

  create = async (req: Request, res: Response) => {
    try {
      const body = req.body as UserCreateData;
      if (!body){
        return res.status(400).json({ message: "Request body is required" });
      }
      if (!body.username || !body.password || !body.role) {
        return res.status(400).json({ message: "username, password, role are required" });
      }
      const user = await this.userRepository.create({
        username: body.username,
        password: body.password,
        role: body.role,
      });
      return res.status(201).json(user.toJSON());
    } catch (err: any) {
      console.error("Create user error:", err);
      return res.status(500).json({ message: "server error" });
    }
  };

  paginate = async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);
      const list = await this.userRepository.paginate(page, limit);
      return res.status(200).json(list.map(user => user.toJSON()));
    } catch (err: any) {
      console.error("Paginate users error:", err);
      return res.status(500).json({ message: "server error" });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

      const body = req.body as UserUpdateData;
      const updated = await this.userRepository.update({
        id,
        username: body.username,
        password: body.password,
        role: body.role,
      });

      return res.status(200).json(updated.toJSON());
    } catch (err: any) {
      console.error("Update user error:", err);
      return res.status(500).json({ message: "server error" });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

      await this.userRepository.delete(id);
      return res.status(204).send();
    } catch (err: any) {
      console.error("Delete user error:", err);
      return res.status(500).json({ message: "server error" });
    }
  };
}