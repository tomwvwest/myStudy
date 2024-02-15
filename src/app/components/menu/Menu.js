"use client";
import { useEffect, useState } from "react";
import { useUserContext } from "../../contexts/userContext";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const Menu = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUserContext();
  const [notes, setNotes] = useState([]);
  const [currentNoteId, setCurrentNoteId] = useState("");

  useEffect(() => {
    fetch(`/api/notes/users/${user.user_id}`)
      .then((data) => {
        return data.json();
      })
      .then(({ notes }) => {
        const sortedNotes = notes.sort((a, b) => {
          return a.note_id - b.note_id;
        });
        setNotes(sortedNotes);
      });
  }, [handleNewPage, handleDeletePage]);

  useEffect(() => {
    const isHomeRegex = /^\/$/;
    const typeRegex = /^\/([^/]+)\//;
    const typeIdRegex = /^\/[^/]+\/(\d+)/;
    if (typeRegex.test(pathname)) {
      const type = pathname.match(typeRegex)[1];
      if (type === "notes") {
        const id = pathname.match(typeIdRegex)[1];
        setCurrentNoteId(id);
      }
    } else if (isHomeRegex.test(pathname)) {
      setCurrentNoteId("home");
    }
  }, [pathname]);

  function handleNewPage() {
    fetch(`/api/notes/users/${user.user_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        note_name: "New Note",
      }),
    })
      .then((data) => {
        return data.json();
      })
      .then(({ postedNote }) => {
        router.push(`/notes/${postedNote.note_id}`);
      });
  }

  function handleDeletePage(e) {
    e.stopPropagation();
    const id = e.target.id;
    fetch(`/api/notes/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }).then(() => {
      router.push(`/`);
    });
  }

  return (
    <section className=" fixed h-screen w-56 flex items-center justify-end pr-1 ">
      <div className="text-white w-[90%] h-[95%] rounded-xl py-3 bg-cambridge relative">
        <ul className=" w-full mb-3">
          <li className="font-bold px-4 py-1">
            Welcome <span className="italic">{user.username}</span>
          </li>
          <Link href="/">
            <li
              className={`px-4 py-[2px] hover:bg-white ${
                currentNoteId === "home"
                  ? "bg-white bg-opacity-20 hover:bg-opacity-40"
                  : "hover:bg-opacity-20"
              }`}
            >
              Home
            </li>
          </Link>
          <li className="px-4 py-[2px] hover:bg-white hover:bg-opacity-20">
            Search
          </li>
          <li className="px-4 py-[2px] hover:bg-white hover:bg-opacity-20">
            Settings
          </li>
        </ul>
        <ul className=" w-full mb-3">
          <li className="font-bold px-4 py-1">Notes</li>
          {notes.map((note) => {
            return (
              <li
                className={`px-1 py-[2px] hover:bg-white relative flex items-center hover:cursor-pointer ${
                  note.note_id === parseInt(currentNoteId)
                    ? "bg-white bg-opacity-20 hover:bg-opacity-40"
                    : "hover:bg-opacity-20"
                }`}
                onClick={() => {
                  setCurrentNoteId(note.note_id);
                  router.push(`/notes/${note.note_id}`);
                }}
                key={note.note_id}
              >
                <img src="../navigate-right.png" className="invert"></img>
                <p
                  className={`${
                    note.note_id === parseInt(currentNoteId)
                      ? "font-bold"
                      : null
                  }`}
                >
                  {note.note_name}
                </p>
                <div
                  className="hover:cursor-pointer hover:bg-white hover:bg-opacity-20 rounded-full absolute right-3 p-[2px]"
                  onClick={handleDeletePage}
                >
                  <img
                    src="/delete.png"
                    className="invert w-5"
                    id={note.note_id}
                  ></img>
                </div>
              </li>
            );
          })}
          <li
            className="px-2 py-[2px] hover:bg-white hover:bg-opacity-20 flex items-center hover:cursor-pointer"
            onClick={handleNewPage}
          >
            <img src="../add.png" className="invert w-4 mr-1"></img>
            New Note
          </li>
        </ul>
        <ul className=" w-full">
          <li className="font-bold px-4 py-1">Flashcards</li>
          <li>Flashcards1</li>
          <li>Flashcards2</li>
          <li>Flashcards3</li>
        </ul>
        <div className="flex items-center justify-end absolute bottom-0 right-0 pr-2">
          <p className="">myStudy</p>
          <img src="../graduation-cap.png" className="invert w-12"></img>
        </div>
      </div>
    </section>
  );
};
