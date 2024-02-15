"use client";
import { LoadingSkeleton } from "@/app/components/general/LoadingSkeleton";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useRef, useState } from "react";

export default function NotePage({ params }) {
  const note_id = params.note_id;
  const [currentNote, setCurrentNote] = useState({});
  const [titleInput, setTitleInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [updateTitleVisible, setUpdateTitleVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const textAreaRef = useRef(null);
  const debouncedContent = useDebounce(textInput, 1000);

  useEffect(() => {
    fetch(`/api/notes/${note_id}`)
      .then((data) => data.json())
      .then(({ note }) => {
        setCurrentNote(note);
        setTitleInput(note.note_name);
        setTextInput(note.contents);
        setIsLoading(false);
        adjustTextHeight();
      });
  }, []);

  useEffect(() => {
    adjustTextHeight();
  }, [textInput]);

  const adjustTextHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"; // Reset the height to auto
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Set the height to the scroll height
    }
  };

  const handleTitleChange = (e) => {
    setUpdateTitleVisible(true);
    setTitleInput(e.target.value);
  };

  const handleTextChange = async (e) => {
    setTextInput(e.target.value);
  };

  const handleUpdateTitle = async () => {
    setUpdateTitleVisible(false);
    await fetch(`/api/notes/${note_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        note_name: titleInput,
      }),
    });
  };

  const handleUndoTitle = () => {
    setTitleInput(currentNote.note_name);
    setUpdateTitleVisible(false);
  };

  const patchText = (contents) => {
    fetch(`/api/notes/${note_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents
      }),
    })
  };

  useEffect(() => {
    if(debouncedContent){
      patchText(debouncedContent)
    }
  }, [debouncedContent])

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <section>
      <div className=" flex flex-col mb-4">
        <input
          value={titleInput}
          type="text"
          className="focus:outline-none  text-4xl font-semibold mb-2 w-[80%]"
          onChange={handleTitleChange}
          key={currentNote.note_id}
        ></input>
        <div className="grid grid-cols-2 w-fit gap-2">
          <button
            className={`ml-1 w-fit px-1 py-[1px] text-sm bg-blue text-white rounded transition duration-200 ${
              updateTitleVisible ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleUpdateTitle}
            disabled={!updateTitleVisible}
          >
            Update
          </button>
          <button
            className={`ml-1 w-fit px-1 py-[1px] text-sm bg-red text-white rounded transition duration-200 ${
              updateTitleVisible ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleUndoTitle}
            disabled={!updateTitleVisible}
          >
            Undo
          </button>
        </div>
      </div>

      <textarea
        ref={textAreaRef}
        className=" w-full flex focus:outline-none resize-none"
        style={{ height: "auto" }}
        value={textInput}
        onChange={handleTextChange}
        id="contentsTextArea"
        placeholder="Start note here..."
      ></textarea>
    </section>
  );
}
