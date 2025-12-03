import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a Reddit-style username from a user ID
 * Uses consistent word lists to create memorable usernames like "QuietRiver42"
 */
export function generateUsername(userId: string): string {
  const adjectives = [
    "Quiet", "Brave", "Gentle", "Wise", "Kind", "Bold", "Swift", "Calm",
    "Bright", "Silent", "Noble", "Free", "Wild", "Lost", "True", "Pure",
    "Dark", "Soft", "Warm", "Cool", "Deep", "High", "Strong", "Light",
    "Happy", "Serene", "Mystic", "Ancient", "Modern", "Cosmic", "Ocean",
    "Mountain", "Forest", "River", "Sky", "Storm", "Dawn", "Dusk"
  ];

  const nouns = [
    "River", "Mountain", "Ocean", "Forest", "Sky", "Storm", "Phoenix",
    "Dragon", "Wolf", "Eagle", "Bear", "Tiger", "Lion", "Falcon", "Hawk",
    "Raven", "Owl", "Fox", "Deer", "Whale", "Dolphin", "Turtle", "Panda",
    "Moon", "Star", "Sun", "Cloud", "Wind", "Fire", "Water", "Earth",
    "Stone", "Tree", "Flower", "Garden", "Path", "Bridge", "Harbor"
  ];

  // Use the user ID to consistently select the same words
  const hash = userId.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);

  const adjectiveIndex = hash % adjectives.length;
  const nounIndex = (hash * 7) % nouns.length;

  // Get last 2-3 digits from the user ID for the number suffix
  const numericPart = userId.slice(-4).replace(/\D/g, '');
  const suffix = numericPart.slice(-2) || '00';

  return `${adjectives[adjectiveIndex]}${nouns[nounIndex]}${suffix}`;
}
