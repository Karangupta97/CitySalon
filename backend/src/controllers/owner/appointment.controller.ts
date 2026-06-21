import { Request, Response } from "express";
import { AppointmentService } from "@services/appointment.service";
import { CustomerService } from "@services/customer.service";
import { sendSuccess } from "@utils/response";
import { asyncHandler } from "@utils/asyncHandler";

export class OwnerAppointmentController {
  /** GET /owner/:salonId/appointments?date=YYYY-MM-DD */
  static getByDate = asyncHandler(async (req: Request, res: Response) => {
    const salonId = req.params.salonId as string;
    const date = req.query.date as string;
    const appointments = await AppointmentService.getByDate(salonId, date);
    return sendSuccess(res, appointments, "Appointments fetched successfully.");
  });

  /** GET /owner/:salonId/appointments/range?startDate=...&endDate=... */
  static getByDateRange = asyncHandler(async (req: Request, res: Response) => {
    const salonId = req.params.salonId as string;
    const { startDate, endDate } = req.query as { startDate: string; endDate: string };
    const appointments = await AppointmentService.getByDateRange(salonId, startDate, endDate);
    return sendSuccess(res, appointments, "Appointments fetched successfully.");
  });

  /** POST /owner/:salonId/appointments — Create appointment (walk-in or manual) */
  static create = asyncHandler(async (req: Request, res: Response) => {
    const salonId = req.params.salonId as string;

    // Auto-create or look up customer
    let customerId: string | undefined;
    if (req.body.customer_name || req.body.customer_phone) {
      const customer = await CustomerService.findOrCreate(salonId, {
        name: req.body.customer_name,
        phone: req.body.customer_phone,
      });
      customerId = customer.id;
    }

    const appointment = await AppointmentService.create(salonId, {
      ...req.body,
      customer_id: customerId || null,
    });
    return sendSuccess(res, appointment, "Appointment created successfully.", 201);
  });

  /** PATCH /owner/:salonId/appointments/:appointmentId/status — Update status */
  static updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const appointmentId = req.params.appointmentId as string;
    const { status } = req.body;
    const appointment = await AppointmentService.updateStatus(appointmentId, status);
    return sendSuccess(res, appointment, "Appointment status updated.");
  });

  /** PATCH /owner/:salonId/appointments/:appointmentId/reschedule — Reschedule */
  static reschedule = asyncHandler(async (req: Request, res: Response) => {
    const appointmentId = req.params.appointmentId as string;
    const { date, start_time, end_time } = req.body;
    const appointment = await AppointmentService.reschedule(appointmentId, date, start_time, end_time);
    return sendSuccess(res, appointment, "Appointment rescheduled successfully.");
  });
}
