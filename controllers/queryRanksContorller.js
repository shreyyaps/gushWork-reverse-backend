const { GoogleGenAI } = require("@google/genai");


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const queryRank = async (req, res,next) => {

    const { companyName, url, searchQueries } = req.body;
    try {

        const prompt = `
        You are a web ranking analyzer.
        Brand: ${companyName}
        URL: ${url}
        Queries:
        ${searchQueries.map(q => `- ${q}`).join('\n')}
        Instructions:
        1. For each query, search the web and find the ranking position of the brand.
        2. Return a JSON array with:
        { query: string, rank: number, top10: boolean }
        3. If brand is not found, set rank: null and top10: false.
        Only output JSON, no text.
                                    `;

      const geminiResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [
                   prompt,
                ],
                config: {
                     tools: [{ googleSearch: {},}],
                },
            });


            const geminiTextResponse = geminiResponse.text;
            console.log(geminiTextResponse);


            const jsonMatch = geminiTextResponse.match(/```json\s*([\s\S]*?)\s*```/);

            if (!jsonMatch || !jsonMatch[1]) {
                return res.status(500).json({
                    error: "Could not extract JSON from Gemini response.",
                    rawGeminiResponse: geminiTextResponse,
                });
            }



            let parsed;
            try {
                parsed = JSON.parse(jsonMatch[1]);
            } catch (err) {
                return res.status(500).json({
                    error: "Failed to parse JSON from Gemini response.",
                    rawJson: jsonMatch[1],
                });
            }



           req.body = {
            ...req.body,
            list: parsed, 
           }
           next();
          

    } catch (error) {
        console.error('Error processing request:', error.message);

        res.status(500).json({ error: 'Server could not complete the request. Please try again later.' });
    }
};
module.exports =  queryRank ;