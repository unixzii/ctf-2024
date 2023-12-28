import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";

import { isValidTwitterUsername } from "../../utils";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const challenge = +(searchParams.get("c") || "");
  const user = searchParams.get("u");

  if (challenge !== 1 && challenge !== 2) {
    return NextResponse.json(
      { ok: false, err: "invalid challenge" },
      { status: 400 }
    );
  }

  if (!user || !isValidTwitterUsername(user)) {
    return NextResponse.json(
      { ok: false, err: "invalid username" },
      { status: 400 }
    );
  }

  const flag = await request.text();

  console.log("user did submit: ", { challenge, user, flag });

  const realFlag = challenge === 1 ? "v85t7z!b" : "0zc1@jp4";
  if (realFlag !== flag) {
    return NextResponse.json(
      { ok: false, err: "flag is wrong" },
      { status: 400 }
    );
  }

  const redis = Redis.fromEnv();
  const script = redis.createScript(`
    if redis.call('SISMEMBER', KEYS[2], ARGV[1]) ~= 1 then
      return false
    end
    redis.call('HSETNX', KEYS[1], ARGV[1] .. ':' .. ARGV[2], ARGV[3])
    return true
  `);
  const result = (await script.eval(
    ["ranking", "users"],
    [user, `${challenge}`, `${Date.now()}`]
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
