// Route to retrieve responses from Groq AI using llama model
// Purpose is to provide additional context to user by answering two relevant questions
require("dotenv").config();
const express = require("express");
const router = require("express").Router();
const axios = require("axios");
const GROQ_API_KEY = process.env.GROQ_API_KEY;


const axiosConfig = {
  headers: {
  Authorization: `Bearer ${GROQ_API_KEY}`,
  "Content-Type": "application/json",
  },
  timeout: 12000,
  
};

const model = "meta-llama/llama-4-scout-17b-16e-instruct";

// Helper function to call Groq API
const fetchGroqAnswer = async (prompt) => {
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 1,
      max_tokens: 500,
      top_p: 1,
      stream: false,
    },
     axiosConfig 
   
  );

  return response.data.choices?.[0]?.message?.content || "No reply";
};

router.get("/ai_info", async (req, res) => {
  try {
    const prompt1 =
      "In a few sentences, explain what a potentially hazardous asteroid is as defined by NASA, in simple terms.";
    const prompt2 =
      "In one or two sentences, explain why are some asteroids classed as hazardous even if their miss distance is very far?,in simple terms";

    const [answer1, answer2] = await Promise.all([
      fetchGroqAnswer(prompt1),
      fetchGroqAnswer(prompt2),
    ]);

    res.json({ answer1, answer2 });
  } catch (error) {
    console.error(error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch AI responses." });
  }
});

module.exports = router;
