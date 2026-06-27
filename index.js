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
app.post("/voice", async (req, res) => {
  const callerSaid = req.body.SpeechResult || "";

  let replyText = "Hi, thanks for calling Mike's Mobile Detailing. How can I help you today?";

  if (callerSaid) {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 150,
      system: "You are a booking assistant for Mike's Mobile Detailing. Keep replies under 2 sentences. Collect name, address, vehicle type, service and time.",
      messages: [{ role: "user", content: callerSaid }]
    });
    replyText = response.content[0].text;
  }

  res.type("text/xml");
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Say voice="Polly.Joanna">${replyText}</Say>
      <Gather input="speech" action="/voice" method="POST" timeout="5" speechTimeout="auto"/>
    </Response>`);
});
app.listen(3000, () => {
  console.log("Server running!");
});
