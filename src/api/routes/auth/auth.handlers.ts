import {
  INTERNAL_SERVER_ERROR_CODE,
  OK_CODE,
  UNAUTHORIZED_CODE,
} from "http-stash";

import type { AppRouteHandler } from "@/types";

import { env } from "@/config/env";

import type {
  CurrentUserRoute,
  LoginRoute,
  RefreshTokenRoute,
} from "./auth.routes";

import {
  authenticateUser,
  generateAccessToken,
  generateRefreshToken,
  getUserById,
  verifyRefreshToken,
} from "./auth.services";

export const loginHandler: AppRouteHandler<LoginRoute> = async (c) => {
  const credentials = c.req.valid("json");
  const db = c.get("drizzle");

  const { data: user, error: authError } = await authenticateUser(
    db,
    credentials,
  );

  if (authError) {
    return c.json(
      {
        success: false,
        message: "Authentication service unavailable",
      },
      INTERNAL_SERVER_ERROR_CODE,
    );
  }

  if (!user) {
    return c.json(
      {
        success: false,
        message: "Invalid credentials",
      },
      UNAUTHORIZED_CODE,
    );
  }

  const { data: accessToken, error: accessTokenError } =
    await generateAccessToken({
      user,
      secret: env.JWT_SECRET,
      expiresInMinutes: 15,
    });

  if (accessTokenError) {
    return c.json(
      {
        success: false,
        message: "Could not generate access token",
      },
      INTERNAL_SERVER_ERROR_CODE,
    );
  }

  const { data: refreshToken, error: refreshTokenError } =
    await generateRefreshToken({
      user,
      secret: env.JWT_SECRET,
      expiresInDays: 30,
    });

  if (refreshTokenError) {
    return c.json(
      {
        success: false,
        message: "Could not generate refresh token",
      },
      INTERNAL_SERVER_ERROR_CODE,
    );
  }

  return c.json(
    {
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        name: user.name,
      },
    },
    OK_CODE,
  );
};

export const refreshTokenHandler: AppRouteHandler<RefreshTokenRoute> = async (
  c,
) => {
  const { refreshToken } = c.req.valid("json");
  const db = c.get("drizzle");

  const { data: payload, error: verifyError } = await verifyRefreshToken(
    refreshToken,
    env.JWT_SECRET,
  );

  if (verifyError) {
    return c.json(
      {
        success: false,
        message: "Invalid or expired refresh token",
      },
      UNAUTHORIZED_CODE,
    );
  }

  const userId = parseInt(payload.sub);
  if (isNaN(userId)) {
    return c.json(
      {
        success: false,
        message: "Invalid refresh token",
      },
      UNAUTHORIZED_CODE,
    );
  }

  const { data: user, error: userError } = await getUserById(db, userId);

  if (userError || !user) {
    return c.json(
      {
        success: false,
        message: "User not found",
      },
      UNAUTHORIZED_CODE,
    );
  }

  const { data: newAccessToken, error: accessTokenError } =
    await generateAccessToken({
      user,
      secret: env.JWT_SECRET,
      expiresInMinutes: 15,
    });

  if (accessTokenError) {
    return c.json(
      {
        success: false,
        message: "Could not generate new access token",
      },
      INTERNAL_SERVER_ERROR_CODE,
    );
  }

  const { data: newRefreshToken, error: refreshTokenError } =
    await generateRefreshToken({
      user,
      secret: env.JWT_SECRET,
      expiresInDays: 30,
    });

  if (refreshTokenError) {
    return c.json(
      {
        success: false,
        message: "Could not generate new refresh token",
      },
      INTERNAL_SERVER_ERROR_CODE,
    );
  }

  return c.json(
    {
      success: true,
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    },
    OK_CODE,
  );
};

export const currentUserHandler: AppRouteHandler<CurrentUserRoute> = async (
  c,
) => {
  const user = c.get("currentUser");

  if (!user) {
    return c.json(
      {
        success: false,
        message: "Authentication token required",
      },
      UNAUTHORIZED_CODE,
    );
  }

  return c.json(
    {
      success: true,
      message: "User information retrieved successfully",
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        name: user.name,
      },
    },
    OK_CODE,
  );
};
