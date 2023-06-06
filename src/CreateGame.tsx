import { useForm } from '@mantine/form';
import { User } from './models/user';
import { Button, Group, Select, Space, Stack, Text } from '@mantine/core';
import { Game } from './models/game';
import { createGame } from './services/games.service';

const CreateGame = ({ users }: { users: User[] | undefined }) => {
  const form = useForm({
    initialValues: {
      teamOnePlayerOne: '',
      teamOnePlayerTwo: '',
      teamTwoPlayerOne: '',
      teamTwoPlayerTwo: '',
    },
  });

  return users ? (
    <div>
      <Stack align="center">
        <Text>Create new game</Text>
        <form
          onSubmit={form.onSubmit((values) => {
            const newGame: Game = {
              players: {
                teamOne: [values.teamOnePlayerOne, values.teamOnePlayerTwo],
                teamTwo: [values.teamTwoPlayerOne, values.teamTwoPlayerTwo],
              },
              scores: {
                teamOne: 0,
                teamTwo: 0,
              },
              inProgress: false,
            };

            createGame(newGame);
          })}
        >
          <Group>
            <div>
              <Select
                label="Player one Team One"
                placeholder="Name of player"
                {...form.getInputProps('teamOnePlayerOne')}
                data={users.map((user) => ({
                  value: user.name,
                  label: user.name,
                }))}
              />
              <Select
                label="Player two Team One"
                placeholder="Name of player"
                {...form.getInputProps('teamOnePlayerTwo')}
                data={users.map((user) => ({
                  value: user.name,
                  label: user.name,
                }))}
              />
            </div>
            <Text>VS</Text>
            <div>
              <Select
                label="Player one Team Two"
                placeholder="Name of player"
                {...form.getInputProps('teamTwoPlayerOne')}
                data={users.map((user) => ({
                  value: user.name,
                  label: user.name,
                }))}
              />
              <Select
                label="Player two Team Two"
                placeholder="Name of player"
                {...form.getInputProps('teamTwoPlayerTwo')}
                data={users.map((user) => ({
                  value: user.name,
                  label: user.name,
                }))}
              />
            </div>
          </Group>
          <Space h="md" />
          <Group position="right">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Stack>
    </div>
  ) : null;
};

export default CreateGame;
