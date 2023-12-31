import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  let payload;
  try {
    payload = (await request.json()) as { flag?: string };
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

  console.log("user did submit: ", payload);

  if (payload.flag !== "v85t7z!b") {
    return NextResponse.json(
      { ok: false, err: "flag is wrong" },
      { status: 400 }
    );
  }

  const redis = Redis.fromEnv();
  const code: string = (await redis.get("red_packet_code")) || "";

  return NextResponse.json(
    {
      ok: true,
      code,
    },
    {
      status: 200,
    }
  );
}
