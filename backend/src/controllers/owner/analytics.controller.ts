import { Request, Response } from "express";
import { AnalyticsService } from "@services/analytics.service";
import { sendSuccess } from "@utils/response";
import { asyncHandler } from "@utils/asyncHandler";

export class OwnerAnalyticsController {
  /** GET /owner/:salonId/analytics?startDate=...&endDate=... */
  static getDashboard = asyncHandler(async (req: Request, res: Response) => {
    const salonId = req.params.salonId as string;

    // Default to current month if no dates provided
    const now = new Date();
    const startDate = (req.query.startDate as string) ||
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    const endDate = (req.query.endDate as string) ||
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()).padStart(2, "0")}`;

    const analytics = await AnalyticsService.getDashboard(salonId, startDate, endDate);
    return sendSuccess(res, analytics, "Analytics fetched successfully.");
  });
}
