import { Router, Request, Response } from "express";
import { StorageService } from "@services/storage.service";
import { asyncHandler } from "@utils/asyncHandler";
import { NotFoundError } from "@errors/HttpError";

const router = Router();

/**
 * GET /public/images/:folder/:filename — Proxy S3 image files
 * Streams private S3 files back to client securely.
 */
router.get(
  "/images/:folder/:filename",
  asyncHandler(async (req: Request, res: Response) => {
    const { folder, filename } = req.params;
    const s3Key = `${folder}/${filename}`;

    try {
      const s3Response = await StorageService.getObjectStream(s3Key);
      if (!s3Response || !s3Response.Body) {
        throw new NotFoundError("Image not found.");
      }

      // Set headers
      if (s3Response.ContentType) {
        res.setHeader("Content-Type", s3Response.ContentType);
      }
      if (s3Response.ContentLength) {
        res.setHeader("Content-Length", s3Response.ContentLength);
      }
      res.setHeader("Cache-Control", "public, max-age=31536000");
      // Allow cross-origin access so the frontend can display these images
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Access-Control-Allow-Origin", "*");

      // Stream the response body
      const stream = s3Response.Body as any;
      stream.pipe(res);
    } catch (err: any) {
      if (err.name === "NoSuchKey") {
        throw new NotFoundError("Image not found.");
      }
      throw err;
    }
  })
);

export default router;
