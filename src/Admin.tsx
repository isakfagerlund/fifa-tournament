import { useEffect, useState } from 'react';
import './App.css';
import { User } from './models/user';
import CreateGame from './CreateGame';
import { initialUsers } from './initialUsers';
import { collection, onSnapshot } from 'firebase/firestore';
import { Game } from './models/game';
import { db } from './firebase';
import {
  Button,
  Checkbox,
  Group,
  Input,
  Modal,
  NumberInput,
  Select,
  Space,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { updateGame } from './services/games.service';

const Admin = () => {
  const [users] = useState<User[]>(initialUsers);
  const [games, setGames] = useState<Game[]>();
  const [opened, { open, close }] = useDisclosure(false);
  const [clickedGame, setClickedGame] = useState<Game | undefined>();

  const form = useForm({
    initialValues: {
      teamOneScore: 0,
      teamTwoScore: 0,
      inProgress: false,
      id: '',
    },
  });

  useEffect(() => {
    const unsubGames = onSnapshot(collection(db, 'games'), (data) => {
      const gamesData = data.docs.map(
        (doc) => ({ ...doc.data(), id: doc.id } as Game)
      );
      setGames(gamesData);
    });

    return () => {
      unsubGames();
    };
  }, []);

  const rows = games?.map((game, i) => (
    <tr
      onClick={() => {
        form.setValues({
          teamOneScore: game.scores.teamOne,
          teamTwoScore: game.scores.teamTwo,
          inProgress: game.inProgress,
        });

        setClickedGame(game);
        open();
      }}
      key={i}
    >
      <td>{game.inProgress ? 'Yes' : 'No'}</td>
      <td>
        {game.players.teamOne.map((name, i) => (
          <Text key={i} tt="capitalize">
            {name}
          </Text>
        ))}
      </td>
      <td>
        {game.players.teamTwo.map((name, i) => (
          <Text key={i} tt="capitalize">
            {name}
          </Text>
        ))}
      </td>
      <td>{game.scores.teamOne}</td>
      <td>{game.scores.teamTwo}</td>
      <td>{game.id}</td>
    </tr>
  ));

  return (
    <div style={{ padding: 60 }}>
      <Stack>
        <Title>Admin Page</Title>
        <div>
          <CreateGame users={users} />
        </div>
        <div>
          <Table>
            <thead>
              <tr>
                <th>In Progress</th>
                <th>Team 1</th>
                <th>Team 2</th>
                <th>Team 1 Score</th>
                <th>Team 2 Score</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </div>
      </Stack>
      <Modal opened={opened} onClose={close} title="Edit game" centered>
        <Text>Game: {clickedGame?.id}</Text>
        <Space h="md" />
        <form
          onSubmit={form.onSubmit((values) => {
            const updatedGame: {
              inProgress: boolean;
              teamOneScore: number;
              teamTwoScore: number;
              id: string;
            } = {
              teamOneScore: values.teamOneScore,
              teamTwoScore: values.teamTwoScore,
              inProgress: values.inProgress,
              id: clickedGame?.id ?? '',
            };

            updateGame(updatedGame);
            close();
          })}
        >
          <Group>
            <div>
              <NumberInput
                label={`Team One score : ${clickedGame?.players.teamOne[0]} ${clickedGame?.players.teamOne[1]}`}
                placeholder="Score"
                {...form.getInputProps('teamOneScore')}
              />
              <Space h="md" />
              <NumberInput
                label={`Team Two score : ${clickedGame?.players.teamTwo[0]} ${clickedGame?.players.teamTwo[1]}`}
                placeholder="Score"
                {...form.getInputProps('teamTwoScore')}
              />
              <Space h="md" />
              <Checkbox
                label="Game in progress"
                {...form.getInputProps('inProgress', { type: 'checkbox' })}
              />
            </div>
          </Group>
          <Space h="md" />
          <Group position="right">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Modal>
    </div>
  );
};

export default Admin;
