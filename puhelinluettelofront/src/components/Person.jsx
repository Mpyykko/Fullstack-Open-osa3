import React from 'react'


const Person = ({ person, handleDelete }) => {
    return (
       <div className='container' >
        <div className='listOfnamesDiv'>
                <li>
                    {person.name} {person.number} 
                    <button className='deleteButtons' onClick={() => handleDelete(person.id)}>delete</button>
                </li>
            </div>
        </div>
   
    )
  }

export  default Person