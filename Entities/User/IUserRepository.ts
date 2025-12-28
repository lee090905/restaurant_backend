import { User, role } from "./User";

export interface UserCreateData {
  username: string;
    password: string;
    role?: role;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserUpdateData {
  id: number;
  username?: string;
  password?: string;
  role?: role;
}

export interface IUserRepository {
  create(data: UserCreateData): Promise<User>;
  update(data: UserUpdateData): Promise<User>;
  delete(id: number): Promise<void>;
  paginate(page: number, limit: number): Promise<User[]>;
  findByUsername(username: string): Promise<User | null>;
  findById(id: number): Promise<User>;
}

