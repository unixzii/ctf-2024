import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  let payload;
  try {
    payload = (await request.json()) as { username?: string; item?: number };
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

  if (!payload.username || payload.item?.constructor !== Number) {
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

  const redis = Redis.fromEnv();
  const script = redis.createScript(`
    if redis.call('SISMEMBER', KEYS[2], ARGV[1]) ~= 1 then
      return false
    end
    redis.call('HSET', KEYS[1], ARGV[1], ARGV[2])
    return true
  `);
  const result = (await script.eval(
    ["feedbacks", "users"],
    [payload.username || "", `${payload.item}`]
  )) as boolean;
  if (!result) {
    return NextResponse.json(
      { ok: false, err: "request is unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      ok: true,
    },
    {
      status: 200,
    }
  );
}
