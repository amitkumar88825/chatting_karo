import { useState, useCallback } from "react";
import api from "../../utils/api";

export const useMessages = (selectedFriend) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!selectedFriend?._id) return;
    setLoading(true);
    try {
      const res = await api.get(`/messages/${selectedFriend._id}`);

      setMessages(res.data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [selectedFriend]);

  const addMessage = useCallback((newMessage) => {
    setMessages((prev) => {
      const exists = prev.some((msg) => msg._id === newMessage._id);
      return exists ? prev : [...prev, newMessage];
    });
  }, []);

  return { messages, loading, fetchMessages, addMessage };
};