const baseURL = 'http://localhost:5000';
const APIget = async <T>(endpoint : string): Promise<T> => {
    const response = await fetch(`${baseURL}/${endpoint}`, {
        method: 'GET',

      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data: T = await response.json();
      return data;
  };

const APIpost = async (endpoint : string, body : any) => {
    const response = await fetch(`${baseURL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.text();
    return data;
  };

  export { APIget, APIpost };