import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../utils/jwt";

const prisma = new PrismaClient();

let io: SocketIOServer;

export function initSocketIO(httpServer: HttpServer, frontendUrl: string) {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: frontendUrl,
      credentials: true,
    },
  });

  // Authenticate on handshake
  io.use(async (socket, next) => {
    try {
      const rawCookie: string = socket.handshake.headers.cookie ?? "";
      const token = parseCookie(rawCookie, "auth_token");
      if (!token) {
        return next(new Error("Authentication error: no token"));
      }
      const payload = verifyToken(token);
      socket.data.userId = payload.userId;
      socket.data.email = payload.email;
      next();
    } catch {
      next(new Error("Authentication error: invalid token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId: string = socket.data.userId;
    const email: string = socket.data.email;

    // Join a private room for this user
    socket.join(`user:${userId}`);
    console.log(`🔌 Socket connected: ${email} (room: user:${userId})`);

    socket.on("disconnect", () => {
      console.log(`🔌 Socket disconnected: ${email}`);
    });
  });

  console.log("✅ Socket.IO initialized");
  return io;
}

/**
 * Broadcast a price update to all users subscribed to the given ticker.
 * Queries the DB for subscribers then emits only to their rooms.
 */
export async function broadcastPriceUpdate(ticker: string, price: number) {
  if (!io) return;

  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { ticker },
      select: { userId: true },
    });

    for (const { userId } of subscriptions) {
      io.to(`user:${userId}`).emit("priceUpdate", { ticker, price });
    }
  } catch (err) {
    console.error(`Failed to broadcast price update for ${ticker}:`, err);
  }
}

function parseCookie(cookieHeader: string, name: string): string | undefined {
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : undefined;
}
