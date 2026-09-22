import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import axios from "axios";
import { LoaderIcon, Trash2Icon, ArrowLeftIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function NoteDetailPage() {
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/api/notes/${id}`);
                setNote(res.data);
            } catch (error) {
                console.log("Error in fetching note", error);
                toast.error("Failed to fetch the note");
            } finally {
                setLoading(false);
            }
        };
        fetchNote();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this note?")) return;

        try {
            await axios.delete(`http://localhost:5001/api/notes/${id}`);
            toast.success("Note deleted successfully");
            navigate("/");
        } catch (error) {
            console.log("Error deleting note", error);
            toast.error("Failed to delete note");
        }
    };

    const handleSave = async () => {
        if (!note.title.trim() || !note.content.trim()) {
            toast.error("All fields are required");
            return;
        }

        setSaving(true);

        try {
            await axios.put(`http://localhost:5001/api/notes/${id}`, {
                title: note.title,
                content: note.content,
            });
            toast.success("Note updated successfully");
            navigate("/");
        } catch (error) {
            console.log("Error saving note", error);
            toast.error("Failed to update note");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <LoaderIcon className="animate-spin size-10" />
            </div>
        );
    }

    if (!note) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <p>Note not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <Link to="/" className="btn btn-ghost">
                            <ArrowLeftIcon className="h-5 w-5" />
                            Back to Notes
                        </Link>
                        <button onClick={handleDelete} className="btn btn-error btn-outline">
                            <Trash2Icon className="w-5 h-5" />
                            Delete Note
                        </button>
                    </div>

                    <div className="card bg-base-100">
                        <div className="card-body">
                            <fieldset className="fieldset mb-4">
                                <legend className="fieldset-legend">Title</legend>
                                <input
                                    type="text"
                                    placeholder="Note title"
                                    className="input input-bordered w-full"
                                    value={note.title}
                                    onChange={(e) => setNote({ ...note, title: e.target.value })}
                                />
                            </fieldset>

                            <fieldset className="fieldset mb-4">
                                <legend className="fieldset-legend">Content</legend>
                                <textarea
                                    placeholder="Write your note here..."
                                    className="textarea textarea-bordered w-full h-32"
                                    value={note.content}
                                    onChange={(e) => setNote({ ...note, content: e.target.value })}
                                />
                            </fieldset>

                            <div className="card-actions justify-end">
                                <button
                                    className="btn btn-primary"
                                    disabled={saving}
                                    onClick={handleSave}
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}