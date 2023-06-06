import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Game } from "../models/game";

export const createGame = async (game: Game) => {
  try {
    const docRef = await addDoc(collection(db, "games"), game);
  
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}