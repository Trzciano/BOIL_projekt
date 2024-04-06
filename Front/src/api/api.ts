const baseURL = 'http://localhost:5000';
const APIImageGet = async () : Promise<Blob> => {
    const response = await fetch(`${baseURL}/gantt_chart`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Błąd pobierania danych");
    }

    const blob = await response.blob();
      
    return blob;
  };

const APIpost = async <T,K>(endpoint : string, body : T) : Promise<K|null> => {
  try{
    const response = await fetch(`${baseURL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
    });
    const data: K = await response.json();
    return data;
  }
  catch(e)
  {
    console.log(e);
    return null;
  }
   
  };

  export { APIImageGet, APIpost };