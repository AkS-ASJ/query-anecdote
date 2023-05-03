import {useMutation, useQueryClient} from "react-query";
import {createAnecdote} from "../requests";

const AnecdoteForm = ({notifDispatch}) => {
    const queryClient = useQueryClient()
    const newAnecdoteMutation = useMutation(createAnecdote, {
        onSuccess: (newAnecdote) => {
            const anecdotes = queryClient.getQueryData('anecdotes')
            queryClient.setQueriesData('anecdotes', anecdotes.concat(newAnecdote))
            notifDispatch({type: 'ADD', payload: newAnecdote.content})
            setTimeout(() => {
                notifDispatch({type: 'ZERO'})
            }, 5000)
        }
    }, {
        onError: () => {
            notifDispatch({type: 'ERROR'})
            setTimeout(() => {
                notifDispatch({type: 'ZERO'})
            }, 5000)
               }}

    )

  const onCreate = (event) => {
        event.preventDefault()
      const content = event.target.anecdote.value
      event.target.anecdote.value = ''
      newAnecdoteMutation.mutate({content, votes: 0})
    }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
