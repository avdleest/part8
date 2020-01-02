import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import { gql } from 'apollo-boost'
import { useQuery, useMutation, useApolloClient, useSubscription } from '@apollo/react-hooks'

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
const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    id
    title
    published 
    author {
      name
      born
    }
    genres
  }
`

const ALL_BOOKS = gql`
query getBooks($author: String, $genre: String) {
  allBooks(author: $author, genre: $genre) {
    ...BookDetails
  }
}
${BOOK_DETAILS}
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
    ...BookDetails
  }
}
${BOOK_DETAILS}
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

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('library-user-token')

    if (token) setToken(token)
  }, [])

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) =>
      set.map(b => b.id).includes(object.id)

    const dataInStore = client.readQuery({ query: ALL_BOOKS, variables: { genre: null } })
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      dataInStore.allBooks.push(addedBook)
      console.log(dataInStore)
      client.writeQuery({
        query: ALL_BOOKS,
        data: dataInStore
      })
    }
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const book = subscriptionData.data.bookAdded
      window.alert(`A new book had been added with title ${book.title} by ${book.author.name}`)
      updateCacheWith(book)
    }
  })

  const client = useApolloClient()

  const handleError = (error) => {
    setErrorMessage(error.message || 'error:(')
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const authors = useQuery(ALL_AUTHORS)

  const me = useQuery(ME)

  // const books = useQuery(ALL_BOOKS)

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
      updateCacheWith(response.data.addedBook)
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