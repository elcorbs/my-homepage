import React from "react";
import { useState, useEffect } from "react";
import "./notes.scss";
import { getNotes, saveNote, getNote, deleteNote } from "./../Gateway/query-notes";
import { Converter } from "showdown";
import xss from "xss";
import PageLayout from "./PageLayout";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { isLoggedIn } from "../Utilities/helper-functions";

export default function Notes({ history }) {
  const [noteTitles, setNotesTitles] = useState([]);

  useEffect(() => {
    const getAndSetNotes = async () => {
      const notes = await getNotes();
      const titles = notes.map(note => note.title);
      setNotesTitles(titles)
    }
    getAndSetNotes();
  }, [history.location]);

  const addNewNote = async () => {
    const response = await saveNote("Untitled Note", "");
    if (response) {
      history.push("/notes/Untitled%20Note")
    }
  }

  return (
    <PageLayout path={["notes"]} sideBarContent={<NoteTitleList titles={noteTitles} newNote={addNewNote} />} >
      <Switch>
        <Route exact path="/notes">
          {noteTitles[0] && <Redirect to={`/notes/${noteTitles[0]}`} />}
        </Route>
        <Route exact path="/notes/:title" component={(props) => <NoteContent {...props} />} />
      </Switch>
    </PageLayout>
  )
}

function NoteContent({ match, history }) {
  const title = match.params.title;
  const [saveError, toggleSaveError] = useState(false);

  const save = async (title, note) => {
    const lines = note.split('\n');
    const newTitle = lines.splice(0, 1)[0].replace('#', '').trim();
    const response = await saveNote(newTitle, lines.join('\n'));

    if (!response) toggleSaveError(true);
    if (title !== newTitle) {
      await deleteNote(title);
      history.push(`/notes/${newTitle}`)
    }
  }

  const get = async () => {
    const text = await getNote(title)
    return `#${title || ""}\n` + text;
  }

  return (
    <div style={{ flex: '4 1 auto' }}>
      <Editor getText={get} save={(note) => save(title, note)} onFocus={() => toggleSaveError(false)} />
      <ErrorMark error={saveError} />
    </div>
  )
}

function NoteTitleList({ titles, newNote }) {
  return (
    <div className="notes-title-container">
      <div style={{display: 'flex', justifyContent:'flex-end'}} >
        <Button onClick={newNote} style={{ backgroundColor: "transparent", marginRight: '10px' }} size="small" icon={<PlusOutlined />} />
      </div>
      {titles.map(title => {
        return <div key={title}> <Link to={`/notes/${title}`} className="note-title-button">{title}</Link></div>
      })}
    </div>
  )
}

function Editor({ getText, save, onFocus }) {
  const [blurred, setBlurred] = useState(true);
  const [text, setText] = useState("");

  const onBlur = (event) => {
    save(xss(event.target.value))
    setBlurred(true);
  }
  useEffect(() => {
    const getAndSetText = async () => {
      const text = await getText();
      setText(text)
    }
    getAndSetText();
  }, [getText]);

  const formatText = () => {
    if (!blurred && isLoggedIn()) return null;
    const convertor = new Converter({
      simpleLineBreaks: true,
      simplifiedAutoLink: true,
      strikethrough: true,
      tasklists: true,
      openLinksInNewWindow: true
    });
    const html = convertor.makeHtml(text);
    return html;
  }

  const numberOfLines = text ? text.split('\n').length : 0;

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: formatText() }} className="notes-formatted" />
      {isLoggedIn() && <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="notes-input"
          onBlur={onBlur}
          rows={numberOfLines + 3}
          onFocus={() => { onFocus(); setBlurred(false); }}
        />
      </div>}
    </div>
  )
}

function ErrorMark({ error }) {
  if (!error) return null;
  return (
    <div className="error-mark-container">
      <strong className="error-mark">!</strong>
    </div>
  )
}
