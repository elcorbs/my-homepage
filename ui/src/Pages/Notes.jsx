import React from "react";
import { useState, useEffect } from "react";
import BreadcrumbNavigator from "./../Components/BreadcrumbNavigator";
import "./notes.scss";
import { getNotes, editNotes } from "./../Gateway/query-notes";
import { Converter } from "showdown";

export default function Notes() {
  const [saveError, toggleSaveError] = useState(false);

  const save = async (notes) => {
    const response = await editNotes(notes);
    if (!response) toggleSaveError(true);
  }

  return (
    <div>
      <div className="breadcrumb-container">
        <BreadcrumbNavigator path={["notes"]} />
      </div>
      <div>
        <Editor getInitalText={getNotes} save={save} onFocus={() => toggleSaveError(false)} />
      </div>
      <ErrorMark error={saveError} />
    </div>
  )
}

function Editor({ getInitalText, save, onFocus }) {
  const [blurred, setBlurred] = useState(true);
  const [text, setText] = useState('');

  useEffect(() => {
    const getText = async () => {
      const notes = await getInitalText();
      setText(notes)
    }
    getText();
  }, [getInitalText])

  const onBlur = (event) => {
    save(event.target.value)
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
    return convertor.makeHtml(text);
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
          rows={numberOfLines + 5}
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
