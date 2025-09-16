const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const checkIndustry = async (req, res, next) => {
    try {

        const { url } = req.body;
       
    
            const geminiResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [
                    ` go to this URL: ${url}. and give me the companyname/organization/e.t.c this url is for also 
                give me the industry this url belongs to(2 to 5 words long)
                return a json with these two fields --->{companyName, industry}<-----
                `,
                ],
                config: {
                    tools: [{ urlContext: {} }],
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
                companyName: parsed.companyName,
                industry: parsed.industry,
            };

            next();
        

    } catch (error) {
        console.error("Middleware error:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = checkIndustry;
