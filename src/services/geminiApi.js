import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with API key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Missing API key! Please add VITE_GEMINI_API_KEY to your .env file");
}

// Create the API client with EXPLICIT v1beta endpoint
const genAI = new GoogleGenerativeAI(API_KEY);

// IMPORTANT: This must use the v1beta endpoint for experimental models
const V1BETA_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta";
const MODEL_NAME = "gemini-2.0-flash-exp";

// Function to generate text responses
export async function generateTextResponse(inputText, tone = 2) {
  try {
    console.log("Using v1beta endpoint for text generation");
    // Using direct fetch to ensure v1beta endpoint
    const url = `${V1BETA_ENDPOINT}/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
    
    let toneDescription;
    switch (tone) {
      case 1:
        toneDescription = "casual, respectful, and playful";
        break;
      case 2:
        toneDescription = "mildly suggestive, teasing, and flirty";
        break;
      case 3:
        toneDescription = "bold, confident, and spicy";
        break;
      default:
        toneDescription = "casual and friendly";
    }
    
    const prompt = `
      You are HuzzAI, a Gen Z dating and texting coach. 
      Based on this conversation or message: "${inputText}", 
      provide a smooth, well-crafted response in a ${toneDescription} tone.
      Keep it authentic, modern, and in Gen Z language. Make sure the response
      is engaging and likely to continue the conversation.
    `;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error generating text response:", error);
    throw error;
  }
}

// Function to analyze images - explicitly using v1beta endpoint
export async function analyzeImage(imageBase64) {
  try {
    console.log("Using v1beta endpoint for image analysis");
    const url = `${V1BETA_ENDPOINT}/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
    
    const prompt = `
      Act as a rizz coach analyzing this profile picture for dating apps. Provide:
      1. Drip check: Rate the outfit, pose, and overall aesthetic (1-10 scale)
      2. Caption suggestions: 3 options ranging from casual to flirty
      3. Vibe rating: Is this a "W" (winning pic) or needs work?
      4. Would They Swipe?: Predict if this pic would get a right swipe (percentage)
      5. Quick improvement suggestions
      
      Format as JSON with these keys: dripCheck, captions (array), vibeRating, swipeProbability, improvementTips
    `;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: "image/jpeg", data: imageBase64 } }
          ]
        }]
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
}

// Function to generate pickup lines - explicitly using v1beta endpoint
export async function generatePickupLine(scenario, tone = 2) {
  try {
    console.log("Using v1beta endpoint for pickup line generation");
    const url = `${V1BETA_ENDPOINT}/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
    
    let toneDescription;
    switch (tone) {
      case 1:
        toneDescription = "cute and playful";
        break;
      case 2:
        toneDescription = "clever and moderately flirty";
        break;
      case 3:
        toneDescription = "bold and smooth operator";
        break;
      default:
        toneDescription = "playful and friendly";
    }
    
    const prompt = `
      Generate a ${toneDescription} pickup line for the scenario: "${scenario}".
      Make it creative, memorable, and in Gen Z language.
      If the scenario involves a specific context (like gym, coffee shop, etc.), 
      make the pickup line relevant to that setting.
    `;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error generating pickup line:", error);
    throw error;
  }
}

// Function to generate chat responses - explicitly using v1beta endpoint
export async function generateChatResponse(messages, difficulty = "medium") {
  try {
    console.log("Using v1beta endpoint for chat response");
    const url = `${V1BETA_ENDPOINT}/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
    
    // Create a formatted history of messages
    const formattedHistory = messages
      .map(msg => `${msg.sender === "user" ? "You" : "Match"}: ${msg.text}`)
      .join("\n");
      
    const prompt = `
      Act as a dating app match having a conversation with me. 
      Difficulty: ${difficulty}.
      ${difficulty === "hard" ? "(Be somewhat challenging, take longer to warm up)" : ""}
      ${difficulty === "easy" ? "(Be receptive and interested from the start)" : ""}
      
      Our conversation history:
      ${formattedHistory}
      
      Respond as my match. Keep your response relatively short (1-3 sentences), natural, and authentic.
      Only respond with what the match would say, nothing else.
    `;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw error;
  }
}

// Helper function to convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let base64String = reader.result;
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      base64String = base64String.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });
}

export default {
  generateTextResponse,
  analyzeImage,
  generatePickupLine,
  generateChatResponse
};
