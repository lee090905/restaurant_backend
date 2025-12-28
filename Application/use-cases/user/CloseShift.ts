import { IUserRepository } from "../../../Entities/User/IUserRepository";
import { IWorkshiftsRepository } from "../../../Entities/Workshifts/WorkshiftsRepository";
import { Workshifts } from "../../../Entities/Workshifts/Workshifts";

export interface CloseShiftRequest {
  username: string;
}

export class CloseShift {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly workshiftsRepository: IWorkshiftsRepository
  ) {}

  async execute(request: CloseShiftRequest): Promise<Workshifts> {
    // Find user by username
    const user = await this.userRepository.findByUsername(request.username);
    if (!user) {
      throw new Error("User not found");
    }

    // Find the open workshift for the user
    const workshift = await this.workshiftsRepository.findByUserId(user.id);
    if (!workshift) {
      throw new Error("No open workshift found for this user");
    }

    // Update the workshift with endtime and status 'close'
    const updatedWorkshift = await this.workshiftsRepository.update({
      id: workshift.id,
      endtime: new Date(),
      status: "close"
    });

    return updatedWorkshift;
  }
}