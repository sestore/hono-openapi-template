import { tryCatch, type Result } from "catch-wrap";
import { sign, verify } from "hono/jwt";

import type { DrizzleZod_Users_Select } from "@/db/schema.types";
import type {
  DrizzleD1WithSchema,
  JWTPayload,
  RefreshTokenPayload,
  UserLogin,
} from "@/types";

import { verifyPassword } from "@/utils/password.utils";

export async function authenticateUser(
  db: DrizzleD1WithSchema,
  credentials: UserLogin,
): Promise<Result<DrizzleZod_Users_Select | null>> {
  return await tryCatch(async () => {
    const user = await db.query.users.findFirst({
      where: (fields, operators) =>
        operators.eq(fields.phoneNumber, credentials.phoneNumber),
    });

    if (!user) {
      return null;
    }

    const isValidPassword = await verifyPassword(
      credentials.password,
      user.passwordHash,
    );

    return isValidPassword ? user : null;
  });
}

export async function getUserById(
  db: DrizzleD1WithSchema,
  id: number,
): Promise<Result<DrizzleZod_Users_Select | undefined>> {
  return await tryCatch(
    db.query.users.findFirst({
      where: (fields, operators) => operators.and(operators.eq(fields.id, id)),
    }),
  );
}

export async function generateAccessToken({
  user,
  secret,
  expiresInMinutes = 15, // Short-lived
}: {
  user: DrizzleZod_Users_Select;
  secret: string;
  expiresInMinutes?: number;
}): Promise<Result<string>> {
  return await tryCatch(async () => {
    const now = Math.floor(Date.now() / 1000);
    const payload: JWTPayload = {
      sub: user.id.toString(),
      phoneNumber: user.phoneNumber,
      name: user.name,
      iat: now,
      exp: now + expiresInMinutes * 60,
    };

    return await sign(payload, secret);
  });
}

export async function generateRefreshToken({
  user,
  secret,
  expiresInDays = 30, // Long-lived
}: {
  user: DrizzleZod_Users_Select;
  secret: string;
  expiresInDays?: number;
}): Promise<Result<string>> {
  return await tryCatch(async () => {
    const now = Math.floor(Date.now() / 1000);
    const payload: RefreshTokenPayload = {
      sub: user.id.toString(),
      type: "refresh",
      iat: now,
      exp: now + expiresInDays * 24 * 60 * 60,
    };

    return await sign(payload, secret);
  });
}

export async function verifyRefreshToken(
  token: string,
  secret: string,
): Promise<Result<RefreshTokenPayload>> {
  return await tryCatch(async () => {
    const payload = (await verify(token, secret)) as RefreshTokenPayload;

    // Verify it's actually a refresh token
    if (payload.type !== "refresh") {
      throw new Error("Invalid token type");
    }

    return payload;
  });
}
