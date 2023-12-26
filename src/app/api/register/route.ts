import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";

import { isValidTwitterUsername } from "../../utils";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch (err) {
    console.error("invalid payload", err);
    return NextResponse.json(
      {
        ok: false,
        err: "invalid payload",
      },
      {
        status: 400,
      }
    );
  }

  const username = (payload as { username?: string }).username;
  if (!username || !isValidTwitterUsername(username)) {
    return NextResponse.json(
      {
        ok: false,
        err: "invalid username",
      },
      {
        status: 400,
      }
    );
  }

  const redis = Redis.fromEnv();
  await redis.sadd("users", username);

  return NextResponse.json(
    {
      ok: true,
    },
    {
      status: 200,
    }
  );
}
