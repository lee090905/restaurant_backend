import { PaymentSetting } from "./PaymentSetting";

export interface PaymentSettingUpdateData {
  bankBin: string;
  bankName: string;
  accountNo: string;
  accountName: string;
  qrTemplate: string;
}

export interface IPaymentSettingRepository {
  getSettings(): Promise<PaymentSetting>;
  updateSettings(data: PaymentSettingUpdateData): Promise<PaymentSetting>;
}
