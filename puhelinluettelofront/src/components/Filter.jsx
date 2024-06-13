import React from 'react'

// filtteröinti
const Filter=({ filter, handleFilterChange }) => {
    return (
        <div className='addPersonDiv'>
      <div className='addPerson' >
        Filter with <input value={filter} onChange={handleFilterChange} />
      </div>
      </div>
    )
  }

export default Filter

