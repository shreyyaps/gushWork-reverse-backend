const { GoogleGenAI } = require("@google/genai");


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const topTen = async (req, res,next) => {
    try {
        const { industry } = req.body;
       
      

        console.log(`who are the top ten relevent comapany in this industry ---> (${industry}) <---  if someone searches the internet today? return me the list on names nothing else as a Json`);

        const geminiResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                `who are the top ten relevent comapany in this industry ---> (${industry}) <---  if someone searches the internet today? return me the list of names nothing else as a Json`,
            ],
            config: {
                tools: [{ googleSearch: {},}],
            },
        });

        console.log(JSON.stringify(geminiResponse,null,2));
        const geminiTextResponse = geminiResponse.text;
        console.log(geminiTextResponse)


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

       
        req.body ={
            ...req.body,
            topTenRank: parsed, 
        }
       next()

    } catch (error) {
        console.error('Error processing request:', error.message);
        
        res.status(500).json({ error: 'Server could not complete the request. Please try again later.' });
    }
};
 module.exports = { topTen };