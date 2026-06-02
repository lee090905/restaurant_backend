export interface PaymentSettingProps {
  id: number;
  bankBin: string;
  bankName: string;
  accountNo: string;
  accountName: string;
  qrTemplate: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PaymentSetting {
  private constructor(private readonly props: PaymentSettingProps) {}

  get id() { return this.props.id; }
  get bankBin() { return this.props.bankBin; }
  get bankName() { return this.props.bankName; }
  get accountNo() { return this.props.accountNo; }
  get accountName() { return this.props.accountName; }
  get qrTemplate() { return this.props.qrTemplate; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  static create(props: PaymentSettingProps) {
    return new PaymentSetting(props);
  }

  toJSON() {
    return {
      id: this.id,
      bankBin: this.bankBin,
      bankName: this.bankName,
      accountNo: this.accountNo,
      accountName: this.accountName,
      qrTemplate: this.qrTemplate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static fromJSON(json: PaymentSettingProps): PaymentSetting {
    return new PaymentSetting({
      id: json.id,
      bankBin: json.bankBin,
      bankName: json.bankName,
      accountNo: json.accountNo,
      accountName: json.accountName,
      qrTemplate: json.qrTemplate,
      createdAt: json.createdAt,
      updatedAt: json.updatedAt
    });
  }
}
