import { useEffect, useState } from 'react';
import './App.css';
import {
  Box,
  Card,
  CardSection,
  Divider,
  Flex,
  Stack,
  Text,
  Title,
} from '@mantine/core';
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
    <Stack style={{ padding: '0px 60px' }}>
      <Title mt={12} align="center">
        Games
      </Title>
      <div className="gamesWrapper">
        {games?.map((game) => {
          const isTeamOneWinner = game.scores.teamOne > game.scores.teamTwo;
          const isTeamTwoWinner = game.scores.teamOne < game.scores.teamTwo;

          return (
            <Card key={game.id} shadow="sm" padding="md">
              <Flex justify="space-between" align="center">
                <div style={{ width: 150 }}>
                  <Text color="dimmed">Game: {game.gameOrder}</Text>
                </div>
                <div style={{ width: '100%' }}>
                  <Flex justify="space-between" align="center">
                    <div>
                      <Text
                        weight={isTeamOneWinner ? 700 : 500}
                        color={isTeamOneWinner ? 'white' : ''}
                        tt="capitalize"
                      >
                        {game.players.teamOne[0]}
                      </Text>
                      <Text
                        weight={isTeamOneWinner ? 700 : 500}
                        color={isTeamOneWinner ? 'white' : ''}
                        mt={6}
                        tt="capitalize"
                      >
                        {game.players.teamOne[1]}
                      </Text>
                    </div>
                    <Flex align="center" gap={12}>
                      <Text
                        weight={isTeamOneWinner ? 700 : 500}
                        color={isTeamOneWinner ? 'white' : ''}
                        tt="capitalize"
                      >
                        {game.scores.teamOne}
                      </Text>
                      <svg aria-label="Winner" height="8" role="img" width="6">
                        <polygon
                          fill={isTeamOneWinner ? '#fff' : '#fff0'}
                          points="6,0 6,8 0,4"
                        ></polygon>
                      </svg>
                    </Flex>
                  </Flex>
                  <Divider my="sm" />
                  <Flex justify="space-between" align="center">
                    <div>
                      <Text
                        weight={isTeamTwoWinner ? 700 : 500}
                        color={isTeamTwoWinner ? 'white' : ''}
                        tt="capitalize"
                      >
                        {game.players.teamTwo[0]}
                      </Text>
                      <Text
                        weight={isTeamTwoWinner ? 700 : 500}
                        color={isTeamTwoWinner ? 'white' : ''}
                        mt={6}
                        tt="capitalize"
                      >
                        {game.players.teamTwo[1]}
                      </Text>
                    </div>
                    <Flex align="center" gap={12}>
                      <Text
                        weight={isTeamTwoWinner ? 700 : 500}
                        color={isTeamTwoWinner ? 'white' : ''}
                        tt="capitalize"
                      >
                        {game.scores.teamTwo}
                      </Text>
                      <svg aria-label="Winner" height="8" role="img" width="6">
                        <polygon
                          fill={isTeamTwoWinner ? '#fff' : '#fff0'}
                          points="6,0 6,8 0,4"
                        ></polygon>
                      </svg>
                    </Flex>
                  </Flex>
                </div>
              </Flex>
              <CardSection>
                <Box
                  mt="md"
                  sx={(theme) => ({
                    backgroundColor: game.inProgress
                      ? theme.colors.green
                      : theme.colors.yellow,
                    height: 6,
                  })}
                />
              </CardSection>
            </Card>
          );
        })}
      </div>
    </Stack>
  );
};

export default Games;
