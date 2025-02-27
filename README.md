# HuzzAI - The Ultimate AI-Powered Rizz Coach

![HuzzAI Banner](https://via.placeholder.com/1200x300/181818/E63946?text=HuzzAI+%7C+Ultimate+Rizz+Coach)

> No more dry texts. No more Ls. Just straight W-rizz.

HuzzAI is a Gen Z-focused AI wingman that helps users improve their texting game, get pickup line suggestions, and receive feedback on photos. The app leverages Google's Gemini AI to provide smooth responses, analyze images, and help users practice flirting.

## 🔥 Features

### 💬 AI-Generated Rizz Coach
- Upload conversation screenshots or paste text
- Get smooth, well-crafted responses
- Adjust tone from "Chill" to "Spicy"
- Recovery mode for when you get ghosted or fumble

### 📸 AI-Powered Image Rizz Analyzer
- Upload selfies, fit pics, or group photos
- Get a drip check, vibe rating, and caption suggestions
- "Would They Swipe?" prediction
- Personalized improvement suggestions

### 🌶 Pick-Up Line Generator
- Generate context-aware pickup lines
- Adjust tone to match your style
- Save your favorite lines
- Pre-made scenarios for quick inspiration

### 🧠 AI Chat Practice
- Practice your flirting skills with AI
- Adjustable difficulty levels
- Test different approaches safely
- Get real-time feedback

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- Google Gemini API key (Pro or Pro Vision)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/huzz-ai.git
   cd huzz-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment variables:
   ```bash
   cp .env.example .env
   ```

4. Add your Google Gemini API key to `.env`:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔑 Getting a Gemini API Key

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Navigate to the API section
4. Create a new API key
5. Copy the key and paste it in your `.env` file

## 💻 Tech Stack

- **Frontend:** React
- **Styling:** TailwindCSS
- **Animation:** Framer Motion
- **AI:** Google Gemini API (Pro & Pro Vision)
- **Text Recognition:** Tesseract.js
- **Build Tool:** Vite

## 🧑‍💻 Development

### Project Structure
```
/src
  /api          # API integration with Gemini
  /components   # Reusable UI components
  /pages        # Main application pages
  App.jsx       # Main application component
  main.jsx      # Entry point
```

### Git Setup

1. Initialize Git repository (if not already done):
   ```bash
   git init
   ```

2. Make sure your `.env` file is in `.gitignore`:
   ```bash
   echo ".env" >> .gitignore
   ```

3. Add all files and make initial commit:
   ```bash
   git add .
   git commit -m "Initial commit"
   ```

4. Add a remote repository (if you have one):
   ```bash
   git remote add origin https://github.com/yourusername/huzzai.git
   git branch -M main
   git push -u origin main
   ```

### Build for Production
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

HuzzAI is for entertainment purposes only. The advice and suggestions provided by the application should be used at your own discretion. Always be respectful and considerate in your communications.

---

Created with ❤️ and a sprinkle of AI magic.

*Remember, the best rizz is being yourself (with a little extra sauce)* 🌶️
