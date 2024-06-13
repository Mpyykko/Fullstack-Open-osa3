import React from 'react'

const PersonForm = ({ newName, handleNameChange, newNumber, handleNumberChange, addPerson }) => {
    return (
      <form onSubmit={addPerson}>
        <div className='addPersonDiv'>
            <div className='addPerson' >Name: <input value={newName} onChange={handleNameChange} /></div>
        </div>

        <div className='addPersonDiv' >
            <div className='addPerson' >Number: <input value={newNumber} onChange={handleNumberChange} /></div>
        </div>

     
        <div >
            <button type="submit" className='buttons'>Add</button>
        </div>
      </form>
    )
  }

  export default PersonForm