import React from "react";
import { useState, useEffect } from "react";
import BreadcrumbNavigator from "./../Components/BreadcrumbNavigator";
import "./notes.scss";
import { getNotes, editNotes } from "./../Gateway/query-notes";

export default function Notes() {
  const [notes, setNotes] = useState(null);
  const [error, setError] = useState(false);
  const [blurred, setBlurred] = useState(true);

  useEffect(() => {
    getNotes(setNotes)
  }, [])

  const saveAndFormat = (event) => {
    editNotes(event.target.value, res => !res ? setError(true) : null);
    setBlurred(true);
  }

  const formatText = (text) => {
    if (!text) return "";
    return text.split('***').map((x, index) => (index % 2 == 0) ? x : `<h1>${x}</h1>`).join('');
  }


  return (
    <div>
      <div className="breadcrumb-container">
        <BreadcrumbNavigator path={["notes"]} />
      </div>
      <ErrorMark error={error} />
      <div>
        <div dangerouslySetInnerHTML={{ __html: blurred ? formatText(notes) : null }} />
        <div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="notes-input"
          onBlur={saveAndFormat}
          onFocus={() => { setError(false); setBlurred(false); }}
        />          
        </div>        
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
