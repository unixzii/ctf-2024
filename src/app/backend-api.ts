export type CommonAPIResponse = {
  ok: boolean;
  err?: string;
};

export async function submitFlag(
  challenge: number,
  username: string,
  flag: string
): Promise<void> {
  const resp = await fetch(`/api/submit-flag?c=${challenge}&u=${username}`, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: flag,
  });
  const respBody = (await resp.json()) as CommonAPIResponse;
  if (!respBody.ok) {
    throw new Error("failed to submit the flag: " + respBody.err);
  }
}
