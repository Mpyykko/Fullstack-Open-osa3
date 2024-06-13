import React  from 'react'
import Person from './Person'


const Persons = ({ persons, handleDelete }) => {
    return (
        <div className="addPersonDiv" >
             
            <ul className='listOfnames' >
                {persons.map((person, index) => (
                <Person key={index} person={person} handleDelete={handleDelete} />
                ))}
            </ul>
      </div>
    )
  }

export default Persons