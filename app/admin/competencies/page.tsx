"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, ListChecks, Pencil, X, Check } from "lucide-react";

export default function CompetenciesPage() {
    const [items, setItems] = useState<any[]>([]);
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await axios.get("/api/admin/competencies");
            setItems(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const addItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;

        setAdding(true);
        try {
            const res = await axios.post("/api/admin/competencies", {
                name: newName,
                description: newDescription
            });
            if (res.data.success) {
                setItems([...items, res.data]);
                setNewName("");
                setNewDescription("");
                setShowForm(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setAdding(false);
        }
    };

    const deleteItem = async (id: string) => {
        if (!confirm("Delete this competency?")) return;
        try {
            await axios.delete(`/api/admin/competencies?id=${id}`);
            setItems(items.filter(i => i.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                        <ListChecks className="text-primary" /> Competencies
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                        Manage additional skills and methodologies.
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition"
                >
                    {showForm ? <X size={18} /> : <Plus size={18} />}
                    {showForm ? 'Cancel' : 'Add New'}
                </button>
            </div>

            {/* Add Form */}
            {showForm && (
                <div className="bg-card border border-border/50 rounded-xl p-4 md:p-6 shadow-sm">
                    <form onSubmit={addItem} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Title</label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="e.g. 'Methodologies'"
                                    className="w-full px-4 py-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Description</label>
                                <input
                                    type="text"
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                    placeholder="e.g. 'Agile, Scrum, TDD...'"
                                    className="w-full px-4 py-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={adding || !newName.trim()}
                                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition disabled:opacity-50"
                            >
                                <Check size={18} /> Save
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Items List */}
            <div className="bg-card border border-border/50 rounded-xl shadow-sm overflow-hidden">
                <div className="divide-y divide-border/50">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between p-4 group hover:bg-muted/30 transition"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold">{item.name}</div>
                                <div className="text-sm text-muted-foreground truncate">{item.description}</div>
                            </div>
                            <button
                                onClick={() => deleteItem(item.id)}
                                className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition ml-2 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                title="Delete"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <ListChecks className="mx-auto mb-3 opacity-50" size={32} />
                            No competencies added yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
