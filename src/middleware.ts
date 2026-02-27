import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD ?? "jarvis2026").trim();
const COOKIE_NAME = "admin_session";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/admin-login(.*)",
  "/api/admin/(.*)",
  "/api/webhooks(.*)",
]);

const deriveToken = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(password);
  const msgData = encoder.encode(password + ":autocontent-admin");
  const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, msgData);
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
};

const isValidAdminSession = async (req: NextRequest): Promise<boolean> => {
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  if (!cookie) return false;
  try {
    const expected = await deriveToken(ADMIN_PASSWORD);
    return cookie === expected;
  } catch {
    return false;
  }
};

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;
  if (await isValidAdminSession(req)) return;
  await auth.protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
