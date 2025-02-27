/**
 * Direct API calls to Gemini models
 * We're using direct fetch calls with explicit v1beta endpoint
 * since the Google Generative AI client library keeps defaulting to v1
 */

// Initialize the Gemini API with API key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Check if API key exists
if (!API_KEY) {
  console.error("Missing Gemini API key! Please add VITE_GEMINI_API_KEY to your .env file");
}

// IMPORTANT: Must use v1beta endpoint for experimental models
const API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta";
const MODEL_NAME = "gemini-2.0-flash-exp"; // <--- EXACTLY this

// Expanded tone definitions for responses (5 levels now)
const TONES = {
  0: "ultra casual, respectful, and subtle with a hint of interest",
  1: "casual and playful with light flirtation",
  2: "moderately flirty, teasing, and confident",
  3: "bold, suggestive, and very flirtatious",
  4: "extremely spicy, bold, and confident with straight W-rizz"
};

/**
 * Base function for making API calls with proper error handling
 */
async function callGeminiAPI(prompt, parts = []) {
  try {
    console.log(`Calling ${MODEL_NAME} via ${API_ENDPOINT}`);
    const url = `${API_ENDPOINT}/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
    
    const requestBody = {
      contents: [{
        parts: [
          { text: prompt },
          ...parts
        ]
      }]
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", response.status, response.statusText, errorData);
      throw new Error(`API error ${response.status}: ${errorData?.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No candidates returned from API");
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw error;
  }
}

/**
 * Simple test function to verify API connection
 */
export async function testApiConnection() {
  try {
    console.log(`Testing connection with model: ${MODEL_NAME} via ${API_ENDPOINT}`);
    const result = await callGeminiAPI("Hello, can you hear me?");
    return {
      success: true,
      response: result,
      model: MODEL_NAME,
      endpoint: "v1beta"
    };
  } catch (error) {
    console.error(`API connection test failed with model ${MODEL_NAME}:`, error);
    return {
      success: false,
      error: error.message,
      model: MODEL_NAME,
      endpoint: "v1beta"
    };
  }
}

/**
 * Generate a response to a conversation
 */
export async function generateTextResponse(conversationText, tone = 1) {
  try {
    const prompt = `As a texting coach, create a VERY SHORT response to this conversation: "${conversationText}"

The tone should be ${TONES[tone]}.

IMPORTANT: Read the conversation CAREFULLY and ensure the response is CONTEXTUALLY APPROPRIATE. 
If it's a criticism or negative message like "That's not very nice", respond appropriately with an apology or explanation.

The response must be SHORT - between 1-8 words only, or at most one short sentence.
NO explanations, NO options, NO "why this works" sections.
Give me ONLY the exact short text message to send, nothing else.

Examples of good contextual responses:
- For "Would you rather live somewhere hot or cold?": "Definitely somewhere cool! You?"
- For "I've been ghosted for 3 days": "Hey stranger! Miss our chats 😊"
- For "That's not very nice": "Sorry! Didn't mean it that way 😔"
- For "I'm busy this weekend": "No worries! Next week maybe?"
- For "What do you do for work?": "Tech wizard by day, chef by night 🧙‍♂️"

Keep it extremely brief, contextually appropriate, and casual like a real text message.`;
    
    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error(`Error generating text response with model ${MODEL_NAME}:`, error);
    return "Sorry, try again.";
  }
}

/**
 * Generate pickup lines based on a scenario
 */
export async function generatePickupLine(scenario, tone = 2) {
  try {
    // Enhanced prompt for more variety and creativity
    const prompt = `Generate a creative, unique pickup line for this scenario: "${scenario}"
    
    The tone should be ${TONES[tone]}.
    
    Make sure this is original and not a commonly overused pickup line. Be creative and specific to the scenario.
    Consider wordplay, puns, or references related to the specific context.
    
    Give me just the pickup line, nothing else.
    
    Examples of creative lines:
    - "Are you a Wi-Fi signal? Because I'm feeling a strong connection and want to see if we can Netflix and chill... responsibly."
    - "Is your name Google? Because you have everything I've been searching for."
    - "Do you have a map? Because I just got lost in your eyes and need to find my way back to reality."
    - "Are you made of copper and tellurium? Because you're Cu-Te."
    - "If you were a vegetable, you'd be a cute-cumber."
    
    Please make it original and different from these examples.`;
    
    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error(`Error generating pickup line with model ${MODEL_NAME}:`, error);
    return "Sorry, I couldn't generate a pickup line. Please check your API key or try again.";
  }
}

/**
 * Analyze an image and provide feedback
 */
export async function analyzeImage(imageData) {
  try {
    const promptText = "Act as a rizz coach analyzing this profile picture for a dating app. Provide feedback on the vibe (W/Mid/L), a score out of 10, general feedback, caption suggestions, and whether someone would swipe right.";
    
    // Create image part
    const parts = [
      { inline_data: { mime_type: "image/jpeg", data: imageData } }
    ];
    
    // Generate content with the image
    const responseText = await callGeminiAPI(promptText, parts);
    
    // Process the response into a structured format
    try {
      // Try parsing the response as JSON if it's already formatted that way
      return JSON.parse(responseText);
    } catch (e) {
      // Otherwise create a structured response manually
      return {
        vibe: responseText.includes("W") ? "W" : responseText.includes("L") ? "L" : "Mid",
        score: extractScore(responseText) || 7.0,
        feedback: responseText.slice(0, 150) + "...",
        caption_suggestions: extractCaptionSuggestions(responseText),
        would_swipe: responseText.toLowerCase().includes("swipe right") ? "Yes" : "Maybe",
        improvements: extractImprovements(responseText)
      };
    }
  } catch (error) {
    console.error(`Error analyzing image with model ${MODEL_NAME}:`, error);
    return {
      vibe: "Mid",
      score: 5.0,
      feedback: "Sorry, I couldn't analyze this image. Please check your API key or try again.",
      caption_suggestions: ["Check your API key", "Try again later", "Contact support"],
      would_swipe: "Maybe",
      improvements: ["Verify API permissions", "Try a different image"]
    };
  }
}

/**
 * Generate chat responses for AI conversation practice
 */
export async function generateChatResponse(messages, difficultyLevel = "medium") {
  try {
    // Create a formatted history of messages
    const formattedHistory = messages
      .map(msg => `${msg.sender === "user" ? "You" : "Match"}: ${msg.text}`)
      .join("\n");
    
    // Simple prompt for better reliability
    const prompt = `Act as a dating app match having a conversation with me. Difficulty: ${difficultyLevel}. Our conversation history:\n${formattedHistory}\n\nRespond as my match. Keep your response short and natural.`;
    
    console.log(`Generating chat response using model: ${MODEL_NAME}`);
    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error(`Error generating chat response with model ${MODEL_NAME}:`, error);
    return "Hey, sorry about that! I'm having some trouble responding right now. Maybe try again?";
  }
}

// Helper functions for image analysis
function extractScore(text) {
  const scoreMatch = text.match(/(\d+(\.\d+)?)\s*\/\s*10/);
  return scoreMatch ? parseFloat(scoreMatch[1]) : 7.0;
}

function extractCaptionSuggestions(text) {
  let captions = [];
  
  // Try to find caption suggestions
  const captionRegex = /caption[s]?:?\s*(.*)/i;
  const match = text.match(captionRegex);
  
  if (match && match[1]) {
    // Split by common delimiters
    captions = match[1]
      .split(/[\n\d+\.)"*-]/)
      .map(caption => caption.trim())
      .filter(caption => caption.length > 5 && caption.length < 100)
      .slice(0, 3);
  }
  
  // If we couldn't extract captions, generate some defaults
  if (captions.length === 0) {
    captions = [
      "Vibes don't lie",
      "Living my best life",
      "Too busy looking at the stars"
    ];
  }
  
  return captions;
}

function extractImprovements(text) {
  let improvements = [];
  
  // Look for improvements or suggestions
  const improvementRegex = /improvement[s]?:?\s*(.*)/i;
  const suggestionRegex = /suggestion[s]?:?\s*(.*)/i;
  
  const match = text.match(improvementRegex) || text.match(suggestionRegex);
  
  if (match && match[1]) {
    // Split by common delimiters
    improvements = match[1]
      .split(/[\n\d+\.)"*-]/)
      .map(item => item.trim())
      .filter(item => item.length > 5)
      .slice(0, 3);
  }
  
  // If we couldn't extract improvements, provide some defaults
  if (improvements.length === 0) {
    improvements = [
      "Try a different angle",
      "Adjust lighting for better visibility",
      "Consider a more engaging pose"
    ];
  }
  
  return improvements;
}

export default {
  testApiConnection,
  generateTextResponse,
  generatePickupLine,
  analyzeImage,
  generateChatResponse
};
