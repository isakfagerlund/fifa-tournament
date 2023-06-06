import { useState, useEffect } from 'react';
import './App.css';
import { User } from './models/user';
import { db } from './firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Game } from './models/game';
import { initialUsers } from './initialUsers';
import { useAutoAnimate } from '@formkit/auto-animate/react';

const App = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [games, setGames] = useState<Game[]>();
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

  const addWin = (player: User, goalDifference: number) => {
    setUsers((prevUsers) => {
      const updatedUsers = prevUsers?.map((user) => {
        if (user.name === player.name) {
          return {
            ...player,
            points: player.points + 3,
            wins: player.wins + 1,
            goalDifference: player.goalDifference + goalDifference,
            matchesPlayed: player.matchesPlayed + 1,
          };
        } else {
          return user;
        }
      });
      return updatedUsers;
    });
  };

  const addLoss = (player: User, goalDifference: number) => {
    setUsers((prevUsers) => {
      const updatedUsers = prevUsers?.map((user) => {
        if (user.name === player.name) {
          return {
            ...player,
            losses: player.losses + 1,
            goalDifference: player.goalDifference + goalDifference,
            matchesPlayed: player.matchesPlayed + 1,
          };
        } else {
          return user;
        }
      });
      return updatedUsers;
    });
  };

  const addDraw = (player: User) => {
    setUsers((prevUsers) => {
      const updatedUsers = prevUsers?.map((user) => {
        if (user.name === player.name) {
          return {
            ...player,
            points: player.points + 1,
            draws: player.draws + 1,
            matchesPlayed: player.matchesPlayed + 1,
          };
        } else {
          return user;
        }
      });

      return updatedUsers;
    });
  };

  useEffect(() => {
    setUsers(initialUsers);

    const unsubGames = onSnapshot(collection(db, 'games'), (data) => {
      const games = data.docs.map((doc) => doc.data() as Game);

      setGames(games);
    });

    return () => {
      unsubGames();
    };
  }, []);

  useEffect(() => {
    if (games) {
      const calculateTableScore = (games: Game[]) => {
        games.forEach((game) => {
          if (!game.inProgress) return;
          const teamOnePlayers = game.players.teamOne;
          const teamTwoPlayers = game.players.teamTwo;
          const { teamOne: teamOneScore, teamTwo: teamTwoScore } = game.scores;
          const goalDifferenceTeamOne = teamTwoScore - teamOneScore;
          const goalDifferenceTeamTwo = teamOneScore - teamTwoScore;

          const firstPlayers = users?.filter((user) => {
            return (
              user.name === teamOnePlayers[0] || user.name === teamOnePlayers[1]
            );
          });
          const secondPlayers = users?.filter((user) => {
            return (
              user.name === teamTwoPlayers[0] || user.name === teamTwoPlayers[1]
            );
          });

          console.log(firstPlayers);
          console.log(secondPlayers);

          // Team one Wins
          if (teamOneScore > teamTwoScore) {
            if (firstPlayers) {
              firstPlayers.forEach((player) => {
                addWin(player, goalDifferenceTeamOne);
              });
            }

            if (secondPlayers) {
              secondPlayers.forEach((player) =>
                addLoss(player, goalDifferenceTeamTwo)
              );
            }

            // Team two Wins
          } else if (teamOneScore < teamTwoScore) {
            if (secondPlayers) {
              secondPlayers.forEach((player) =>
                addWin(player, goalDifferenceTeamTwo)
              );
            }
            if (firstPlayers) {
              firstPlayers.forEach((player) =>
                addLoss(player, goalDifferenceTeamOne)
              );
            }

            // Draw
          } else if (teamOneScore === teamTwoScore) {
            if (secondPlayers) {
              secondPlayers.forEach((player) => addDraw(player));
            }
            if (firstPlayers) {
              firstPlayers.forEach((player) => addDraw(player));
            }
          }
        });
      };

      calculateTableScore(games);
    }
  }, [games]);

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
