import { Request, Response } from "express";
import { ITableRepository, TableCreateData, TableUpdateData } from "../../Entities/Table/ITableRepository";

export class TableController {
  constructor(
    private readonly tableRepository: ITableRepository,
  ) {}
    create = async (req: Request, res: Response) => {
        try {
            const body = req.body as TableCreateData;
            if(!body){
                return  res.status(400).json({message:"Request body is required"});
            }
            if (!body.name || !body.area) {
                return res.status(400).json({ message: "name, area required" });
            }
            const table = await this.tableRepository.create({
                name: body.name,
                area: body.area,
                status: body.status || 'close',
            });
            return res.status(201).json(table.toJSON());
        } catch (err: any) {
            console.error("Create table error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    };
    update = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ message: "Invalid id" });
            }
            const body = req.body as TableUpdateData;
            const table = await this.tableRepository.update({
                id,
                name: body.name,
                area: body.area,
                status: body.status,
            });
            return res.status(200).json(table.toJSON());
        } catch (err: any) {
            console.error("Update table error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    };
    delete = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ message: "Invalid id" });
            }
            await this.tableRepository.delete(id);
            return res.status(204).send();
        } catch (err: any) {
            console.error("Delete table error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }  
    };
    paginate = async (req: Request, res: Response) => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const tables = await this.tableRepository.paginate(page, limit);
            return res.status(200).json(tables.map(table => table.toJSON()));
        } catch (err: any) {
            console.error("Paginate tables error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    };
    findById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const table = await this.tableRepository.findById(id);
        if (!table) {
            return res.status(404).json({ message: "Table not found" });
        }

        return res.status(200).json(table.toJSON());
    } catch (err: any) {
        console.error("Find table by id error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
    };
}