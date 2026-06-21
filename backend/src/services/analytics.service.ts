import { AppointmentRepository } from "@repositories/appointment.repository";
import { CustomerRepository } from "@repositories/customer.repository";

export interface DashboardAnalytics {
  totalBookings: number;
  revenue: number;
  avgBookingValue: number;
  noShowRate: number;
  topService: { name: string; count: number } | null;
  topStylist: { id: string | null; count: number } | null;
  newVsReturning: { newPercent: number; returningPercent: number };
  totalCustomers: number;
  completedBookings: number;
  cancelledBookings: number;
  weeklyTrend: { date: string; bookings: number; revenue: number }[];
}

export class AnalyticsService {
  /**
   * Returns dashboard analytics for a salon within a date range.
   */
  static async getDashboard(salonId: string, startDate: string, endDate: string): Promise<DashboardAnalytics> {
    const appointments = await AppointmentRepository.getStatsForPeriod(salonId, startDate, endDate);

    const totalBookings = appointments.length;
    const completed = appointments.filter((a) => a.status === "completed" || a.status === "confirmed");
    const noShows = appointments.filter((a) => a.status === "no-show");
    const cancelled = appointments.filter((a) => a.status === "cancelled");

    const revenue = completed.reduce((sum, a) => sum + a.total_price, 0);
    const avgBookingValue = completed.length > 0 ? Math.round(revenue / completed.length) : 0;
    const noShowRate = totalBookings > 0 ? Math.round((noShows.length / totalBookings) * 1000) / 10 : 0;

    // Top service
    const serviceCount: Record<string, number> = {};
    appointments.forEach((a) => {
      (a.service_names || []).forEach((name: string) => {
        serviceCount[name] = (serviceCount[name] || 0) + 1;
      });
    });
    const topServiceName = Object.entries(serviceCount).sort((a, b) => b[1] - a[1])[0];
    const topService = topServiceName ? { name: topServiceName[0], count: topServiceName[1] } : null;

    // Top stylist
    const stylistCount: Record<string, number> = {};
    appointments.forEach((a) => {
      if (a.staff_id) stylistCount[a.staff_id] = (stylistCount[a.staff_id] || 0) + 1;
    });
    const topStylistEntry = Object.entries(stylistCount).sort((a, b) => b[1] - a[1])[0];
    const topStylist = topStylistEntry ? { id: topStylistEntry[0], count: topStylistEntry[1] } : null;

    // New vs returning: customers with visit_count = 1 during this period
    const customerIds = new Set(appointments.filter((a) => a.customer_id).map((a) => a.customer_id!));
    let newCount = 0;
    for (const cid of customerIds) {
      const c = await CustomerRepository.findById(cid);
      if (c && c.visit_count && c.visit_count <= 1) newCount++;
    }
    const returningCount = customerIds.size - newCount;
    const total = customerIds.size || 1;
    const newVsReturning = {
      newPercent: Math.round((newCount / total) * 100),
      returningPercent: Math.round((returningCount / total) * 100),
    };

    // Weekly trend (group by date)
    const dailyMap: Record<string, { bookings: number; revenue: number }> = {};
    appointments.forEach((a) => {
      if (!dailyMap[a.date]) dailyMap[a.date] = { bookings: 0, revenue: 0 };
      dailyMap[a.date].bookings += 1;
      if (a.status === "completed" || a.status === "confirmed") {
        dailyMap[a.date].revenue += a.total_price;
      }
    });
    const weeklyTrend = Object.entries(dailyMap)
      .map(([date, vals]) => ({ date, ...vals }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const totalCustomers = await CustomerRepository.countBySalonId(salonId);

    return {
      totalBookings,
      revenue,
      avgBookingValue,
      noShowRate,
      topService,
      topStylist,
      newVsReturning,
      totalCustomers,
      completedBookings: completed.length,
      cancelledBookings: cancelled.length,
      weeklyTrend,
    };
  }
}
