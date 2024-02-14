"use client";
import { useEffect, useState } from "react";
import { useUserContext } from "../../contexts/userContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

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
  }, [handleNewPage]);

  useEffect(() => {
    const typeRegex = /^\/([^/]+)\//;
    const typeIdRegex = /^\/[^/]+\/(\d+)/;
    const type = pathname.match(typeRegex)[1];
    if (type === "notes") {
      const id = pathname.match(typeIdRegex)[1];
      setCurrentNoteId(id);
    }
  }, [pathname]);

  function handleNewPage (){
    fetch(`/api/notes/users/${user.user_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        note_name: "New Note",
      }),
    }).then((data) => {
      return data.json()
    }).then(({postedNote}) => {
      router.push(`/notes/${postedNote.note_id}`);
    });
  };

  return (
    <section className=" fixed h-screen w-56 flex items-center justify-end pr-1 ">
      <div className="text-white w-[90%] h-[95%] rounded-xl py-3 bg-cambridge relative">
        <ul className=" w-full mb-3">
          <li className="font-bold px-4 py-1">
            Welcome <span className="italic">{user.username}</span>
          </li>
          <li className="px-4 py-[2px] hover:bg-white hover:bg-opacity-20">
            Home
          </li>
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
              <Link href={`/notes/${note.note_id}`} key={note.note_id}>
                <li
                  className={`px-1 py-[2px] hover:bg-white flex items-center hover:cursor-pointer ${
                    note.note_id === parseInt(currentNoteId)
                      ? "bg-white bg-opacity-20 hover:bg-opacity-40"
                      : "hover:bg-opacity-20"
                  }`}
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
                </li>
              </Link>
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
