import React, { useState, useEffect } from 'react';
import personService from './services/personService';

import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  const [notification, setNotification] = useState({ message: null, type: '' });

  const showMessage = (msg, type) => {
    setNotification({ message: msg, type: type });

    setTimeout(() => {
      setNotification({ message: null, type: '' });
    }, 3000);
  };

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      })
      .catch(error => {
        console.log('Error fetching data:', error);
        showMessage('Failed to fetch data from server', 'error');
      });
  }, []);

  const handleNameChange = event => {
    setNewName(event.target.value);
  };

  const handleNumberChange = event => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = event => {
    setFilter(event.target.value);
  };

  const addPerson = event => {
    event.preventDefault();

    if (newName.trim() === '') {
      alert('Name cannot be empty');
      return;
    }

    if (newNumber.trim() === '') {
      alert('Number cannot be empty');
      return;
    }

    const isNumeric = str => {
      return /^[-\d\s]+$/.test(str);
    };

    if (!isNumeric(newNumber)) {
      alert('Check the phone number');
      return;
    }

    showMessage('Processing...', 'info');

    const existingPerson = persons.find(person => person.name === newName);

    if (existingPerson) {
      if (window.confirm(`${newName} already exists, replace the old number with the new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        personService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson));
            setNewName('');
            setNewNumber('');
            showMessage('Person updated successfully!', 'success');
          })
          .catch(error => {
            console.log('Error updating person:', error);
            showMessage('Failed to update person', 'error');
          });
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      };

      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
          showMessage('Person added successfully!', 'success');
        })
        .catch(error => {
          console.log('Error creating person:', error);
          showMessage('Failed to add person', 'error');
        });
    }
  };

  const handleDelete = id => {
    if (window.confirm('Confirm delete?')) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
          showMessage('Person deleted successfully!', 'success');
        })
        .catch(error => {
          console.log('Error deleting person:', error);
          showMessage('Failed to delete person', 'error');
        });
    }
  };

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className='phonebook'>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Add new person</h3>
      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;