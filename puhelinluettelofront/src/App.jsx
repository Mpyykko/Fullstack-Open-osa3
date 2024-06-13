import React, { useState, useEffect } from 'react'
import personService from './services/personService'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'




const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const [notification, setNotification] = useState({ message: null, type: '' })

  const showMessage = (msg, type) => {
    setNotification({ message: msg, type: type });

    setTimeout(() => {
      setNotification({ message: null, type: '' });
    }, 3000)
  }

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        console.log('Error',error)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()

    // ei tyhjiä nimiä
    if (newName.trim() === '') {
      alert('Name cannot be empty')
   
      return
    }
     // eikä tyhjiä numeroita
     if (newNumber.trim() === '') {
      alert('Number cannot be empty')
   
      return
    }
    // numerolle oikea muoto
    const isNumeric = (str) => {
      return /^[-\d\s]+$/.test(str)
    }
   
    if ((!isNumeric(newNumber))) {
      alert('Check the phonenumber')
      console.log('Error')
      return
    }
    showMessage('Person added successfully!')

  

    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      if (window.confirm(`${newName} already exist, replace the old number with new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber }

        personService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            showMessage('Person updated successfully!', 'success')
          })
          .catch(error => {
            console.log('Error', error)
            showMessage('Failed to update person', error)
          })
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      }

      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          showMessage('Person added successfully!', 'success')
        })
        .catch(error => {
          console.log('Error', error)
          showMessage('Failed to add person', 'error')
        })
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Confirm delete?')) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          showMessage('Person deleted successfully!', 'success')
        })
        .catch(error => {
          console.log('Error', error)
          showMessage('Something went wrong', 'error')
        })
    }
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

 

  return (
    <div className='phonebook'>
      <h2>Phonebook</h2>
      < Notification notification={notification} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Add new person</h3>
      < PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      <h3>Numbers</h3>
     
      <Persons  persons={filteredPersons} handleDelete={handleDelete} />
     
    </div>
  )
}

export default App
