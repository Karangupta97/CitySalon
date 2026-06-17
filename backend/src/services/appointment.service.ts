import { AppointmentRepository, AppointmentRow, AppointmentStatus } from "@repositories/appointment.repository";
import { CustomerRepository } from "@repositories/customer.repository";
import { SalonRepository } from "@repositories/salon.repository";
import { NotFoundError, BadRequestError } from "@errors/HttpError";
import { logger } from "@utils/logger";

export class AppointmentService {
  /**
   * Get appointments for a salon on a specific date.
   */
  static async getByDate(salonId: string, date: string): Promise<AppointmentRow[]> {
    return AppointmentRepository.findBySalonAndDate(salonId, date);
  }

  /**
   * Get appointments for a date range.
   */
  static async getByDateRange(salonId: string, startDate: string, endDate: string): Promise<AppointmentRow[]> {
    return AppointmentRepository.findBySalonDateRange(salonId, startDate, endDate);
  }

  /**
   * Create a new appointment (walk-in or booked).
   */
  static async create(salonId: string, data: Partial<AppointmentRow>): Promise<AppointmentRow> {
    const appointment = await AppointmentRepository.create({
      salon_id: salonId,
      service_ids: data.service_ids || [],
      service_names: data.service_names || [],
      date: data.date!,
      start_time: data.start_time!,
      end_time: data.end_time!,
      total_price: data.total_price || 0,
      status: data.status || "pending",
      is_walk_in: data.is_walk_in || false,
      customer_id: data.customer_id || null,
      staff_id: data.staff_id || null,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      notes: data.notes,
    });

    // Update customer stats if linked
    if (data.customer_id) {
      const customer = await CustomerRepository.findById(data.customer_id);
      if (customer) {
        await CustomerRepository.update(data.customer_id, {
          visit_count: (customer.visit_count || 0) + 1,
          total_spent: (customer.total_spent || 0) + (data.total_price || 0),
          last_visit_at: new Date().toISOString(),
        });
      }
    }

    logger.info("Appointment created", { appointmentId: appointment.id, salonId });
    return appointment;
  }

  /**
   * Update appointment status (confirm, cancel, mark no-show, complete).
   */
  static async updateStatus(appointmentId: string, status: AppointmentStatus): Promise<AppointmentRow> {
    const appointment = await AppointmentRepository.findById(appointmentId);
    if (!appointment) throw new NotFoundError("Appointment not found.");

    const updated = await AppointmentRepository.update(appointmentId, { status });
    logger.info("Appointment status updated", { appointmentId, status });
    return updated;
  }

  /**
   * Reschedule an appointment.
   */
  static async reschedule(
    appointmentId: string,
    date: string,
    startTime: string,
    endTime: string,
  ): Promise<AppointmentRow> {
    const appointment = await AppointmentRepository.findById(appointmentId);
    if (!appointment) throw new NotFoundError("Appointment not found.");

    const updated = await AppointmentRepository.update(appointmentId, {
      date,
      start_time: startTime,
      end_time: endTime,
    });
    logger.info("Appointment rescheduled", { appointmentId, date, startTime });
    return updated;
  }
}
