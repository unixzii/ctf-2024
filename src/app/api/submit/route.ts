import { runInContext, createContext } from "node:vm";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function evalCode(code: string): string {
  const ctx = createContext();
  runInContext('function checkFlag(flag) { return flag === "abc"; }', ctx);
  const result = runInContext(code, ctx);

  const resultConstructor = Object.getPrototypeOf(result).constructor;
  if (resultConstructor === String || resultConstructor === Boolean) {
    return `${result}`;
  }
  return "";
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  try {
    const result = evalCode(body);
    return new NextResponse(result, { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Invalid Request", { status: 400 });
  }
}
