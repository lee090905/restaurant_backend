import { PaymentSetting } from "../../../Entities/PaymentSetting/PaymentSetting";
import { IPaymentSettingRepository, PaymentSettingUpdateData } from "../../../Entities/PaymentSetting/IPaymentSettingRepository";
import pool from "../mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export class PaymentSettingRepository implements IPaymentSettingRepository {
  async getSettings(): Promise<PaymentSetting> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, bank_bin as bankBin, bank_name as bankName, account_no as accountNo, account_name as accountName, qr_template as qrTemplate, createdAt, updatedAt FROM payment_settings LIMIT 1"
    );
    const row = rows[0] as any;
    if (!row) {
      throw new Error("Payment settings not found");
    }
    return PaymentSetting.create({
      id: row.id,
      bankBin: row.bankBin,
      bankName: row.bankName,
      accountNo: row.accountNo,
      accountName: row.accountName,
      qrTemplate: row.qrTemplate,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async updateSettings(data: PaymentSettingUpdateData): Promise<PaymentSetting> {
    // Luôn cập nhật record ID = 1
    const sql = `
      UPDATE payment_settings 
      SET bank_bin = ?, bank_name = ?, account_no = ?, account_name = ?, qr_template = ?
      WHERE id = 1
    `;
    await pool.query<ResultSetHeader>(sql, [
      data.bankBin,
      data.bankName,
      data.accountNo,
      data.accountName,
      data.qrTemplate,
    ]);

    return this.getSettings();
  }
}
