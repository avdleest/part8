import React, { useState } from 'react'


const Authors = (props) => {
  const [name, setName] = useState('')
  const [birthyear, setBirthyear] = useState('')

  if (!props.show) {
    return null
  }

  if (props.result.loading) {
    return <div>loading...</div>
  }

  const authors = props.result.data.allAuthors

  const submit = async (e) => {
    e.preventDefault()

    await props.editAuthor({
      // authors[0].name is a dirty solution when loading the page initially: the first option is selected but not saved in React state
      variables: { name: name || authors[0].name, setBornTo: parseInt(birthyear) }
    })

    setName(authors[0].name)
    setBirthyear('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <label>name
          <select value={name} onChange={({ target }) => setName(target.value)}>
            {authors.map(a =>
              <option key={a.name} value={a.name}>{a.name}</option>)}
          </select>
        </label>
        <div>
          born
          <input
            type='number'
            value={birthyear}
            onChange={({ target }) => setBirthyear(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>


    </div>
  )
}

export default Authors