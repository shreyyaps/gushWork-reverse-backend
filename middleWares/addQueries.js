const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const frequentQuery = async (req, res, next) => {
  try {
    
    const{companyName,industry,url} = req.body;
    console.log("ai call made");

    const geminiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        `Given the following information:

Company name: ${companyName}
Website: ${url}
Primary Industry: ${industry}


Generate 3 realistic and high-intent search queries that users might type into Google to discover products or services in this industry The queries should be in natural language and reflect what potential users are searching for. Focus on queries where this company could potentially rank or be mentioned, just like the example below.

Example for GitHub (Developer Tools):
- top developer platforms
- best coding collaboration tools
- popular open source projects
- leading software development platforms
- trending developer tools

Now generate similar search queries for the given company. Strictly return a json on list of queries `,
      ],
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

    const searchQueries = parsed;
    console.log(searchQueries);

        req.body = {
                ...req.body,
                   searchQueries: searchQueries,
            };

            next();
   
  } catch (error) {
    console.error("Error processing request:", error.message);
    res.status(500).json({
      error: "Server could not complete the request. Please try again later.",
    });
  }
};

module.exports =  frequentQuery ;
