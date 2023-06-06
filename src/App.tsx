import { useState, useEffect } from 'react'
import './App.css'
import { createUser, updateUser } from './services/users.service'
import { User } from './models/user'
import { Box, Button, Group, MantineProvider, Select, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { db } from './firebase'
import { collection, onSnapshot } from 'firebase/firestore';
import { Game } from './models/game';
import { createGame } from './services/games.service';

const CreateGame = ({users}: {users: User[] | undefined}) => {
  const form = useForm({
    initialValues: {
      teamOnePlayerOne: "",
      teamOnePlayerTwo: "",
      teamTwoPlayerOne: "",
      teamTwoPlayerTwo: ""
    }
  });

  return users ? (
    <Box maw={300} mx="auto">
      <Text>Create new game</Text>
      <form onSubmit={form.onSubmit((values) => {
        const newGame: Game = {
          players: {
            teamOne: [values.teamOnePlayerOne, values.teamOnePlayerTwo],
            teamTwo: [values.teamTwoPlayerOne, values.teamTwoPlayerTwo]
          },
          scores: {
            teamOne: 0,
            teamTwo: 0
          },
          inProgress: false
        }

        createGame(newGame)
      })}>
        <Select
          label="Player one Team One"
          placeholder="Name of player"
          {...form.getInputProps('teamOnePlayerOne')}
          data={
            users.map(user => ({value: user.name, label: user.name}))
          }
        />
        <Select
          label="Player two Team One"
          placeholder="Name of player"
          {...form.getInputProps('teamOnePlayerTwo')}
          data={
            users.map(user => ({value: user.name, label: user.name}))
          }
        />

        <Text>VS</Text>

        <Select
          label="Player one Team Two"
          placeholder="Name of player"
          {...form.getInputProps('teamTwoPlayerOne')}
          data={
            users.map(user => ({value: user.name, label: user.name}))
          }
        />
        <Select
          label="Player two Team Two"
          placeholder="Name of player"
          {...form.getInputProps('teamTwoPlayerTwo')}
          data={
            users.map(user => ({value: user.name, label: user.name}))
          }
        />

        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  ) : null
}

const CreateUserForm = () => {
  const form = useForm({
    initialValues: {
      name: '',
    }
  });

  return (
    <Box maw={300} mx="auto">
      <Text>Add new user</Text>
      <form onSubmit={form.onSubmit((values) => {
        const newUser: User = {
          name: values.name,
          draws: 0,
          goalDifference: 0,
          losses: 0,
          matchesPlayed: 0,
          points: 0,
          wins: 0
        }

        createUser(newUser)
      })}>
        <TextInput
          label="Name"
          placeholder="Name"
          {...form.getInputProps('name')}
        />

        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
}

const App = () => {
  const [users, setUsers] = useState<User[] | undefined>()
  const [games, setGames] = useState<Game[] | undefined>()

  const [showAdmin, setShowAdmin] = useState(false)

  useEffect(() => {
      const unsubUsers = onSnapshot(collection(db, "users"), (data) => {
        const users = data.docs.map((doc) => ({...doc.data(), id: doc.id} as User))
        setUsers(users)
      });

      const unsubGames = onSnapshot(collection(db, "games"), (data) => {
        const games = data.docs.map((doc) => doc.data() as Game)

        const calculateTableScore = (games: Game[]) => {
          games.forEach(game => {
            const teamOnePlayers = game.players.teamOne
            const teamTwoPlayers = game.players.teamTwo
            const { teamOne: teamOneScore, teamTwo: teamTwoScore } = game.scores
            
            if(teamOneScore > teamTwoScore) {
              console.log(`Team one: ${teamOnePlayers} wins with ${teamOneScore} against ${teamTwoScore}`)
              // update players that won
              const firstPlayers = users?.filter(user => {
                return user.name === teamOnePlayers[0] || user.name === teamOnePlayers[1]
              })

              if(firstPlayers) {
                firstPlayers.forEach(player => {
                  updateUser({...player, points: player.points + 3})
                })
              }
              // update players that lost
            } else if(teamOneScore < teamTwoScore) {
              console.log(`Team two: ${teamTwoPlayers} wins with ${teamTwoScore} against ${teamOneScore}`)
            }

          })
        }
        calculateTableScore(games)

        setGames(games)
      });
  
    return () => {
      unsubUsers();
      unsubGames()
    };
  }, []);

  return (
    <MantineProvider theme={{ colorScheme: 'dark' }}>
      <div className="container">
        <Button onClick={() => setShowAdmin(!showAdmin)}>Show Admin</Button>
        {showAdmin && <CreateGame users={users} /> }
        <h2>Fifa Tournament</h2>
          <div className='table'>
            {users?.map(user => {
              return (
                <div className='row' key={user.name}>
                  <span className='name'>{user.name}</span>
                  <span>{user.matchesPlayed}</span>
                  <span>{user.wins}</span>
                  <span>{user.draws}</span>
                  <span>{user.losses}</span>
                  <span>{user.goalDifference}</span>
                  <span>{user.points}</span>
                </div>
              )
            })}
        </div>
        <h2>Games</h2>
        {games?.map((game, i) => {
          return (
            <div key={i} className="game">
              <div>
                <h3>Team One</h3>
                {game.players.teamOne.map(player => <p>{player}</p>)} 
              </div>
              <div>
                <h3>Team Two</h3>
                {game.players.teamTwo.map(player => <p>{player}</p>)}
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
          )
        })}
      </div>
    </MantineProvider>
  )
}

export default App

{/* <div className='table'>
<p>Name</p>
<p>Matches Played</p>
<p>Wins</p>
<p>Draws</p>
<p>Losses</p>
<p>Goal Difference</p>
<p>Points</p> */}