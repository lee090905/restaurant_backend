import { Request, Response } from 'express';
import { IPaymentSettingRepository } from '../../Entities/PaymentSetting/IPaymentSettingRepository';

export class PaymentController {
  constructor(private readonly paymentSettingRepository: IPaymentSettingRepository) {}

  generateQr = async (req: Request, res: Response) => {
    try {
      const { orderId, amount } = req.body;
      
      if (!orderId || !amount) {
        return res.status(400).json({ message: 'orderId and amount are required' });
      }

      // Fetch dynamic settings from Database
      const settings = await this.paymentSettingRepository.getSettings();

      const bankBin = settings.bankBin;
      const accountNo = settings.accountNo;
      const accountName = settings.accountName;
      const qrTemplate = settings.qrTemplate;
      const bankName = settings.bankName;

      // Generate VietQR URL according to EMVCo standards
      // Note: addInfo is usually the description of the transaction
      const description = `Thanh toan don ${orderId}`;
      const qrString = `https://img.vietqr.io/image/${bankBin}-${accountNo}-${qrTemplate}.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(accountName)}`;

      return res.status(200).json({ 
        success: true, 
        qrUrl: qrString,
        qr_string: qrString, // for backward compatibility if any
        bankInfo: {
          name: bankName,
          accountNo: accountNo,
          accountName: accountName
        }
      });
    } catch (err: any) {
      console.error('Generate QR error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  getSettings = async (req: Request, res: Response) => {
    try {
      const settings = await this.paymentSettingRepository.getSettings();
      return res.status(200).json(settings.toJSON());
    } catch (err: any) {
      console.error('Get QR settings error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  updateSettings = async (req: Request, res: Response) => {
    try {
      const { bankBin, bankName, accountNo, accountName, qrTemplate } = req.body;
      
      if (!bankBin || !bankName || !accountNo || !accountName || !qrTemplate) {
        return res.status(400).json({ message: 'All fields are required (bankBin, bankName, accountNo, accountName, qrTemplate)' });
      }

      const updated = await this.paymentSettingRepository.updateSettings({
        bankBin,
        bankName,
        accountNo,
        accountName,
        qrTemplate
      });

      return res.status(200).json({ 
        success: true, 
        message: 'Payment settings updated successfully',
        data: updated.toJSON() 
      });
    } catch (err: any) {
      console.error('Update QR settings error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}
