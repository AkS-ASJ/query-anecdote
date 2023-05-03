import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import {useMutation, useQuery, useQueryClient} from "react-query";
import {getAnecdotes, updateAnecdote} from "./requests";
import {useReducer} from "react";
const notifReducer = (state, action) => {
    switch (action.type) {
        case "VOTE":
            return `You voted "${action.payload}"`
        case "ADD":
            return `You added "${action.payload}"`
        case "ZERO":
            return ''
        case "ERROR":
            return "Too short anecdote, must have length 5 or more"
        default:
            return state
    }
}
const App = () => {


    const [notification, notifDispatch] = useReducer(notifReducer, '')

    const queryClient = useQueryClient()
    const newAnecdoteMutation = useMutation(updateAnecdote, {
        onSuccess: (anecdote) => {
            const anecdotes = queryClient.getQueryData('anecdotes')
            queryClient.setQueriesData('anecdotes',
                anecdotes.map(a => a.id !== anecdote.id ? a : anecdote))
        }
    })
  const handleVote = (anecdote) => {
      const votedAnecdote = anecdotes.find(a => a.id === anecdote.id)
      const updatedAnecdote = {...votedAnecdote, votes: votedAnecdote.votes + 1}
      newAnecdoteMutation.mutate(updatedAnecdote)
      notifDispatch({type: 'VOTE', payload: votedAnecdote.content})
      setTimeout(() => {
         notifDispatch({type: 'ZERO'})
      }, 5000)
  }

    const result = useQuery(
        'anecdotes', getAnecdotes, {
            refetchOnWindowFocus: false
        })

    console.log(result)

    if ( result.isLoading ) {
        return <div>loading data...</div>
    } else if (result.isError){
        return <div>Anecdote service not available due to problems in server</div>
    }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification notification={notification}/>
      <AnecdoteForm notifDispatch={notifDispatch}/>
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
