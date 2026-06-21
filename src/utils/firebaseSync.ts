import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { LogEntry, Quest, Badge } from "../types";

export interface UserProfileData {
  ecoCoins: number;
  streakDays: number;
  logs: LogEntry[];
  quests: Quest[];
  badges: Badge[];
}

export async function saveUserProfile(userId: string, data: UserProfileData): Promise<void> {
  try {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn("Failed to backup user carbon profile to Firestore.", err);
  }
}

export async function fetchUserProfile(userId: string): Promise<UserProfileData | null> {
  try {
    const userDocRef = doc(db, "users", userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ecoCoins: data.ecoCoins ?? 180,
        streakDays: data.streakDays ?? 5,
        logs: data.logs ?? [],
        quests: data.quests ?? [],
        badges: data.badges ?? []
      };
    }
  } catch (err) {
    console.error("Failed to load user carbon profile from Firestore.", err);
  }
  return null;
}
