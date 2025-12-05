import { saveMarketRecord } from "../agents/marketHarvester";

async function main() {
  await saveMarketRecord({
    id: "cabo_punta_ballena",
    name: "Cabo San Lucas – Punta Ballena",
    country: "Mexico",
    region: "Baja California Sur",
    avgAnnual5y: 0.24,      // 24 % promedio últimos 5 años
    avgAnnual10y: 0.22,     // 22 % promedio últimos 10 años (ejemplo)
    minAnnual: 0.12,        // 12 % año más bajo (ejemplo)
    maxAnnual: 0.30,        // 30 % año más alto (ejemplo)
    refPropertyLabel: "Villa fraccional 3BR con vista al mar",
    refPropertyPrice: 2200000, // valor de referencia en USD (ejemplo)
    currency: "USD",
    lastUpdated: new Date().toISOString().slice(0, 10),
    sources: ["manual-initial-seed"]
  });

  console.log("Seeded market: cabo_punta_ballena");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
