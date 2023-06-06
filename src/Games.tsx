import { useEffect, useState } from 'react';
import './App.css';
import { MantineProvider, Stack } from '@mantine/core';
import { Game } from './models/game';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from './firebase';

const Games = () => {
  const [games, setGames] = useState<Game[]>();

  useEffect(() => {
    const q = query(collection(db, 'games'), orderBy('gameOrder', 'asc'));
    const unsubGames = onSnapshot(q, (data) => {
      const games = data.docs.map(
        (doc) => ({ ...doc.data(), id: doc.id } as Game)
      );

      setGames(games);
    });

    return () => {
      unsubGames();
    };
  }, []);

  return (
    <Stack style={{ padding: 60 }}>
      <h2>Games</h2>
      {games?.map((game, i) => {
        return (
          <div key={i} className="game">
            <div>
              <h3>Team One</h3>
              {game.players.teamOne.map((player, i) => (
                <p key={i}>{player}</p>
              ))}
            </div>
            <div>
              <h3>Team Two</h3>
              {game.players.teamTwo.map((player, i) => (
                <p key={i}>{player}</p>
              ))}
            </div>
            <div>
              <h3>Score</h3>
              {game.scores.teamOne} : {game.scores.teamTwo}
            </div>
            <div>
              <h3>Game Started</h3>
              {game.inProgress ? 'Yes' : 'No'}
            </div>
          </div>
        );
      })}
    </Stack>
  );
};

export default Games;
