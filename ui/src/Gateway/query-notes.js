import { getToken, isLoggedIn } from "../Utilities/helper-functions";

export async function getNotes(callback) {
  const schema = `query {notes}`;
  await queryApi(schema, data => callback(data.notes))
}

export async function editNotes(notes, callback){
  const schema = `mutation {saveNotes(notes: "${notes}")}` 
  await queryApi(schema, data => callback(data && data.saveNotes))
}

async function queryApi(query, callback) {
  const apiUrl = "https://6lac5t2w1i.execute-api.eu-west-2.amazonaws.com/production/query"

  let url = new URL(apiUrl);
  const request = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    },
    body: query
  }
  if(isLoggedIn()) request.headers['Authorization'] = `Bearer ${getToken()}`;

  const response = await fetch(url, request);
  const data = await response.json();

  callback(data.data);
}
