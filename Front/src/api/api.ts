import react from 'react'

const baseURL = 'https://localhost:5000';
const apiGet = async <T>(endpoint : string): Promise<T> => {
    const response = await fetch(`${baseURL}/${endpoint}`, {
        method: 'GET',

      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data: T = await response.json();
      return data;
  };

export default apiGet;