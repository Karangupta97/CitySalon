import { StaffRepository, StaffRow, StaffBlockRow } from "@repositories/staff.repository";
import { NotFoundError } from "@errors/HttpError";
import { logger } from "@utils/logger";

export class StaffService {
  /**
   * Get all staff for a salon.
   */
  static async list(salonId: string): Promise<StaffRow[]> {
    return StaffRepository.findBySalonId(salonId);
  }

  /**
   * Create a new staff member.
   */
  static async create(salonId: string, data: Partial<StaffRow>): Promise<StaffRow> {
    const staff = await StaffRepository.create({
      salon_id: salonId,
      name: data.name!,
      role: data.role || "Stylist",
      speciality: data.speciality,
      experience: data.experience,
      phone: data.phone,
      email: data.email,
      photo: data.photo,
      availability: data.availability || "available",
    });
    logger.info("Staff created", { staffId: staff.id, salonId });
    return staff;
  }

  /**
   * Update staff info or availability.
   */
  static async update(staffId: string, data: Partial<StaffRow>): Promise<StaffRow> {
    const staff = await StaffRepository.findById(staffId);
    if (!staff) throw new NotFoundError("Staff member not found.");
    const updated = await StaffRepository.update(staffId, data);
    logger.info("Staff updated", { staffId });
    return updated;
  }

  /**
   * Soft-delete a staff member.
   */
  static async remove(staffId: string): Promise<void> {
    const staff = await StaffRepository.findById(staffId);
    if (!staff) throw new NotFoundError("Staff member not found.");
    await StaffRepository.delete(staffId);
    logger.info("Staff removed", { staffId });
  }

  /**
   * Block a stylist's slot (lunch break, day off, etc.).
   */
  static async blockSlot(block: StaffBlockRow): Promise<StaffBlockRow> {
    const created = await StaffRepository.createBlock(block);
    logger.info("Slot blocked", { staffId: block.staff_id, date: block.date });
    return created;
  }

  /**
   * Remove a block.
   */
  static async removeBlock(blockId: string): Promise<void> {
    await StaffRepository.deleteBlock(blockId);
    logger.info("Block removed", { blockId });
  }
}
