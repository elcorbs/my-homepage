import React from "react";
import { useState, useEffect } from "react";
import "./notes.scss";
import { getNotes, editNotes } from "./../Gateway/query-notes";
import { Converter } from "showdown";
import xss from "xss";
import PageLayout from "./PageLayout";

export default function Notes() {
  const [saveError, toggleSaveError] = useState(false);

  const save = async (notes) => {
    const response = await editNotes(notes);
    if (!response) toggleSaveError(true);
  }

  return (
    <PageLayout path={["notes"]} sideBarContent={<div> Here is my notes list</div>} >
      <div style={{ flex: '4 1 auto' }}>
        <Editor getInitalText={getNotes} save={save} onFocus={() => toggleSaveError(false)} />
        <ErrorMark error={saveError} />
      </div>
    </PageLayout>
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
