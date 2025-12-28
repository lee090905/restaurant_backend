import { category, Dish } from "./Dish";

export interface DishCreateData {
    name: string;
    price: number;
    category: category;
}
export interface DishUpdateData {
    id: number;
    name?: string;
    price?: number;
    category?: category;
} 
export interface IDishRepository {
    findById(id: number): Promise<Dish>;
    create(dish: DishCreateData): Promise<Dish>;
    update(dish: DishUpdateData): Promise<Dish>;
    delete(id: number): Promise<void>;
    paginate(page: number, limit: number): Promise<Dish[]>;
}