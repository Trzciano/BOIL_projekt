import { CPMModel } from "./CPMModel";

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

const APIpost = async <T,K>(endpoint : string, body : T) : Promise<K|null> => {
  try{
    const response = await fetch(`${baseURL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      // mode: 'no-cors'
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

  export { APIget, APIpost };

//   {
//     "cpm_table": [
//         {"action": "A", "actions_before": "", "duration": 5},
//         {"action": "B", "actions_before": "", "duration": 7},
//         {"action": "C", "actions_before": "A", "duration": 6},
//         {"action": "D", "actions_before": "A", "duration": 8},
//         {"action": "E", "actions_before": "B", "duration": 3},
//         {"action": "F", "actions_before": "C", "duration": 4},
//         {"action": "G", "actions_before": "C", "duration": 2},
//         {"action": "H", "actions_before": "EDF", "duration": 5}

//     ]
// }