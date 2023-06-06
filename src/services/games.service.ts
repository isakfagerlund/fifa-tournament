import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Game } from '../models/game';

export const createGame = async (game: Game) => {
  try {
    const docRef = await addDoc(collection(db, 'games'), game);

    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const updateGame = async ({
  inProgress,
  teamOneScore,
  teamTwoScore,
  id,
}: {
  inProgress: boolean;
  teamOneScore: number;
  teamTwoScore: number;
  id: string;
}) => {
  try {
    const docRef = doc(db, 'games', id);

    await updateDoc(docRef, {
      inProgress,
      scores: {
        teamOne: teamOneScore,
        teamTwo: teamTwoScore,
      },
    });

    console.log('Updated doc ', docRef.id);
  } catch (e) {
    console.error('Error updating document: ', e);
  }
};
