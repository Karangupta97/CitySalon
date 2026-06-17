import { SalonRepository, SalonRow } from "@repositories/salon.repository";
import { NotFoundError, ForbiddenError } from "@errors/HttpError";
import { logger } from "@utils/logger";

export class SalonService {
  /**
   * Returns all salons for a given owner.
   */
  static async getMySalons(ownerId: string): Promise<SalonRow[]> {
    return SalonRepository.findByOwnerId(ownerId);
  }

  /**
   * Returns a single salon if the owner matches.
   */
  static async getMySalon(ownerId: string, salonId: string): Promise<SalonRow> {
    const salon = await SalonRepository.findByOwnerAndId(ownerId, salonId);
    if (!salon) throw new NotFoundError("Salon not found or you do not have access.");
    return salon;
  }

  /**
   * Creates a salon and assigns ownership to the caller.
   */
  static async createSalon(ownerId: string, data: Partial<SalonRow>): Promise<SalonRow> {
    const salon = await SalonRepository.create({
      ...data,
      owner_id: ownerId,
      name: data.name || "Untitled Salon",
    } as SalonRow);
    logger.info("Salon created", { salonId: salon.id, ownerId });
    return salon;
  }

  /**
   * Updates salon profile info.
   */
  static async updateSalon(ownerId: string, salonId: string, data: Partial<SalonRow>): Promise<SalonRow> {
    // Verify ownership
    await this.getMySalon(ownerId, salonId);
    const updated = await SalonRepository.update(salonId, data);
    logger.info("Salon updated", { salonId });
    return updated;
  }
}
