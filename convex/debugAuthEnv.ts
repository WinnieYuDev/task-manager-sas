"use node";

import { action } from "./_generated/server";

/**
 * Debug action: returns whether Convex Auth env vars are set in this deployment.
 * Used to confirm JWT_PRIVATE_KEY / JWKS are missing when signIn fails.
 */
export const check = action({
  args: {},
  handler: async () => {
    const jwtPrivateKeySet = typeof process.env.JWT_PRIVATE_KEY === "string" && process.env.JWT_PRIVATE_KEY.length > 0;
    const jwksSet = typeof process.env.JWKS === "string" && process.env.JWKS.length > 0;
    return { jwtPrivateKeySet, jwksSet };
  },
});
