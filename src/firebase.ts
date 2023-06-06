import { initializeApp } from 'firebase/app' 
import { getFirestore } from 'firebase/firestore'

const config = {
  projectId: "fifa-tournament-7a5e4",
}

const app = initializeApp(config)

export const db = getFirestore(app);