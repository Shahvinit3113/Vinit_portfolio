"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Mail, Check, Trash2, Calendar, User, Eye, EyeOff, Maximize2, X } from "lucide-react";

export default function MessagesPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await axios.get("/api/admin/messages");
            setMessages(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string, isRead: boolean) => {
        try {
            await axios.put("/api/admin/messages", { id, is_read: isRead });
            setMessages(messages.map(m => m.id === id ? { ...m, is_read: isRead ? 1 : 0 } : m));
        } catch (error) {
            console.error(error);
        }
    };

    const deleteMessage = async (id: string) => {
        if (!confirm("Are you sure you want to delete this message?")) return;
        try {
            await axios.delete(`/api/admin/messages?id=${id}`);
            setMessages(messages.filter(m => m.id !== id));
            if (selectedMessage?.id === id) setSelectedMessage(null);
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return <div className="p-8">Loading messages...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold">Inbox</h2>
                <p className="text-muted-foreground text-sm mt-1">
                    You have {messages.filter(m => !m.is_read).length} unread messages.
                </p>
            </div>

            {/* Mobile: Card Layout */}
            <div className="md:hidden space-y-3">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`p-4 rounded-xl border transition ${msg.is_read ? 'bg-card border-border/50' : 'bg-primary/5 border-primary/20'}`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    {!msg.is_read && (
                                        <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                                    )}
                                    <span className="font-semibold truncate">{msg.name}</span>
                                </div>
                                <a href={`mailto:${msg.email}`} className="text-primary text-xs hover:underline block truncate">
                                    {msg.email}
                                </a>
                            </div>
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                                {new Date(msg.created_on).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{msg.message}</p>
                        <div className="flex items-center gap-2 mt-3">
                            <button
                                onClick={() => setSelectedMessage(msg)}
                                className="flex-1 py-2 px-3 text-xs font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition"
                            >
                                View
                            </button>
                            <button
                                onClick={() => markAsRead(msg.id, !msg.is_read)}
                                className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition"
                            >
                                {msg.is_read ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                            <button
                                onClick={() => deleteMessage(msg.id)}
                                className="p-2 rounded-lg text-red-500 bg-red-500/10 hover:bg-red-500/20 transition"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
                {messages.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <Mail className="mx-auto mb-3 opacity-50" size={32} />
                        No messages found.
                    </div>
                )}
            </div>

            {/* Desktop: Table Layout */}
            <div className="hidden md:block bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border/50">
                            <tr>
                                <th className="px-6 py-4 w-[120px]">Date</th>
                                <th className="px-6 py-4 w-[200px]">Sender</th>
                                <th className="px-6 py-4">Message</th>
                                <th className="px-6 py-4 w-[100px] text-center">Status</th>
                                <th className="px-6 py-4 w-[100px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {messages.map((msg) => (
                                <tr
                                    key={msg.id}
                                    className={`group transition-colors ${msg.is_read ? 'bg-background hover:bg-muted/30' : 'bg-primary/5 hover:bg-primary/10'}`}
                                >
                                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="opacity-70" />
                                            {new Date(msg.created_on).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-foreground">{msg.name}</div>
                                        <a href={`mailto:${msg.email}`} className="text-primary hover:underline text-xs">
                                            {msg.email}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`max-w-xl line-clamp-1 ${!msg.is_read ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                                            {msg.message}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {msg.is_read ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border">
                                                Read
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/20">
                                                New
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setSelectedMessage(msg)}
                                                className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-500 transition"
                                                title="View Full Message"
                                            >
                                                <Maximize2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => markAsRead(msg.id, !msg.is_read)}
                                                className={`p-2 rounded-lg transition ${msg.is_read
                                                    ? 'hover:bg-muted text-muted-foreground'
                                                    : 'hover:bg-primary/20 text-primary'
                                                    }`}
                                                title={msg.is_read ? "Mark as Unread" : "Mark as Read"}
                                            >
                                                {msg.is_read ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                            <button
                                                onClick={() => deleteMessage(msg.id)}
                                                className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {messages.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground">
                                        <Mail className="mx-auto mb-3 opacity-50" size={32} />
                                        No messages found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Message Detail Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-card w-full max-w-2xl rounded-xl shadow-2xl border border-border/50 flex flex-col max-h-[90vh]">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border/50">
                            <div>
                                <h3 className="text-lg md:text-xl font-bold">Message Details</h3>
                                <div className="flex items-center gap-2 text-muted-foreground text-xs md:text-sm mt-1">
                                    <Calendar size={14} />
                                    {new Date(selectedMessage.created_on).toLocaleString()}
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="p-2 hover:bg-muted rounded-lg transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-4 md:space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1 block">Sender Name</label>
                                    <div className="font-medium text-base md:text-lg">{selectedMessage.name}</div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1 block">Sender Email</label>
                                    <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:underline font-medium text-base md:text-lg break-all">
                                        {selectedMessage.email}
                                    </a>
                                </div>
                            </div>

                            <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                                <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2 block">Message Content</label>
                                <p className="whitespace-pre-wrap leading-relaxed text-foreground text-sm md:text-base">
                                    {selectedMessage.message}
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-border/50 bg-muted/20 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 rounded-b-xl">
                            <button
                                onClick={() => {
                                    markAsRead(selectedMessage.id, !selectedMessage.is_read);
                                    setSelectedMessage({ ...selectedMessage, is_read: !selectedMessage.is_read });
                                }}
                                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border/50 hover:bg-background transition text-sm font-medium"
                            >
                                {selectedMessage.is_read ? (
                                    <>
                                        <EyeOff size={16} /> Mark as Unread
                                    </>
                                ) : (
                                    <>
                                        <Eye size={16} /> Mark as Read
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    deleteMessage(selectedMessage.id);
                                    setSelectedMessage(null);
                                }}
                                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition text-sm font-medium"
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition text-sm font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
