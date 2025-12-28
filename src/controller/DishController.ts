import { Request, Response } from "express";
import { IDishRepository,DishCreateData,DishUpdateData } from "../../Entities/Dish/IDishRepository";

export class DishController {
  constructor(
    private readonly dishRepository: IDishRepository,
  ) {}
 
  create = async (req: Request, res: Response) => {
    try {
      const body = req.body as DishCreateData;

      if(!body){
        return  res.status(400).json({message:"Request body is required"});
      }

      if (!body.name || body.price == null || !body.category) {
        return res.status(400).json({ message: "name, price, category required" });
      }

      const dish = await this.dishRepository.create({
        name: body.name,
        price: Number(body.price),
        category: body.category,
      });

      return res.status(201).json(dish.toJSON());
    } catch (err: any) {
      console.error("Create dish error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "Invalid id" });
      }

      const body = req.body as DishUpdateData;

      const dish = await this.dishRepository.update({
        id,
        name: body.name,
        price: body.price == null ? undefined : Number(body.price),
        category: body.category,
      });

      return res.status(200).json(dish.toJSON());
    } catch (err: any) {
      if (err.message === "Dish not found") {
        return res.status(404).json({ message: "Dish not found" });
      }
      console.error("Update dish error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "Invalid id" });
      }

      await this.dishRepository.delete(id);
      return res.status(204).send();
    } catch (err: any) {
      console.error("Delete dish error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  paginate = async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 25);

      const dishes = await this.dishRepository.paginate(page, limit);

      return res.status(200).json(dishes.map((d) => d.toJSON()));
    } catch (err: any) {
      console.error("List dishes error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  findbyId = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "Invalid id" });
      }

      const dish = await this.dishRepository.findById(id);
      if (!dish) {
        return res.status(404).json({ message: "Dish not found" });
      }

      return res.status(200).json(dish.toJSON());
    } catch (err: any) {
      console.error("Find dish by id error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}