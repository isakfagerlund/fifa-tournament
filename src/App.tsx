import { useState, useEffect, useCallback } from 'react';
import './App.css';
import { User } from './models/user';
import { db } from './firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Game } from './models/game';
import { initialUsers } from './initialUsers';
import { useAutoAnimate } from '@formkit/auto-animate/react';

const App = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [_, setGames] = useState<Game[]>();
  const [parent] = useAutoAnimate();

  const sortedUsers = [...users].sort((a, b) => {
    // compare points
    if (a.points < b.points) {
      return 1;
    } else if (a.points > b.points) {
      return -1;
    }

    if (a.goalDifference < b.goalDifference) {
      return 1;
    } else if (a.goalDifference > b.goalDifference) {
      return -1;
    }

    return 0;
  });

  const updatePlayerPoints = useCallback((game: Game) => {
    const getResult = (): {
      winners: string[] | undefined;
      loosers: string[] | undefined;
      draw: string[] | undefined;
    } => {
      if (game.scores.teamOne > game.scores.teamTwo) {
        return {
          winners: game.players.teamOne,
          loosers: game.players.teamTwo,
          draw: undefined,
        };
      } else if (game.scores.teamOne < game.scores.teamTwo) {
        return {
          winners: game.players.teamTwo,
          loosers: game.players.teamOne,
          draw: undefined,
        };
      }

      return {
        winners: undefined,
        loosers: undefined,
        draw: [...game.players.teamOne, ...game.players.teamTwo],
      };
    };

    setUsers((prevUsers) => {
      const { winners, loosers, draw } = getResult();

      const updatedUsers = prevUsers.map((user) => {
        if (winners?.includes(user.name)) {
          return {
            ...user,
            points: user.points + 3,
            matchesPlayed: user.matchesPlayed + 1,
          };
        } else if (loosers?.includes(user.name)) {
          return {
            ...user,
            matchesPlayed: user.matchesPlayed + 1,
          };
        } else if (draw?.includes(user.name)) {
          return {
            ...user,
            points: user.points + 1,
            matchesPlayed: user.matchesPlayed + 1,
          };
        }

        return user;
      });

      return updatedUsers;
    });
  }, []);

  useEffect(() => {
    const unsubGames = onSnapshot(collection(db, 'games'), (data) => {
      setUsers(initialUsers);
      const games = data.docs.map((doc) => doc.data() as Game);

      games.forEach((game) => {
        if (game.inProgress) {
          updatePlayerPoints(game);
        }
      });
      setGames(games);
    });

    return () => {
      unsubGames();
    };
  }, [updatePlayerPoints]);

  return (
    <div className="container">
      <h2>Fifa Tournament</h2>
      <div ref={parent} className="table">
        <div className="row">
          <p>Name</p>
          <p>MP</p>
          <p>Wins</p>
          <p>Draws</p>
          <p>Losses</p>
          <p>GD</p>
          <p>Points</p>
        </div>
        {sortedUsers?.map((user) => {
          return (
            <div className="row" key={user.name}>
              <span className="name">{user.name}</span>
              <span>{user.matchesPlayed}</span>
              <span>{user.wins}</span>
              <span>{user.draws}</span>
              <span>{user.losses}</span>
              <span>{user.goalDifference}</span>
              <span>{user.points}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
