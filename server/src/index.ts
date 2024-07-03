import app from "./app"; // Contiene el servidor de express
import { createServer } from "http";
import { Request, Response } from "express";

let sseClient: Response[] = [];

// Creamos el servidor a partir de Express
const server = createServer(app);

const PORT = 3000;

app.get("/message", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  sseClient.push(res);

  req.on("close", () => {
    sseClient = sseClient.filter((client) => client !== res);
  });
});

app.post("/message", (req: Request, res: Response) => {
  let { options, message } = req.body;

  console.log(req.body);

  sseClient.forEach((res) => {
    // res.write(`event: ${options}\n`);
      res.write(`data: ${options+':'+message}\n\n`);
  });
});

(async () => {
  try {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
