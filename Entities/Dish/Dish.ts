
export interface DishProps {
  id: number;
  name: string;
  price: number;
  category: category;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
 
export type category = 'appetizer' | 'Salad' | 'Grilled' | 'Fried' | 'Stir-fried' | 'Steamed/Boiled' | 'Hotpot' | 'Seafood' | 'Specials' | 'Drinks' | 'inactive';

export class Dish {
  private constructor(private readonly props: DishProps) {}

  get id()         { return this.props.id; }
  get name()   { return this.props.name; }
  get price()   { return this.props.price; }
  get category()       { return this.props.category; }
  get active()    { return this.props.active; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }
  static create(props: DishProps) {
    return new Dish(props);
  }
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      category: this.category,
      active: this.active,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
  static fromJSON(json: DishProps): Dish {
    return new Dish({
      id: json.id,
      name: json.name,
      price: json.price,
      category: json.category,
      active: json.active,
      createdAt: json.createdAt,
      updatedAt: json.updatedAt,
    });
  }
}
 