import { Request, Response } from "express";
import { IWorkshiftsRepository, WorkshiftsCreateData, WorkshiftsUpdateData } from "../../Entities/Workshifts/WorkshiftsRepository";
import { IUserRepository } from "../../Entities/User/IUserRepository";
import { OpenShift } from "../../Application/use-cases/user/OpenShift";
import { CloseShift } from "../../Application/use-cases/user/CloseShift";

export class WorkshiftsController {
  constructor(
    private readonly workshiftsRepository: IWorkshiftsRepository,
    private readonly userRepository: IUserRepository
  ) {}

  create = async (req: Request, res: Response) => {
    try {
      const body = req.body as WorkshiftsCreateData;
      if (!body){
        return res.status(400).json({ message: "Request body is required" });
      }
      if (!body.user || !body.starttime) {
        return res.status(400).json({ message: "user, starttime are required" });
      }
      const workshift = await this.workshiftsRepository.create({
        user: body.user,
        starttime: body.starttime,
        endtime: body.endtime
      });
      return res.status(201).json(workshift.toJSON());
    } catch (err: any) {
      console.error("Create workshift error:", err);
      return res.status(500).json({ message: "server error" });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

      const body = req.body as WorkshiftsUpdateData;
      const updated = await this.workshiftsRepository.update({
        id,
        user: body.user,
        starttime: body.starttime,
        endtime: body.endtime,
        totalhours: body.totalhours,
        status: body.status,
      });

      return res.status(200).json(updated.toJSON());
    } catch (err: any) {
      console.error("Update workshift error:", err);
      return res.status(500).json({ message: "server error" });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

      await this.workshiftsRepository.delete(id);
      return res.status(204).send();
    } catch (err: any) {
      console.error("Delete workshift error:", err);
      return res.status(500).json({ message: "server error" });
    }
  };
    paginate = async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);
      const list = await this.workshiftsRepository.paginate(page, limit);
      return res.status(200).json(list.map((workshift) => workshift.toJSON()));
    } catch (err: any) {
      console.error("Paginate workshifts error:", err);
      return res.status(500).json({ message: "server error" });
    }
  };

  openShift = async (req: Request, res: Response) => {
    try {
      const body = req.body as { username?: string };
      if (!body || !body.username) return res.status(400).json({ message: "username is required" });

      const usecase = new OpenShift(this.userRepository, this.workshiftsRepository);
      const workshift = await usecase.execute({ username: body.username });
      return res.status(200).json(workshift.toJSON());
    } catch (err: any) {
      console.error("Open shift error:", err);
      return res.status(500).json({ message: err.message || "server error" });
    }
  };

  closeShift = async (req: Request, res: Response) => {
    try {
      const body = req.body as { username?: string };
      if (!body || !body.username) return res.status(400).json({ message: "username is required" });

      const usecase = new CloseShift(this.userRepository, this.workshiftsRepository);
      const workshift = await usecase.execute({ username: body.username });
      return res.status(200).json(workshift.toJSON());
    } catch (err: any) {
      console.error("Close shift error:", err);
      return res.status(500).json({ message: err.message || "server error" });
    }
  };
}