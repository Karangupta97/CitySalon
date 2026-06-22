import { Request, Response } from "express";
import { SalonService } from "@services/salon.service";
import { ServiceRepository } from "@repositories/service.repository";
import { StaffService } from "@services/staff.service";
import { StorageService } from "@services/storage.service";
import { sendSuccess } from "@utils/response";
import { asyncHandler } from "@utils/asyncHandler";

export class OwnerSalonController {
  /** POST /owner/upload — Upload image to S3 */
  static uploadImage = asyncHandler(async (req: Request, res: Response) => {
    const { filename, contentType, base64Data } = req.body;
    const url = await StorageService.uploadBase64(base64Data, filename, contentType);
    return sendSuccess(res, { url }, "Image uploaded successfully.", 201);
  });

  /** GET /owner/:salonId — Get salon profile */
  static getSalon = asyncHandler(async (req: Request, res: Response) => {
    const ownerId = req.user!.userId;
    const salonId = req.params.salonId as string;
    const salon = await SalonService.getMySalon(ownerId, salonId);
    return sendSuccess(res, salon, "Salon fetched successfully.");
  });

  /** GET /owner/salons — List all owner's salons */
  static listSalons = asyncHandler(async (req: Request, res: Response) => {
    const ownerId = req.user!.userId;
    const salons = await SalonService.getMySalons(ownerId);
    return sendSuccess(res, salons, "Salons fetched successfully.");
  });

  /** POST /owner/salons — Create a salon */
  static createSalon = asyncHandler(async (req: Request, res: Response) => {
    const ownerId = req.user!.userId;
    const salon = await SalonService.createSalon(ownerId, req.body);
    return sendSuccess(res, salon, "Salon created successfully.", 201);
  });

  /** PATCH /owner/:salonId — Update salon profile */
  static updateSalon = asyncHandler(async (req: Request, res: Response) => {
    const ownerId = req.user!.userId;
    const salonId = req.params.salonId as string;
    const salon = await SalonService.updateSalon(ownerId, salonId, req.body);
    return sendSuccess(res, salon, "Salon updated successfully.");
  });

  /** GET /owner/:salonId/services — List services */
  static listServices = asyncHandler(async (req: Request, res: Response) => {
    const salonId = req.params.salonId as string;
    const activeOnly = req.query.activeOnly !== "false";
    const services = await ServiceRepository.findBySalonId(salonId, activeOnly);
    return sendSuccess(res, services, "Services fetched successfully.");
  });

  /** POST /owner/:salonId/services — Add a service */
  static createService = asyncHandler(async (req: Request, res: Response) => {
    const salonId = req.params.salonId as string;
    const service = await ServiceRepository.create({ ...req.body, salon_id: salonId });
    return sendSuccess(res, service, "Service created successfully.", 201);
  });

  /** PATCH /owner/:salonId/services/:serviceId — Update a service */
  static updateService = asyncHandler(async (req: Request, res: Response) => {
    const serviceId = req.params.serviceId as string;
    const service = await ServiceRepository.update(serviceId, req.body);
    return sendSuccess(res, service, "Service updated successfully.");
  });

  /** DELETE /owner/:salonId/services/:serviceId — Deactivate a service */
  static deleteService = asyncHandler(async (req: Request, res: Response) => {
    const serviceId = req.params.serviceId as string;
    await ServiceRepository.delete(serviceId);
    return sendSuccess(res, null, "Service deactivated successfully.");
  });

  /** GET /owner/:salonId/staff — List staff */
  static listStaff = asyncHandler(async (req: Request, res: Response) => {
    const salonId = req.params.salonId as string;
    const staff = await StaffService.list(salonId);
    return sendSuccess(res, staff, "Staff fetched successfully.");
  });

  /** POST /owner/:salonId/staff — Add staff */
  static createStaff = asyncHandler(async (req: Request, res: Response) => {
    const salonId = req.params.salonId as string;
    const staff = await StaffService.create(salonId, req.body);
    return sendSuccess(res, staff, "Staff member created successfully.", 201);
  });

  /** PATCH /owner/:salonId/staff/:staffId — Update staff */
  static updateStaff = asyncHandler(async (req: Request, res: Response) => {
    const staffId = req.params.staffId as string;
    const staff = await StaffService.update(staffId, req.body);
    return sendSuccess(res, staff, "Staff member updated successfully.");
  });

  /** DELETE /owner/:salonId/staff/:staffId — Remove staff */
  static deleteStaff = asyncHandler(async (req: Request, res: Response) => {
    const staffId = req.params.staffId as string;
    await StaffService.remove(staffId);
    return sendSuccess(res, null, "Staff member removed successfully.");
  });

  /** POST /owner/:salonId/staff/blocks — Block a stylist slot */
  static blockSlot = asyncHandler(async (req: Request, res: Response) => {
    const salonId = req.params.salonId as string;
    const block = await StaffService.blockSlot({ ...req.body, salon_id: salonId });
    return sendSuccess(res, block, "Slot blocked successfully.", 201);
  });

  /** DELETE /owner/:salonId/staff/blocks/:blockId — Remove a block */
  static removeBlock = asyncHandler(async (req: Request, res: Response) => {
    const blockId = req.params.blockId as string;
    await StaffService.removeBlock(blockId);
    return sendSuccess(res, null, "Block removed successfully.");
  });
}
