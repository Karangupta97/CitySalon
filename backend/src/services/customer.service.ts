import { CustomerRepository, CustomerRow, CustomerTag } from "@repositories/customer.repository";
import { NotFoundError } from "@errors/HttpError";
import { logger } from "@utils/logger";

export class CustomerService {
  /**
   * List customers for a salon with optional search and tag filtering.
   */
  static async list(
    salonId: string,
    limit: number,
    offset: number,
    search?: string,
    tag?: CustomerTag,
  ): Promise<CustomerRow[]> {
    return CustomerRepository.findBySalonId(salonId, limit, offset, search, tag);
  }

  /**
   * Get a single customer.
   */
  static async getById(id: string): Promise<CustomerRow> {
    const customer = await CustomerRepository.findById(id);
    if (!customer) throw new NotFoundError("Customer not found.");
    return customer;
  }

  /**
   * Create or get existing customer by phone (per salon).
   */
  static async findOrCreate(salonId: string, data: { name: string; phone?: string; email?: string }): Promise<CustomerRow> {
    if (data.phone) {
      const existing = await CustomerRepository.findByPhone(salonId, data.phone);
      if (existing) return existing;
    }
    const customer = await CustomerRepository.create({
      salon_id: salonId,
      name: data.name,
      phone: data.phone,
      email: data.email,
    });
    logger.info("Customer created", { customerId: customer.id, salonId });
    return customer;
  }

  /**
   * Update customer info (notes, tag).
   */
  static async update(id: string, data: Partial<CustomerRow>): Promise<CustomerRow> {
    const customer = await CustomerRepository.findById(id);
    if (!customer) throw new NotFoundError("Customer not found.");
    const updated = await CustomerRepository.update(id, data);
    logger.info("Customer updated", { customerId: id });
    return updated;
  }
}
