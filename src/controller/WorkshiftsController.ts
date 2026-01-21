import { Request, Response } from 'express';
import {
  IWorkshiftsRepository,
  WorkshiftsCreateData,
  WorkshiftsUpdateData,
} from '../../Entities/Workshifts/IWorkshiftsRepository';
import { HandleShift } from '../../Application/use-cases/user/HandleShift';

export class WorkshiftsController {
  constructor(
    private readonly workshiftsRepository: IWorkshiftsRepository,
    private readonly handleShift: HandleShift,
  ) {}

  create = async (req: Request, res: Response) => {
    try {
      const body = req.body as WorkshiftsCreateData;
      if (!body) {
        return res.status(400).json({ message: 'Request body is required' });
      }
      if (!body.user || !body.starttime) {
        return res
          .status(400)
          .json({ message: 'user, starttime are required' });
      }
      const workshift = await this.workshiftsRepository.create({
        user: body.user,
        starttime: body.starttime,
        endtime: body.endtime,
      });
      return res.status(201).json(workshift.toJSON());
    } catch (err: any) {
      console.error('Create workshift error:', err);
      return res.status(500).json({ message: 'server error' });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id))
        return res.status(400).json({ message: 'Invalid id' });

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
      console.error('Update workshift error:', err);
      return res.status(500).json({ message: 'server error' });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id))
        return res.status(400).json({ message: 'Invalid id' });

      await this.workshiftsRepository.delete(id);
      return res.status(204).send();
    } catch (err: any) {
      console.error('Delete workshift error:', err);
      return res.status(500).json({ message: 'server error' });
    }
  };

  paginate = async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);
      const list = await this.workshiftsRepository.paginate(page, limit);
      return res.status(200).json(list.map((workshift) => workshift.toJSON()));
    } catch (err: any) {
      console.error('Paginate workshifts error:', err);
      return res.status(500).json({ message: 'server error' });
    }
  };

  findById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id))
        return res.status(400).json({ message: 'Invalid id' });

      const workshift = await this.workshiftsRepository.findById(id);
      return res.status(200).json(workshift.toJSON());
    } catch (err: any) {
      console.error('Find workshift error:', err);
      return res.status(500).json({ message: 'server error' });
    }
  };

  handle = async (req: Request, res: Response) => {
    try {
      const { username } = req.body;
      if (!username) {
        return res.status(400).json({ message: 'Thiếu username' });
      }

      const result = await this.handleShift.execute(username);
      return res.json(result);
    } catch (e: any) {
      return res.status(400).json({ message: e.message });
    }
  };
}
