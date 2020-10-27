import React from "react";
import { useState, useEffect } from "react";
import "./notes.scss";
import { getNotes, editNote, getNote } from "./../Gateway/query-notes";
import { Converter } from "showdown";
import xss from "xss";
import PageLayout from "./PageLayout";

export default function Notes() {
  const [saveError, toggleSaveError] = useState(false);
  const [noteTitles, setNotesTitles] = useState(['Untitled Note']);
  useEffect(() => {
    const getAndSetNotes = async () => {
      const notes = await getNotes();
      const titles = notes.map(note => note.title);
      setNotesTitles(titles)
    }
    getAndSetNotes();
  }, []);

  const save = async (title, note) => {
    const lines = note.split('\n');
    lines.splice(0, 1);

    const response = await editNote(title, lines.join('\n'));
    if (!response) toggleSaveError(true);
  }

  return (
    <PageLayout path={["notes"]} sideBarContent={<NoteTitleList titles={noteTitles}/>} >
      <div style={{ flex: '4 1 auto' }}>
        <Editor getText={async () => await getNote('Emmas notes')} save={(note) => save('Emmas notes', note)} onFocus={() => toggleSaveError(false)} />
        <ErrorMark error={saveError} />
      </div>
    </PageLayout>
  )
}

function NoteTitleList({titles}) {
  return titles.map(title => {
    return <button key={title} className="note-title-button" >
      {title}
    </button>
  })
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
    const convertor = new Converter({
      simpleLineBreaks: true,
      simplifiedAutoLink: true,
      strikethrough: true,
      tasklists: true,
      openLinksInNewWindow: true
    });
    const html = convertor.makeHtml(text);
    return xss(html);
  }

  const numberOfLines = text ? text.split('\n').length : 0;

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: blurred ? formatText() : null }} className="notes-formatted" />
      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="notes-input"
          onBlur={onBlur}
          rows={numberOfLines + 3}
          onFocus={() => { onFocus(); setBlurred(false); }}
        />
      </div>
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
