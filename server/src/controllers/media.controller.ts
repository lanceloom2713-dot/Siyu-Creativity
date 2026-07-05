import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Request } from "express";
import multer from "multer";
import { cloudinary } from "../config/cloudinary.js";
import { Media } from "../models/Media.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const mediaUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm"];
    callback(null, allowed.includes(file.mimetype));
  }
});

const hasCloudinaryConfig = () =>
  Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

const uploadToCloudinary = (file: Express.Multer.File) =>
  new Promise<{ secure_url: string; resource_type: "image" | "video" }>((resolve, reject) => {
    const resourceType = file.mimetype.startsWith("video/") ? "video" : "image";
    const stream = cloudinary.uploader.upload_stream(
      { folder: "siyu-creativity", resource_type: resourceType },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve({ secure_url: result.secure_url, resource_type: resourceType });
      }
    );

    stream.end(file.buffer);
  });

const saveLocalUpload = async (req: Request, file: Express.Multer.File) => {
  const ext = path.extname(file.originalname) || (file.mimetype.startsWith("video/") ? ".mp4" : ".jpg");
  const filename = `${randomUUID()}${ext}`;
  const uploadDir = path.join(process.cwd(), "src", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), file.buffer);
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
};

export const uploadMedia = asyncHandler(async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ message: "Media file is required" });

  const title = String(req.body.title ?? file.originalname);
  const alt = String(req.body.alt ?? title);
  const type = file.mimetype.startsWith("video/") ? "video" : "image";
  const uploaded = hasCloudinaryConfig() ? await uploadToCloudinary(file) : null;
  const url = uploaded?.secure_url ?? (await saveLocalUpload(req, file));

  const item = await Media.create({ title, alt, type, url, active: true });
  return res.status(201).json({ item });
});
