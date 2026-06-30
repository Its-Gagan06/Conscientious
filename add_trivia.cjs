const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

const triviaEndpoint = `  app.post("/api/trivia", async (req, res) => {
    try {
      const { difficulty = "general", count = 1 } = req.body;
      
      const promptStr = \\\`Generate a JSON array of \\\${count} trivia questions. Difficulty: \\\${difficulty}. 
Each object should have:
- question: string
- options: array of 4 strings (one must be the correct answer)
- answer: string (must exactly match one of the options)
- explanation: string (brief explanation of the answer)
Return ONLY valid JSON array.\\\`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptStr,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                answer: { type: Type.STRING },
                explanation: { type: Type.STRING }
              }
            }
          }
        }
      });
      
      const questions = JSON.parse(response.text.trim());
      res.json({ success: true, questions });
    } catch (error) {
      console.error("Error generating trivia:", error);
      res.status(500).json({ success: false, error: "Failed to generate trivia." });
    }
  });

`;

content = content.replace(
  'if (process.env.NODE_ENV !== "production") {',
  triviaEndpoint + 'if (process.env.NODE_ENV !== "production") {'
);

fs.writeFileSync('server.js', content);
