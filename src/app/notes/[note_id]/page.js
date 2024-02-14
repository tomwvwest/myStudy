"use client";
import { useEffect, useState } from "react";

export default function NotePage({ params }) {
  const note_id = params.note_id;
  const [currentNote, setCurrentNote] = useState({});
  const [titleInput, setTitleInput] = useState("");
  const [updateTitleVisible, setUpdateTitleVisible] = useState(false)

  useEffect(() => {
    fetch(`/api/notes/${note_id}`)
      .then((data) => data.json())
      .then(({ note }) => {
        setCurrentNote(note);
        setTitleInput(note.note_name);
      });
  }, []);

  const handleChange = (e) => {
    setUpdateTitleVisible(true)
    setTitleInput(e.target.value);
  };

  const handleUpdateTitle = async () => {
    setUpdateTitleVisible(false)
    await fetch(`/api/notes/${note_id}`, {
      method: 'PATCH',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        note_name : titleInput
      })
    })
  }
  
  const handleUndoTitle = () => {
    setTitleInput(currentNote.note_name)
    setUpdateTitleVisible(false)
  }

  return (
    <section>
      <div className=" flex flex-col mb-4">
        <input
          value={titleInput}
          type="text"
          className="focus:outline-none  text-4xl font-semibold mb-2 w-[80%]"
          onChange={handleChange}
          key={currentNote.note_id}
        ></input>
        <div className="grid grid-cols-2 w-fit gap-2">
        <button className={`ml-1 w-fit px-1 py-[1px] text-sm bg-blue text-white rounded transition duration-200 ${updateTitleVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleUpdateTitle}>Update</button>
        <button className={`ml-1 w-fit px-1 py-[1px] text-sm bg-red text-white rounded transition duration-200 ${updateTitleVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleUndoTitle}>Undo</button>
        </div>
      </div>

      <p>{currentNote.contents}</p>
    </section>
  );
}
