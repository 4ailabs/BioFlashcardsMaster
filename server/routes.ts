import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { handleAsistenteIA } from "./ai-assistant";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Endpoint para el Asistente de IA
  app.post("/api/asistente-ia", handleAsistenteIA);

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
