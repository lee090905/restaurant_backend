import { Request, Response } from 'express';

export class PaymentController {
  generateQr = async (req: Request, res: Response) => {
    try {
      const { orderId, amount } = req.body;
      
      if (!orderId || !amount) {
        return res.status(400).json({ message: 'orderId and amount are required' });
      }

      // Hardcoded bank details for demonstration/testing
      // In production, these should come from env variables or DB settings
      const BANK_ID = '970415'; // VietinBank bin code
      const ACCOUNT_NO = '113366668888';
      const ACCOUNT_NAME = 'NHA HANG TEST';
      const TEMPLATE = 'compact2'; // VietQR template

      const qrString = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${amount}&addInfo=${orderId}&accountName=${ACCOUNT_NAME}`;

      return res.status(200).json({ 
        success: true, 
        qr_string: qrString 
      });
    } catch (err: any) {
      console.error('Generate QR error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}
