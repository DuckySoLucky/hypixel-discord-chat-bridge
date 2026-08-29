import GenericData from "../src/data/GenericData.js";
import GenericManager from "../src/data/GenericManager.js";
import assert from "node:assert/strict";
import test from "node:test";
import { join } from "node:path";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { z } from "zod";
import type DataManager from "../src/data/DataManager.js";

interface TestRecordJSON {
  readonly id: string;
  readonly value: string;
}

const testStoreSchema = z.array(z.object({ id: z.string(), value: z.string() }));

class TestRecord extends GenericData<TestRecordJSON, TestManager> {
  constructor(
    manager: TestManager,
    readonly id: string,
    readonly value: string
  ) {
    super(manager);
  }

  override toJSON(): TestRecordJSON {
    return { id: this.id, value: this.value };
  }
}

class TestManager extends GenericManager<TestRecordJSON, TestRecordJSON[], TestRecord> {
  constructor(filePath: string) {
    super(undefined as unknown as DataManager, filePath, "test", [], testStoreSchema);
  }

  override parseData(data: TestRecordJSON[]): TestRecord[] {
    return data.map((record) => new TestRecord(this, record.id, record.value));
  }

  override getId(data: TestRecord): string {
    return data.id;
  }

  add(record: TestRecordJSON): Promise<TestRecord[]> {
    return this.mutateData((records) => (records.some(({ id }) => id === record.id) ? records : [...records, record]));
  }
}

test("serializes concurrent persistence mutations and prevents duplicates", async () => {
  const directory = await mkdtemp(join(tmpdir(), "bridge-data-"));
  const filePath = join(directory, "records.json");
  const manager = new TestManager(filePath);

  try {
    await manager.start();
    await Promise.all([manager.add({ id: "one", value: "1" }), manager.add({ id: "two", value: "2" }), manager.add({ id: "one", value: "duplicate" })]);

    const stored = testStoreSchema.parse(JSON.parse(await readFile(filePath, "utf-8")));
    assert.deepEqual(stored, [
      { id: "one", value: "1" },
      { id: "two", value: "2" }
    ]);
  } finally {
    await manager.stop();
    await rm(directory, { recursive: true, force: true });
  }
});

test("rejects malformed persisted JSON", async () => {
  const directory = await mkdtemp(join(tmpdir(), "bridge-data-"));
  const filePath = join(directory, "records.json");
  const manager = new TestManager(filePath);

  try {
    await writeFile(filePath, JSON.stringify([{ id: 1 }]), "utf-8");
    await assert.rejects(manager.getFullData(), /malformed/u);
  } finally {
    await manager.stop();
    await rm(directory, { recursive: true, force: true });
  }
});
