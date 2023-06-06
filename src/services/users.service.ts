import { collection, getDocs, addDoc, doc, updateDoc, increment, AddPrefixToKeys } from "firebase/firestore";
import { db } from "../firebase";
import { User } from "../models/user";

export const getUsers = async () => {
  try {
    const usersQuery = await getDocs(collection(db, "users"));
    const data = usersQuery.docs.map((doc) => doc.data() as User);
    return data
  } catch (error) {
    console.error('Error getting users:', error);
  }
}

export const createUser = async (user: User) => {
  try {
    const docRef = await addDoc(collection(db, "users"), user);
  
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export const updateUser = async (user: User) => {
  try {
    const userRef = doc(db, "users", user.id!);
    await updateDoc(userRef, {
      draws: user.draws,
      goalDifference: user.goalDifference,
      losses: user.losses,
      matchesPlayed: user.matchesPlayed,
      name: user.name,
      points: user.points,
      wins: user.wins
    });


    console.log('User updated')
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}