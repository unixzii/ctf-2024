"use client";

import { useState } from "react";

import Input from "../input";
import { nextTick } from "../utils";
import { CommonAPIResponse } from "../backend-api";
import { checkFlag1 } from "../challenge-1";

async function doRedeem(flag: string): Promise<string> {
  const resp = await fetch("/api/redeem-code", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: JSON.stringify({ flag }),
  });
  const respBody = (await resp.json()) as CommonAPIResponse;
  if (!respBody.ok) {
    throw new Error("failed to submit the flag: " + respBody.err);
  }

  return (respBody as any).code;
}

export default function Redeem() {
  const [loading, setLoading] = useState(false);
  async function handleRedeem(value: string) {
    setLoading(true);
    nextTick(async () => {
      try {
        if (!(await checkFlag1(value))) {
          alert("The flag is wrong");
          return;
        }

        const code = await doRedeem(value);
        if (code) {
          alert(`Alipay red packet code is: ${code}`);
        } else {
          alert(`No red packet code available.`);
        }
      } catch (err) {
        console.error(err);
        alert(
          "Failed to redeem the code, please check console for more information."
        );
      } finally {
        setLoading(false);
      }
    });
  }

  return (
    <>
      <div className="max-w-3xl w-full">
        <h2 className="text-2xl font-bold mb-2">Redeem Code</h2>
        <p>
          Fill in the flag of the first challenge to redeem the red packet code.
        </p>
        <Input
          buttonLabel="Redeem"
          secret
          busy={loading}
          onSubmit={handleRedeem}
        />
      </div>
    </>
  );
}
