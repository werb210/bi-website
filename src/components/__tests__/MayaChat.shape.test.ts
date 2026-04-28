// BI_MAYA_CHAT_PATH_v53 — guard against regressing back to the wrong path.
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const SRC = readFileSync(resolve(__dirname, "..", "MayaChat.tsx"), "utf8");

describe("BI_MAYA_CHAT_PATH_v53", () => {
  it("posts to /api/v1/maya-chat (NOT /api/v1/maya/message)", () => {
    expect(SRC).toContain('"/api/v1/maya-chat"');
    expect(SRC).not.toContain('"/api/v1/maya/message"');
  });
});
