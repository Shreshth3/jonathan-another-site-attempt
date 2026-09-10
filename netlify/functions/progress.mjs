import { getStore } from "@netlify/blobs";

const store = getStore("dfs-progress");
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_PROBLEMS = 100;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
  });
}

function validDeviceId(value) {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

function cleanProblemIds(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter(item => typeof item === "string" && /^[a-z0-9-]+$/.test(item)).slice(0, MAX_PROBLEMS))];
}

export default async request => {
  const url = new URL(request.url);
  const deviceId = url.searchParams.get("deviceId");
  if (!validDeviceId(deviceId)) return json({ error: "A valid device ID is required." }, 400);

  try {
    if (request.method === "GET") {
      const saved = await store.get(deviceId, { type: "json", consistency: "strong" });
      return json({ completedProblemIds: cleanProblemIds(saved?.completedProblemIds), found: saved !== null });
    }

    if (request.method === "PUT") {
      const body = await request.json();
      const completedProblemIds = cleanProblemIds(body?.completedProblemIds);
      await store.setJSON(deviceId, { completedProblemIds, updatedAt: new Date().toISOString() });
      return json({ completedProblemIds, saved: true });
    }

    return json({ error: "Method not allowed." }, 405);
  } catch (error) {
    console.error("Progress storage failed", error);
    return json({ error: "Progress storage is temporarily unavailable." }, 503);
  }
};

export const config = {
  path: "/api/progress",
  rateLimit: { windowLimit: 60, windowSize: 60, aggregateBy: ["ip", "domain"], action: "rate_limit" }
};
