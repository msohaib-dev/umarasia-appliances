import crypto from "crypto";

type JwtPayload = {
  id: string;
  email: string;
  role: string;
  exp: number;
};

const base64UrlEncode = (value: string): string => Buffer.from(value).toString("base64url");

const base64UrlDecode = (value: string): string => Buffer.from(value, "base64url").toString("utf8");

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is required.");
  }
  return secret;
};

export const signAdminJwt = ({ id, email, role }: Omit<JwtPayload, "exp">): string => {
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
  const payload: JwtPayload = { id, email, role, exp };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const content = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto.createHmac("sha256", getJwtSecret()).update(content).digest("base64url");
  return `${content}.${signature}`;
};

export const verifyAdminJwt = (token: string): JwtPayload | null => {
  try {
    const [encodedHeader, encodedPayload, signature] = String(token || "").split(".");
    if (!encodedHeader || !encodedPayload || !signature) {
      return null;
    }

    const content = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = crypto.createHmac("sha256", getJwtSecret()).update(content).digest("base64url");

    if (expectedSignature.length !== signature.length) {
      return null;
    }

    const valid = crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));
    if (!valid) {
      return null;
    }

    const header = JSON.parse(base64UrlDecode(encodedHeader)) as { alg?: string; typ?: string };
    if (header.alg !== "HS256" || header.typ !== "JWT") {
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as JwtPayload;
    if (!payload?.id || !payload?.email || !payload?.role || !payload?.exp) {
      return null;
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
};

export type { JwtPayload };
