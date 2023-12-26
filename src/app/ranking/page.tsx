import Link from "next/link";
import { Redis } from "@upstash/redis";

export const runtime = "edge";

type UserRecord = {
  username: string;
  completed: boolean;
  timestamp: number;
};

function compileData(rawData: Record<string, unknown>): UserRecord[] {
  const userMap = new Map();
  for (const key in rawData) {
    const [username, challenge] = key.split(":");
    const timestamp = rawData[key] as number;
    const record: UserRecord = {
      username,
      completed: +challenge === 2,
      timestamp,
    };
    if (record.completed) {
      // Overwrite the record of the check-in challenge.
      userMap.set(username, record);
    }
    if (!userMap.has(username)) {
      userMap.set(username, record);
    }
  }

  const records: UserRecord[] = Array.from(userMap.values());
  records.sort((a, b) => {
    if (a.completed === b.completed) {
      return a.timestamp - b.timestamp;
    }
    return (a.completed ? 1 : 2) - (b.completed ? 1 : 2);
  });

  return records;
}

export default async function Ranking() {
  const redis = Redis.fromEnv();

  const rankingData = await redis.hgetall("ranking");
  const ranking = rankingData ? compileData(rankingData) : [];

  return (
    <>
      <div className="max-w-3xl w-full">
        <h2 className="text-2xl font-bold mb-2">Ranking</h2>
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr
              className="*:px-2 *:py-2 *:text-left *:font-normal *:bg-zinc-900 *:text-zinc-300"
              aria-roledescription="row"
            >
              <th className="border-t border-b border-l border-zinc-800 rounded-tl-md rounded-bl-md">
                Rank
              </th>
              <th className="border-t border-b border-r border-zinc-800 rounded-tr-md rounded-br-md">
                Twitter ID
              </th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((record, index) => (
              <tr
                className="*:px-2 *:py-2 *:text-zinc-400 *:border-b *:border-zinc-800 *:last:border-transparent"
                key={record.username}
              >
                <td>{`#${index + 1}`}</td>
                <td>
                  {record.username}
                  {record.completed ? " 🎉" : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
