export interface WorkshiftsProps {
  id: number;
  user: number;
  starttime: Date;
  endtime?: Date;
  note?: string;
  status: workshiftstatus;
  totalhours?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type workshiftstatus = 'open' | 'close';

export class Workshifts {
  private constructor(private readonly props: WorkshiftsProps) {}
  get id() {
    return this.props.id;
  }
  get user() {
    return this.props.user;
  }
  get starttime() {
    return this.props.starttime;
  }
  get endtime() {
    return this.props.endtime;
  }
  get note() {
    return this.props.note;
  }
  get status() {
    return this.props.status;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  static create(props: WorkshiftsProps) {
    return new Workshifts(props);
  }
  toJSON() {
    return {
      id: this.id,
      user: this.user,
      starttime: this.starttime,
      endtime: this.endtime,
      note: this.note,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
  static fromJSON(json: any) {
    return new Workshifts({
      id: json.id,
      user: json.user,
      starttime: json.starttime,
      endtime: json.endtime,
      note: json.note,
      status: json.status,
      createdAt: json.createdAt,
      updatedAt: json.updatedAt,
    });
  }
}
