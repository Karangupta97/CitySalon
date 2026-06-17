import { Router } from "express";
import healthRoutes from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";
import advisorRoutes from "./routes/advisor.routes";

const router = Router();

// Mount route groups
router.use("/", healthRoutes);
router.use("/auth", authRoutes);
router.use("/", advisorRoutes);

export default router;
