export interface UserProps {
  id: number;
  username: string;
  password: string;
  role?: role;
  createdAt?: Date;
  updatedAt?: Date;
}

export type role = 'admin' | 'staff';

export class User {
  private constructor(private readonly props: UserProps) {}

  get id() { return this.props.id; }
  get username() { return this.props.username; }
  get password() { return this.props.password; }
  get role() { return this.props.role; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  static create(props: UserProps) { return new User(props); }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static fromJSON(json: any) {
    return new User({
      id: json.id,
      username: json.username,
      password: json.password,
      role: json.role,
      createdAt: json.createdAt,
      updatedAt: json.updatedAt
    });
  }
}
