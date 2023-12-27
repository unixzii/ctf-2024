import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";

export const runtime = "edge";

const validItems = new Set(["boring", "easy", "moderate", "hard", "wtf"]);

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

  const item = (payload as { item?: string }).item;
  if (!item || !validItems.has(item)) {
    return NextResponse.json(
      {
        ok: false,
        err: "invalid item",
      },
      {
        status: 400,
      }
    );
  }

  const redis = Redis.fromEnv();
  await redis.hincrby("feedbacks", item, 1);

  return NextResponse.json(
    {
      ok: true,
    },
    {
      status: 200,
    }
  );
}
