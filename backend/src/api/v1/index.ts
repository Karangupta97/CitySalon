import { Router } from "express";
import healthRoutes from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";
import salonAuthRoutes from "./routes/salon-auth.routes";
import advisorRoutes from "./routes/advisor.routes";
import ownerRoutes from "./routes/owner.routes";
import publicRoutes from "./routes/public.routes";

const router = Router();

// Mount route groups
router.use("/", healthRoutes);
router.use("/auth", authRoutes);
router.use("/salon-auth", salonAuthRoutes);
router.use("/", advisorRoutes);
router.use("/owner", ownerRoutes);
router.use("/public", publicRoutes);

export default router;
