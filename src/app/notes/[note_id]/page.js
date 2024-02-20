"use client";
import { LoadingSkeleton } from "@/app/components/general/LoadingSkeleton";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useRef, useState } from "react";

export default function NotePage({ params }) {
  const note_id = params.note_id;
  const [currentNote, setCurrentNote] = useState({});
  const [titleInput, setTitleInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const textAreaRef = useRef(null);
  const debouncedContent = useDebounce(textInput, 500);
  const debouncedTitle = useDebounce(titleInput, 500);

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
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  const handleTitleChange = (e) => {
    setTitleInput(e.target.value);
  };

  const handleTextChange = async (e) => {
    setTextInput(e.target.value);
  };

  const patchTitle = () => {
    fetch(`/api/notes/${note_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        note_name: titleInput,
      }),
    });
  };

  const patchText = (contents) => {
    fetch(`/api/notes/${note_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
      }),
    }).then((res) => {
      console.log(res.json());
    });
  };

  useEffect(() => {
    if (debouncedContent) {
      patchText(debouncedContent);
    }
  }, [debouncedContent]);

  useEffect(() => {
    if (debouncedTitle) {
      patchTitle(debouncedTitle);
    }
  }, [debouncedTitle]);

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
      </div>

      <textarea
        ref={textAreaRef}
        className=" w-full flex focus:outline-none resize-none"
        style={{ height: "auto" }}
        value={textInput}
        id="contentsTextArea"
        placeholder="Start note here..."
        onChange={handleTextChange}
      ></textarea>
    </section>
  );
}
