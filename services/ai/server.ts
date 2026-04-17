import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3003;

app.post('/api/ai/analyze', async (req, res) => {
  const { resumeText } = req.body;
  
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API key not configured' });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this resume and provide 3 improvement tips: \n\n${resumeText}`,
    });
    
    res.json({ advice: response.text });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'AI analysis failed' });
  }
});

app.listen(PORT, () => {
  console.log(`AI Service running on port ${PORT}`);
});
