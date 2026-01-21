import { Workshifts, workshiftstatus } from "./Workshifts";

export interface IWorkshiftsRepository {
  create(data: WorkshiftsCreateData): Promise<Workshifts>;
  update(data: WorkshiftsUpdateData): Promise<Workshifts>;
  delete(id: number): Promise<void>;
  paginate(page: number, limit: number): Promise<Workshifts[]>;
  findById(id: number): Promise<Workshifts>;
  findByUserId(userId: number): Promise<Workshifts | null>;
}

export interface WorkshiftsCreateData {
  user: number;
  starttime: Date;
  endtime?: Date;
  note?: string;
  status?: workshiftstatus;
}

export interface WorkshiftsUpdateData {
  id: number;
  user?: number;
  starttime?: Date;
  endtime?: Date;
  note?: string;
  totalhours?: number;
  status?: workshiftstatus;
}
