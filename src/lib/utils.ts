import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const funny_placeholders: string[] = [
  "Sue E**** K****",
  "GWAM is the queen",
  "I hate DAN!!!",
  "Go GAY everyone",
  "I smell like beef",
  "Thank you, thaaaank yoooouuuu",
  "Cos you're all gay for each other",
  "That smells like childhood",
  "Deej lubed full",
  "I don't give a fuuuuuck what men do",
  "🎵 Toxic gossip train 🎵",
  "My ADHD for the win",
  "Biiiiitch",
  "Uhhhh Base?",
  "I hate a lot of men",
  "Speaking of musty ass",
  "Why the fuck you lyin'",
  "Je suis lesbienne",
  "Biiiig titties of justice",
  "And that's just my opinion... woke white woman",
  "Deej is definitely gonna clip that",
  "You had to build a hot bitch",
  "I like stabing things",
  "Ask for the special boob pillow",
  "I'm going so straight right now",
  "I could throw ass to this",
  "If you choose Kate, you're cool shit",
  "I am not a raver, I just like plants"
]

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRandomPlaceholder(): string {
  const index = Math.floor(Math.random() * funny_placeholders.length);
  return funny_placeholders[index];
}
