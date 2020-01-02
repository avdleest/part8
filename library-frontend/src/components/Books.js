import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'

const Books = (props) => {
  const genres = ['bergen', 'dalen', 'dingen', 'vliegen', 'vliegtuig']

  const { loading, error, data } = props.result

  if (!props.show) {
    return null
  }

  if (loading) {
    return <div>loading...</div>
  }

  if (error) {
    props.handleError(error)
  }

  const books = data.allBooks

  return (
    <div>
      <h2>books</h2>
      {props.genre && `In genre ${props.genre}`}
      {!props.genre && 'In all genres'}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(b =>
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      {genres.map(genre =>
        <button key={genre} value={genre} onClick={() => props.setGenre(genre)}>{genre}</button>
      )}
      <button onClick={() => props.setGenre(null)}>all genres</button>

    </div>
  )
}

export default Books