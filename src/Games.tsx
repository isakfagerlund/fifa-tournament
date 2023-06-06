import { useEffect, useState } from 'react';
import './App.css';
import { MantineProvider } from '@mantine/core';
import { Game } from './models/game';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

const Games = () => {
  const [games, setGames] = useState<Game[]>();

  useEffect(() => {
    const unsubGames = onSnapshot(collection(db, 'games'), (data) => {
      const games = data.docs.map((doc) => doc.data() as Game);
      setGames(games);
    });

    return () => {
      unsubGames();
    };
  }, []);

  return (
    <MantineProvider theme={{ colorScheme: 'dark' }}>
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
    </MantineProvider>
  );
};

export default Games;
