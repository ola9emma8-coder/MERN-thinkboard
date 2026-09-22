import react from "react";
import Navbar from "../components/Navbar.jsx";
import RateLimitedUI from "../components/RateLimitedUI.jsx";
import axios from "axios";
import  toast  from "react-hot-toast"
import NoteCard from "../components/NoteCard.jsx";
import NotesNotFound from "../components/NotesNotFound.jsx";

export default function HomePage(){
    const [isRateLimited, setIsRateLimited] = react.useState(true);
    const [notes, setNotes] = react.useState([]);
    const [loading, setLoading] = react.useState(true);

    react.useEffect(() => {
        const fetchNotes = async () => {
            try{
             const res =  await axios.get("https://thinkboard-backend.onrender.com/api/notes");
             console.log(res.data)
             setNotes(res.data)
             setIsRateLimited(false)
            } catch(error){
              console.log("Error fetching notes")
              console.log(error);
              if(error.response?.status === 429){
                setIsRateLimited(true)
              } else{
                toast.error("Failed to load notes")
              }
            } finally{
                setLoading(false);
            }
        }

        fetchNotes();
    }, [])
    return(
        <div className="min-h-screen">
            <Navbar />
            {isRateLimited && <RateLimitedUI />}

            <div className="max-w-7xl mx-auto p-4 mt-6">
                {loading && <div className="text-center text-primary py-10">Loading notes .</div>}

                {notes.length === 0 && !isRateLimited && <NotesNotFound />}

                {notes.length > 0 && !isRateLimited && (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map(note => (
                        <NoteCard key={note._id} note={note} setNotes={setNotes} />
                    ))}
                    </div>
                )}
            </div>
        </div>
    )
}