import { z } from "zod";
import { promises as fs } from "fs";
import path from "path";

export const MarketRecordSchema = z.object({
  id: z.string(),
  name: z.string(),
  country: z.string(),
  region: z.string(),
  avgAnnual5y: z.number(),
  avgAnnual10y: z.number().optional(),
  minAnnual: z.number(),
  maxAnnual: z.number(),
  refPropertyLabel: z.string(),
  refPropertyPrice: z.number(),
  currency: z.string(),
  lastUpdated: z.string(), // ISO date (YYYY-MM-DD)
  sources: z.array(z.string())
});

export type MarketRecord = z.infer<typeof MarketRecordSchema>;

const dataFile = path.join(__dirname, "..", "..", "data", "markets.json");

async function readAllMarkets(): Promise<MarketRecord[]> {
  try {
    const raw = await fs.readFile(dataFile, "utf-8");
    if (!raw.trim()) return [];
    const parsed = JSON.parse(raw);
    return z.array(MarketRecordSchema).parse(parsed);
  } catch (err: any) {
    if (err.code === "ENOENT") {
      // Si no existe el archivo todavía, regresamos lista vacía
      return [];
    }
    throw err;
  }
}

export async function saveMarketRecord(record: MarketRecord): Promise<MarketRecord[]> {
  const validated = MarketRecordSchema.parse(record);
  const all = await readAllMarkets();

  const index = all.findIndex((m) => m.id === validated.id);
  if (index >= 0) {
    all[index] = validated; // actualiza si ya existe
  } else {
    all.push(validated); // agrega nuevo
  }

  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(all, null, 2), "utf-8");

  return all;
}

export async function getAllMarkets(): Promise<MarketRecord[]> {
  return readAllMarkets();
}

export async function getMarketById(id: string): Promise<MarketRecord | undefined> {
  const all = await readAllMarkets();
  return all.find((m) => m.id === id);
}
