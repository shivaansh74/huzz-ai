/**
 * Direct API calls to Gemini bypassing the library
 * This is useful when the Google Generative AI library doesn't correctly handle beta endpoints
 */

// Get API key from env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Constants
const MODEL_NAME = "gemini-2.0-flash-exp";
const API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta";

/**
 * Make a direct API call to generate content
 */
export async function generateContent(promptText) {
  try {
    console.log("Generating content using direct API call");
    const url = `${API_ENDPOINT}/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
    
    // Log the request with API key redacted
    const redactedUrl = url.replace(API_KEY, "API_KEY_REDACTED");
    console.log(`Calling: ${redactedUrl}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: promptText }]
        }]
      })
    });
    
    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      const errorData = await response.json();
      console.error("Error details:", errorData);
      throw new Error(`API error ${response.status}: ${errorData?.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response candidates returned from API");
    }
    
    // Return the text content from the response
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Direct API call failed:", error);
    throw error;
  }
}

/**
 * Test connection to verify the API and model are working
 */
export async function testConnection() {
  try {
    console.log(`Testing direct connection to ${MODEL_NAME} via ${API_ENDPOINT}`);
    const result = await generateContent("Hello, testing direct API connection");
    return {
      success: true,
      response: result,
      model: MODEL_NAME,
      endpoint: API_ENDPOINT
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      model: MODEL_NAME,
      endpoint: API_ENDPOINT
    };
  }
}

export default {
  generateContent,
  testConnection
};
