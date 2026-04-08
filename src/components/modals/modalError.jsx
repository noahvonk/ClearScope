import React, { useState, useEffect } from 'react';

export default function ModalError({ errorMessage, setErrorMessage }) {
    
    return(
        <div className='modal-error-container'>
            <h2>ClearScope Encountered an Error</h2>
            <p>{errorMessage}</p>
            <button className='button-accept' onClick={() => setErrorMessage(null)}>Close</button>
        </div>
    )
}

