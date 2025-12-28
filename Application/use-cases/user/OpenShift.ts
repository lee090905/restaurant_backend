import { IUserRepository } from "../../../Entities/User/IUserRepository";
import { IWorkshiftsRepository } from "../../../Entities/Workshifts/WorkshiftsRepository";
import { Workshifts } from "../../../Entities/Workshifts/Workshifts";

export interface OpenShiftRequest {
  username: string;
}

export class OpenShift {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly workshiftsRepository: IWorkshiftsRepository
  ) {}

  async execute(request: OpenShiftRequest): Promise<Workshifts> {
    // Find user by username
    const user = await this.userRepository.findByUsername(request.username);
    if (!user) {
      throw new Error("User not found");
    }

    // If there's an existing open workshift for this user, close it and add a note
    const existing = await this.workshiftsRepository.findByUserId(user.id);
    if (existing) {
      await this.workshiftsRepository.update({
        id: existing.id,
        endtime: new Date(),
        status: "close",
        note: "chưa đóng ca"
      });
    }

    // Create a new workshift with status 'open' and starttime as current time
    const workshift = await this.workshiftsRepository.create({
      user: user.id,
      starttime: new Date(),
      status: "open"
    });

    return workshift;
  }
}
