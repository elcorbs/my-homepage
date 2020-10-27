import React from "react";
import { useState, useEffect } from "react";
import "./notes.scss";
import { getNotes, editNote } from "./../Gateway/query-notes";
import { Converter } from "showdown";
import xss from "xss";
import PageLayout from "./PageLayout";

export default function Notes() {
  const [saveError, toggleSaveError] = useState(false);
  const [notes, setNotes] = useState([{title: 'Untitled Note', text: '' }]);

  useEffect(() => {
    const getAndSetNotes = async () => {
      const notes = await getNotes();
      setNotes(notes)
    }
    getAndSetNotes();
  });

  const save = async (title, note) => {
    const lines = note.split('\n');
    lines.splice(0, 1);

    const response = await editNote(title, lines.join('\n'));
    if (!response) toggleSaveError(true);
  }
  console.log(notes)

  return (
    <PageLayout path={["notes"]} sideBarContent={null} >
      <div style={{ flex: '4 1 auto' }}>
        <Editor initalText={notes[0].text} save={(note) => save('Emmas Notes', note)} onFocus={() => toggleSaveError(false)} />
        <ErrorMark error={saveError} />
      </div>
    </PageLayout>
  )
}

function Editor({ initialText, save, onFocus }) {
  const [blurred, setBlurred] = useState(true);
  const [text, setText] = useState(initialText);


  const onBlur = (event) => {
    save(xss(event.target.value))
    setBlurred(true);
  }

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
