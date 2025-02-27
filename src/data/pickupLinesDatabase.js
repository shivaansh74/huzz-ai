/**
 * Database of pickup lines organized by tone level and context
 * Tone levels:
 * 0 - Subtle: Ultra casual, respectful, with just a hint of interest
 * 1 - Casual: Playful with light flirtation
 * 2 - Flirty: Moderately flirty, teasing, and confident
 * 3 - Bold: Very flirtatious and suggestive
 * 4 - Spicy: Extremely bold and confident
 */

// General pickup lines that work in many contexts
export const generalPickupLines = [
  { text: "I was feeling a bit off today, but seeing you turned my day right-side up.", tone: 1 },
  { text: "I must be a snowflake, because I've fallen for you.", tone: 0 },
  { text: "Do you have a map? Because I keep getting lost in your eyes.", tone: 2 },
  { text: "Are you made of copper and tellurium? Because you're Cu-Te.", tone: 1 },
  { text: "If you were a vegetable, you'd be a cute-cumber.", tone: 1 },
  { text: "Is your name Google? Because you have everything I've been searching for.", tone: 2 },
  { text: "Are you a Wi-Fi signal? Because I'm feeling a strong connection and want to see if we can Netflix and chill... responsibly. 😉", tone: 3 },
  { text: "Is it hot in here or is it just you?", tone: 3 },
  { text: "Your lips look lonely... would they like to meet mine?", tone: 4 },
  { text: "Are you a parking ticket? Because you've got FINE written all over you.", tone: 3 },
  { text: "I'm not a photographer, but I can picture us together.", tone: 2 },
  { text: "Do you believe in love at first sight, or should I walk by again?", tone: 2 },
  { text: "I must be in a museum, because you're a work of art.", tone: 2 },
  // ...add 50+ more general pickup lines
];

// Coffee shop pickup lines
export const coffeeShopPickupLines = [
  { text: "Is your name Mocha? Because you're giving me a real pick-me-up.", tone: 1 },
  { text: "I'd like to buy you a coffee, but it seems you're already the hottest thing here.", tone: 3 },
  { text: "Do you mind if I sit here? My coffee tastes better with good company.", tone: 0 },
  { text: "I think there's something wrong with my coffee, it's not as sweet as your smile.", tone: 2 },
  { text: "Is your name Espresso? Because you've shot straight to my heart.", tone: 2 },
  { text: "I like my coffee how I like my potential dates - sweet, hot, and able to keep me up all night.", tone: 4 },
  { text: "I was going to order a coffee, but watching you has already given me enough energy for the day.", tone: 2 },
  // ...add 15+ more coffee shop pickup lines
];

// Gym pickup lines
export const gymPickupLines = [
  { text: "I don't know if that's your workout routine or your personality, but I'm impressed either way.", tone: 1 },
  { text: "Are you a personal trainer? Because you're working my heart rate up just by standing there.", tone: 3 },
  { text: "I'd spot you any day, if you'd spot me sometime over dinner?", tone: 2 },
  { text: "You must be doing cardio because you're making my heart race from across the room.", tone: 3 },
  { text: "Is your name Fitness? Because you're fit-ness perfectly into my life.", tone: 2 },
  { text: "Excuse me, I think you dropped something: my jaw.", tone: 3 },
  { text: "I'm not staring, I'm just admiring your form... both your exercise form and, well, your form.", tone: 4 },
  // ...add 15+ more gym pickup lines
];

// Bookstore pickup lines
export const bookstorePickupLines = [
  { text: "I can't decide what's more captivating - this book or your presence.", tone: 1 },
  { text: "If I were a bookstore, I'd put you in the 'Recommended' section.", tone: 2 },
  { text: "Excuse me, do you know where I can find books on perfect chemistry? Oh wait, never mind, I just found it standing right here.", tone: 3 },
  { text: "Is your favorite genre romance? Because I think we could write our own love story.", tone: 2 },
  { text: "I couldn't help but notice you're in the [section] aisle - that's one of my favorites too. What are you reading?", tone: 0 },
  { text: "Are you a rare book? Because I'd love to check you out.", tone: 3 },
  // ...add 15+ more bookstore pickup lines
];

// Add more context-specific collections:
// - Dating app openers
// - Concert/music event lines
// - Study buddy lines
// - Bar/club lines
// - Beach lines
// - Hiking/outdoors lines
// - Office/workplace (careful, professional) lines
// etc.

// Function to get pickup lines by context and tone
export function getPickupLinesByContext(context, tone) {
  let contextLines = [];
  
  // Try to match context to specific collection
  if (context.toLowerCase().includes('coffee') || context.toLowerCase().includes('cafe')) {
    contextLines = coffeeShopPickupLines;
  } else if (context.toLowerCase().includes('gym') || context.toLowerCase().includes('workout')) {
    contextLines = gymPickupLines;
  } else if (context.toLowerCase().includes('book') || context.toLowerCase().includes('library')) {
    contextLines = bookstorePickupLines;
  }
  // Add more context matching conditions
  
  // Filter by tone if specified, otherwise get general pickup lines
  const filteredLines = contextLines.length > 0 
    ? contextLines.filter(line => line.tone === tone)
    : generalPickupLines.filter(line => line.tone === tone);
  
  // If no matches, fall back to general pickup lines
  return filteredLines.length > 0 ? filteredLines : generalPickupLines.filter(line => line.tone === tone);
}

export default {
  generalPickupLines,
  coffeeShopPickupLines,
  gymPickupLines,
  bookstorePickupLines,
  getPickupLinesByContext
};
