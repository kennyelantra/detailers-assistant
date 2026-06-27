const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

app.get("/", (req, res) => {
  res.send("Detailer Assistant is running!");
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 200,
    system: "You are a booking assistant for Mike's Mobile Detailing. Help customers book appointments. You need their name, address, vehicle type, service, and preferred time. Services: Basic Wash $80, Full Detail $150, Ceramic Coating $400. Available Monday to Saturday 8am to 5pm. Keep replies short and friendly.",
    messages: [{ role: "user", content: userMessage }]
  });

  res.json({ reply: response.content[0].text });
});

app.listen(3000, () => {
  console.log("Server running!");
});
