const { GoogleGenAI } = require("@google/genai");


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const summary = async (req, res,next) => {
    try {
        const { url, companyName, industry } = req.body;
       
        if (!url) {
            return res.status(400).json({ error: 'Please provide the url' });
        }

        console.log(`this is the company Name -${companyName}, and it belongs to this - ${industry}, this is the  url -URLs: ${url} go to the url and tell me `);

        

        const geminiResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                ` ${companyName} in the ${industry} sector. go to this URL: ${url}. go to the url and tell me a summary of this  `,
            ],
            config: {
                tools: [{ urlContext: {} }],
            },
        });


        const geminiTextResponse = geminiResponse.text;
       
        console.log("=====================================",geminiTextResponse)

          req.body = {
                ...req.body,
               summary:geminiTextResponse,
            };

            next();
     

    } catch (error) {
        console.error('Error processing request:', error.message);
        
        res.status(500).json({ error: 'Server could not generate summary' });
    }
};

module.exports = summary ;