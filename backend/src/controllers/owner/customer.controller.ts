import { Request, Response } from "express";
import { CustomerService } from "@services/customer.service";
import { sendSuccess } from "@utils/response";
import { asyncHandler } from "@utils/asyncHandler";
import { CustomerTag } from "@repositories/customer.repository";

export class OwnerCustomerController {
  /** GET /owner/:salonId/customers?search=&tag=&limit=&offset= */
  static list = asyncHandler(async (req: Request, res: Response) => {
    const { salonId } = req.params;
    const limit = Number(req.query.limit) || 50;
    const offset = Number(req.query.offset) || 0;
    const search = req.query.search as string | undefined;
    const tag = req.query.tag as CustomerTag | undefined;
    const customers = await CustomerService.list(salonId, limit, offset, search, tag);
    return sendSuccess(res, customers, "Customers fetched successfully.");
  });

  /** GET /owner/:salonId/customers/:customerId */
  static getById = asyncHandler(async (req: Request, res: Response) => {
    const { customerId } = req.params;
    const customer = await CustomerService.getById(customerId);
    return sendSuccess(res, customer, "Customer fetched successfully.");
  });

  /** PATCH /owner/:salonId/customers/:customerId */
  static update = asyncHandler(async (req: Request, res: Response) => {
    const { customerId } = req.params;
    const customer = await CustomerService.update(customerId, req.body);
    return sendSuccess(res, customer, "Customer updated successfully.");
  });
}
