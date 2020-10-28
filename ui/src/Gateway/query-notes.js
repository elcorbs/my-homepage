import { getToken, isLoggedIn } from "../Utilities/helper-functions";

export async function getNotes() {
  const schema = `query {notes{ title }}`;
  const response = await queryApi(schema);
  return response.notes;
}

export async function getNote(title){
  const schema = `query {note(title: "${title}"){text}}`;
  const response = await queryApi(schema);
  return response.note.text;
}
export async function deleteNote(title){
  const deleteSchema = `mutation {removeNote(title: "${title}")}`;
  const response = await queryApi(deleteSchema);
  return response.removeNote;
}

export async function saveNote(title, note) {
  const schema = `mutation {saveNote(title: "${title}" ,notes: """${note}""")}`
  return await queryApi(schema);
}

async function queryApi(query) {
  const apiUrl = process.env.REACT_APP_API_URL;

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
