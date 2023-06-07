import { useState, useEffect, useCallback } from 'react';
import './App.css';
import { User } from './models/user';
import { db } from './firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { Game } from './models/game';
import { initialUsers } from './initialUsers';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Flex, Text } from '@mantine/core';

const winIcon =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iV2luIj4KICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbCIgZmlsbD0iIzNBQTc1NyIgY3g9IjgiIGN5PSI4IiByPSI4Ij48L2NpcmNsZT4KICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlBhdGgiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgcG9pbnRzPSI2LjQgOS43NiA0LjMyIDcuNjggMy4yIDguOCA2LjQgMTIgMTIuOCA1LjYgMTEuNjggNC40OCI+PC9wb2x5Z29uPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+Cg==';
const looseIcon =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iTG9zcyI+CiAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwiIGZpbGw9IiNFQTQzMzUiIGN4PSI4IiBjeT0iOCIgcj0iOCI+PC9jaXJjbGU+CiAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJQYXRoIiBmaWxsPSIjRkZGRkZGIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4LjAwMDAwMCwgOC4wMDAwMDApIHJvdGF0ZSgtMzE1LjAwMDAwMCkgdHJhbnNsYXRlKC04LjAwMDAwMCwgLTguMDAwMDAwKSAiIHBvaW50cz0iMTIgOC44IDguOCA4LjggOC44IDEyIDcuMiAxMiA3LjIgOC44IDQgOC44IDQgNy4yIDcuMiA3LjIgNy4yIDQgOC44IDQgOC44IDcuMiAxMiA3LjIiPjwvcG9seWdvbj4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=';
const drawIcon =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iRHJhdyI+CiAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwiIGZpbGw9IiM5QUEwQTYiIGN4PSI4IiBjeT0iOCIgcj0iOCI+PC9jaXJjbGU+CiAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJQYXRoIiBmaWxsPSIjRkZGRkZGIiBwb2ludHM9IjUgNyAxMSA3IDExIDkgNSA5Ij48L3BvbHlnb24+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K';

const App = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [_, setGames] = useState<Game[]>();
  const [parent] = useAutoAnimate();

  console.log(users);

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
      goalDifference: {
        winners: number;
        loosers: number;
      };
    } => {
      if (game.scores.teamOne > game.scores.teamTwo) {
        return {
          winners: game.players.teamOne,
          loosers: game.players.teamTwo,
          goalDifference: {
            winners: game.scores.teamOne - game.scores.teamTwo,
            loosers: game.scores.teamTwo - game.scores.teamOne,
          },
          draw: undefined,
        };
      } else if (game.scores.teamOne < game.scores.teamTwo) {
        return {
          winners: game.players.teamTwo,
          loosers: game.players.teamOne,
          goalDifference: {
            winners: game.scores.teamTwo - game.scores.teamOne,
            loosers: game.scores.teamOne - game.scores.teamTwo,
          },
          draw: undefined,
        };
      }

      return {
        winners: undefined,
        loosers: undefined,
        goalDifference: {
          winners: 0,
          loosers: 0,
        },
        draw: [...game.players.teamOne, ...game.players.teamTwo],
      };
    };

    setUsers((prevUsers) => {
      const { winners, loosers, draw, goalDifference } = getResult();

      const updatedUsers = prevUsers.map((user) => {
        // Winners
        if (winners?.includes(user.name)) {
          return {
            ...user,
            points: user.points + 3,
            wins: user.wins + 1,
            matchesPlayed: user.matchesPlayed + 1,
            previousGames: [...user.previousGames, 'win'],
            goalDifference: user.goalDifference + goalDifference.winners,
          };
        } else if (loosers?.includes(user.name)) {
          // Loosers
          return {
            ...user,
            losses: user.losses + 1,
            matchesPlayed: user.matchesPlayed + 1,
            goalDifference: user.goalDifference + goalDifference.loosers,
            previousGames: [...user.previousGames, 'loose'],
          };
        } else if (draw?.includes(user.name)) {
          // Draw
          return {
            ...user,
            points: user.points + 1,
            draws: user.draws + 1,
            matchesPlayed: user.matchesPlayed + 1,
            previousGames: [...user.previousGames, 'draw'],
          };
        }

        return user;
      });

      return updatedUsers;
    });
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'games'), orderBy('gameOrder', 'asc'));
    const unsubGames = onSnapshot(q, (data) => {
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
          <Text>Name</Text>
          <Text align="center">MP</Text>
          <Text align="center">Wins</Text>
          <Text align="center">Draws</Text>
          <Text align="center">Losses</Text>
          <Text align="center">GD</Text>
          <Text align="center">Points</Text>
          <Text align="center">Last 3</Text>
        </div>
        {sortedUsers?.map((user, i) => {
          return (
            <div className="row" key={user.name}>
              <Text className="name">
                {i + 1} {user.name}
              </Text>
              <Text align="center">{user.matchesPlayed}</Text>
              <Text align="center">{user.wins}</Text>
              <Text align="center">{user.draws}</Text>
              <Text align="center">{user.losses}</Text>
              <Text align="center">{user.goalDifference}</Text>
              <Text align="center">{user.points}</Text>
              <Flex justify="center">
                <Flex
                  style={{ width: '100%' }}
                  align="flex-start"
                  justify="center"
                  gap={8}
                >
                  {user.previousGames.slice(-3).map((pGame, i) => {
                    const imgStyle = { width: 16, height: 16, marginTop: 4 };

                    if (pGame === 'win') {
                      return <img key={i} style={imgStyle} src={winIcon} />;
                    } else if (pGame === 'loose') {
                      return <img key={i} style={imgStyle} src={looseIcon} />;
                    } else if (pGame === 'draw') {
                      return <img key={i} style={imgStyle} src={drawIcon} />;
                    }
                  })}
                </Flex>
              </Flex>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
