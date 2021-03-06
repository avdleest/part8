import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'

const Recommendations = (props) => {
  // useEffect(() => {

  //   const settingGenre = () => {
  //     const { loading, error, data } = props.me

  //     if (loading) {
  //       console.log('loading...')
  //     } else if (error) {
  //       props.handleError(error)
  //     } else if (data.me && props.show) {
  //       props.setGenre(data.me.favoriteGenre)
  //     }
  //   }
  //   settingGenre()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.me])

  if (!props.show) {
    return null
  }

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
      <h2>Recommendations</h2>
      <p>{`Books in your favourite genre ${props.genre}`}</p>
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

    </div>
  )
}

export default Recommendations