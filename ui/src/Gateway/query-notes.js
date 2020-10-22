import { getToken, isLoggedIn } from "../Utilities/helper-functions";

export async function getNotes() {
  const schema = `query {notes}`;
  const response = await queryApi(schema);
  return response.notes;
}

export async function editNotes(notes) {
  const schema = `mutation {saveNotes(notes: """${notes}""")}`
  return await queryApi(schema);
}

async function queryApi(query) {
  const apiUrl = "https://6lac5t2w1i.execute-api.eu-west-2.amazonaws.com/production/query"

  let url = new URL(apiUrl);
  const request = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    },
    body: query
  }
  if (isLoggedIn()) request.headers['Authorization'] = `Bearer ${getToken()}`;

  const response = await fetch(url, request);
  const data = await response.json();

  return data.data;
}
