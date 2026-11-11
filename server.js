
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend funcionando!");
});

app.post("/api/mensagem", async (req, res) => {
  const webhook = process.env.DISCORD_WEBHOOK;

  if (!webhook) {
    return res.status(500).json({
      success: false,
      message: "Webhook não configurado."
    });
  }

  const message = req.body.message;

  if (typeof message !== "string" || message.length > 1000) {
    return res.status(400).json({
      success: false,
      message: "Mensagem inválida."
    });
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message })
    });

    if (!response.ok) {
      throw new Error("Falha no Discord");
    }

    res.json({ success: true });
  } catch {
    res.status(502).json({
      success: false,
      message: "Não foi possível enviar."
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor iniciado!"));
                      
