import { Router } from "express";
import { authenticate, requireOwner } from "@middlewares/auth.middleware";
import { validate } from "@middlewares/validate.middleware";
import { OwnerSalonController } from "@controllers/owner/salon.controller";
import { OwnerAppointmentController } from "@controllers/owner/appointment.controller";
import { OwnerAnalyticsController } from "@controllers/owner/analytics.controller";
import { OwnerCustomerController } from "@controllers/owner/customer.controller";
import {
  updateSalonSchema,
  createSalonSchema,
  createStaffSchema,
  updateStaffSchema,
  blockSlotSchema,
  createServiceSchema,
  updateServiceSchema,
  createAppointmentSchema,
  updateAppointmentStatusSchema,
  rescheduleAppointmentSchema,
  updateCustomerSchema,
  analyticsQuerySchema,
  dateQuerySchema,
  dateRangeQuerySchema,
} from "@schemas/owner.schema";

const router = Router();

// All owner routes require authentication and owner role
router.use(authenticate, requireOwner);

// ─── Salon Profile ───────────────────────────────────────────────
router.get("/salons", OwnerSalonController.listSalons);
router.post("/salons", validate(createSalonSchema), OwnerSalonController.createSalon);
router.get("/:salonId", OwnerSalonController.getSalon);
router.patch("/:salonId", validate(updateSalonSchema), OwnerSalonController.updateSalon);

// ─── Services ────────────────────────────────────────────────────
router.get("/:salonId/services", OwnerSalonController.listServices);
router.post("/:salonId/services", validate(createServiceSchema), OwnerSalonController.createService);
router.patch("/:salonId/services/:serviceId", validate(updateServiceSchema), OwnerSalonController.updateService);
router.delete("/:salonId/services/:serviceId", OwnerSalonController.deleteService);

// ─── Staff ───────────────────────────────────────────────────────
router.get("/:salonId/staff", OwnerSalonController.listStaff);
router.post("/:salonId/staff", validate(createStaffSchema), OwnerSalonController.createStaff);
router.patch("/:salonId/staff/:staffId", validate(updateStaffSchema), OwnerSalonController.updateStaff);
router.delete("/:salonId/staff/:staffId", OwnerSalonController.deleteStaff);
router.post("/:salonId/staff/blocks", validate(blockSlotSchema), OwnerSalonController.blockSlot);
router.delete("/:salonId/staff/blocks/:blockId", OwnerSalonController.removeBlock);

// ─── Appointments ────────────────────────────────────────────────
router.get("/:salonId/appointments", validate(dateQuerySchema), OwnerAppointmentController.getByDate);
router.get("/:salonId/appointments/range", validate(dateRangeQuerySchema), OwnerAppointmentController.getByDateRange);
router.post("/:salonId/appointments", validate(createAppointmentSchema), OwnerAppointmentController.create);
router.patch("/:salonId/appointments/:appointmentId/status", validate(updateAppointmentStatusSchema), OwnerAppointmentController.updateStatus);
router.patch("/:salonId/appointments/:appointmentId/reschedule", validate(rescheduleAppointmentSchema), OwnerAppointmentController.reschedule);

// ─── Analytics ───────────────────────────────────────────────────
router.get("/:salonId/analytics", validate(analyticsQuerySchema), OwnerAnalyticsController.getDashboard);

// ─── Customers (CRM) ─────────────────────────────────────────────
router.get("/:salonId/customers", OwnerCustomerController.list);
router.get("/:salonId/customers/:customerId", OwnerCustomerController.getById);
router.patch("/:salonId/customers/:customerId", validate(updateCustomerSchema), OwnerCustomerController.update);

export default router;
