import { IUserRepository } from '../../../Entities/User/IUserRepository';
import { IWorkshiftsRepository } from '../../../Entities/Workshifts/IWorkshiftsRepository';

export class HandleShift {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly workshiftRepo: IWorkshiftsRepository,
  ) {}

  async execute(username: string) {
    const user = await this.userRepo.findByUsername(username);
    if (!user) throw new Error('Nhân viên không tồn tại');

    const currentShift = await this.workshiftRepo.findByUserId(user.id);

    // MỞ CA
    if (!currentShift) {
      const shift = await this.workshiftRepo.create({
        user: user.id,
        starttime: new Date(),
        status: 'open',
      });

      return {
        action: 'open',
        shift,
      };
    }

    // ĐÓNG CA (Tính tổng giờ)
    const endTime = new Date();
    const startTime = new Date(currentShift.starttime);

    // Tính chênh lệch milliseconds và đổi sang giờ (giữ 2 số thập phân)
    const diffMs = endTime.getTime() - startTime.getTime();
    const totalHours = Number((diffMs / (1000 * 60 * 60)).toFixed(2));

    const closedShift = await this.workshiftRepo.update({
      id: currentShift.id,
      endtime: endTime,
      status: 'close',
      totalhours: totalHours, // Truyền tổng giờ vào đây
    });

    return {
      action: 'close',
      shift: closedShift,
    };
  }
}
