"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: number;
}

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/contact");
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("[v0] Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages(messages.filter(m => m.id !== id));
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error("[v0] Error deleting message:", err);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString() + " " + new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contact Messages</h1>
        <p className="text-muted-foreground mt-2">
          Total messages: {messages.length}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 border border-border rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-4 text-muted-foreground">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="p-4 text-muted-foreground">No messages</div>
          ) : (
            <div className="divide-y divide-border max-h-96 overflow-y-auto">
              {messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`w-full text-left p-4 hover:bg-muted transition-colors ${
                    selectedMessage?.id === msg.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="font-medium text-sm truncate">{msg.subject}</div>
                  <div className="text-xs text-muted-foreground truncate">{msg.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(msg.createdAt)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message Details */}
        <div className="lg:col-span-2 border border-border rounded-lg p-6">
          {selectedMessage ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold">{selectedMessage.subject}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  From: {selectedMessage.name} ({selectedMessage.email})
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(selectedMessage.createdAt)}
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="whitespace-pre-wrap text-sm">{selectedMessage.message}</p>
              </div>

              <div className="flex gap-2">
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="text-blue-500 hover:underline text-sm"
                >
                  Reply via Email
                </a>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="text-red-500 hover:underline text-sm ml-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              Select a message to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
