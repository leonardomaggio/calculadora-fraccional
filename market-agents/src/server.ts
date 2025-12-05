import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getAllMarkets, getMarketById } from "./agents/marketHarvester";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/markets", async (_req: Request, res: Response) => {
  try {
    const markets = await getAllMarkets();
    res.json(markets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load markets" });
  }
});

app.get("/markets/:id", async (req: Request, res: Response) => {
  try {
    const market = await getMarketById(req.params.id);
    if (!market) {
      return res.status(404).json({ error: "Market not found" });
    }
    res.json(market);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load market" });
  }
});

app.listen(port, () => {
  console.log(`Market API listening at http://localhost:${port}`);
});
