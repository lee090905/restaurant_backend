import { Request, Response } from "express";
import { ITableReservationRepository, TableReservationCreateData, TableReservationUpdateData } from "../../Entities/Tablereservation/ITablereservationRepository";

export class TableReservationController {
  constructor(private readonly reservationRepository: ITableReservationRepository) {}

  create = async (req: Request, res: Response) => {
    try {
      const body = req.body as TableReservationCreateData;
      if (!body) return res.status(400).json({ message: "Request body is required" });

      const reservation = await this.reservationRepository.create({
        reservedAt: new Date(body.reservedAt),
        status: body.status,
        note: body.note,
      });

      return res.status(201).json(reservation.toJSON ? reservation.toJSON() : reservation);
    } catch (err: any) {
      console.error("Create reservation error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  paginate = async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 25);
      const list = await this.reservationRepository.paginate(page, limit);
      return res.status(200).json(list.map(i => (i.toJSON ? i.toJSON() : i)));
    } catch (err: any) {
      console.error("List reservations error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

      const body = req.body as TableReservationUpdateData;
      if (body.reservedAt) body.reservedAt = new Date(body.reservedAt);

      const updated = await this.reservationRepository.update({
        reservedAt: body.reservedAt,
        status: body.status,
        note: body.note,
      });

      return res.status(200).json(updated.toJSON ? updated.toJSON() : updated);
    } catch (err: any) {
      console.error("Update reservation error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

      await this.reservationRepository.delete(id);
      return res.status(204).send();
    } catch (err: any) {
      console.error("Delete reservation error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  findById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "Invalid id" });
      }
      const reservation = await this.reservationRepository.findById(id);
      if (!reservation) {
        return res.status(404).json({ message: "Table reservation not found" });
      }
      return res.status(200).json(reservation.toJSON ? reservation.toJSON() : reservation);
    } catch (err: any) {
      console.error("Find reservation error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}
