import { Router } from "express";
import healthRoutes from "./routes/health.routes";

const router = Router();

// Mount route groups
router.use("/", healthRoutes);

export default router;
