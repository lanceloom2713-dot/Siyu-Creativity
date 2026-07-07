import cors from "cors";
import express from "express";
import helmet from "helmet";
import path from "node:path";
import { errorHandler } from "./middleware/errorHandler.js";
import { adminRoutes } from "./routes/admin.routes.js";
import { publicRoutes } from "./routes/public.routes.js";

export function createApp() {
  const app = express();
  const origins = [process.env.CLIENT_ORIGIN, process.env.ADMIN_ORIGIN].filter(Boolean) as string[];

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }
    })
  );
  app.use(cors({ origin: origins.length ? origins : true, credentials: true }));
  app.use(express.json({ limit: "2mb" }));
  app.use(
    "/uploads",
    express.static(path.join(process.cwd(), "src", "uploads"), {
      setHeaders: (res) => {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        res.setHeader("Access-Control-Allow-Origin", "*");
      }
    })
  );

  app.get("/", (_req, res) => {
    res.json({
      service: "siyu-creativity-api",
      status: "ok",
      message: "Backend API is running. Open the customer website or admin panel in their Vite dev server URLs.",
      urls: {
        health: "/health",
        publicApi: "/api/public",
        adminApi: "/api/admin",
        customerWebsite: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
        adminPanel: process.env.ADMIN_ORIGIN ?? "http://localhost:5175"
      }
    });
  });

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "siyu-creativity-api" });
  });

  app.use("/api/public", (req, res, next) => {
    if (req.method === "GET") {
      res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
    }
    next();
  });
  app.use("/api/public", publicRoutes);
  app.use("/api/admin", adminRoutes);
  app.use(errorHandler);

  return app;
}
