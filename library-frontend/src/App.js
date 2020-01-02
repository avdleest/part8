import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import { gql } from 'apollo-boost'
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks'

const ALL_AUTHORS = gql`
  {
    allAuthors  {
      name
      born
      bookCount
    }
  }
`

const ME = gql`
  {
    me {
      favoriteGenre
    }
  }
`

const LOGIN = gql`
mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password)  {
    value
  }
}
`

const ALL_BOOKS = gql`
query getBooks($author: String, $genre: String) {
  allBooks(author: $author, genre: $genre) {
    title
    published
    author {
      name
      born
    }
    genres
  }
}
`

const CREATE_BOOK = gql`
mutation createBook($title: String!, $published: Int!, $author: String!, $genres: [String!]) {
  addBook(
    title: $title
      published: $published
      author: $author
      genres: $genres
  )
  {
    title
    published
    author {
      name
      born
    }
    genres
    id
  }
}
`

const MODIFY_AUTHOR = gql`
mutation modifyAuthor($name: String!, $setBornTo: Int!) {
  editAuthor(
    name: $name
      setBornTo: $setBornTo
  )
  {
    name
    born
  }
}
`
const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('library-user-token')

    if (token) setToken(token)
  }, [])

  const client = useApolloClient()

  const handleError = (error) => {
    setErrorMessage(error.message || 'error:(')
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const authors = useQuery(ALL_AUTHORS)

  const me = useQuery(ME)

  const [login] = useMutation(LOGIN, {
    onError: handleError,
    refetchQueries: [{ query: ME }]
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  const [addBook] = useMutation(CREATE_BOOK, {
    onError: handleError,
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: ALL_BOOKS, variables: { genre: null } })
      dataInStore.allBooks.push(response.data.addBook)
      store.writeQuery({
        query: ALL_BOOKS,
        data: dataInStore
      })
    }
  })

  const [editAuthor] = useMutation(MODIFY_AUTHOR, {
    onError: handleError,
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {!token && <button onClick={() => setPage('login')}>login</button>}
        {token && <button onClick={() => setPage('recommendations')}>recommendations</button>}
        {token && <button onClick={logout}>logout</button>}

      </div>
      {errorMessage &&
        <div style={{ color: 'red' }}>
          {errorMessage}
        </div>
      }

      {token && <div>{token}</div>}

      <Authors
        show={page === 'authors'} result={authors} editAuthor={editAuthor}
      />

      <Books
        show={page === 'books'} ALL_BOOKS={ALL_BOOKS} handleError={handleError}
      />

      <NewBook
        show={page === 'add'} addBook={addBook}
      />

      <LoginForm
        show={page === 'login'} login={login} setToken={(token => setToken(token))} setPage={(page => setPage(page))}
      />

      <Recommendations
        show={page === 'recommendations'} ALL_BOOKS={ALL_BOOKS} handleError={handleError} me={me}
      />

    </div>
  )
}

export default App