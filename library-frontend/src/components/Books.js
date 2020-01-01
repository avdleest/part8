import React, { useState } from 'react'

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  if (!props.show) {
    return null
  }

  const genres = ['bergen', 'dalen', 'dingen', 'vliegen', 'vliegtuig']

  if (props.result.loading) {
    return <div>loading...</div>
  }

  const books = props.result.data.allBooks

  return (
    <div>
      <h2>books</h2>
      {genre && `In genre ${genre}`}
      {!genre && 'In all genres'}
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
          {books.filter(b =>
            (genre) ? b.genres.includes(genre) : b
          ).map(b =>
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      {genres.map(genre =>
        <button key={genre} value={genre} onClick={() => setGenre(genre)}>{genre}</button>
      )}
      <button onClick={() => setGenre(null)}>all genres</button>

    </div>
  )
}

export default Books