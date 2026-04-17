import { createContext, useContext, useState } from 'react';
import { tickets as initialTickets, users, notifications as initialNotifications, currentUser } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [tickets, setTickets] = useState(initialTickets);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [user] = useState(currentUser);

  function addTicket(ticket) {
    setTickets(prev => [ticket, ...prev]);
  }

  function updateTicket(id, updates) {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }

  function addMessage(ticketId, message) {
    setTickets(prev => prev.map(t =>
      t.id === ticketId
        ? { ...t, messages: [...t.messages, { ...message, id: t.messages.length + 1, createdAt: new Date().toISOString() }] }
        : t
    ));
  }

  function markNotificationRead(id) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{ tickets, users, notifications, user, unreadCount, addTicket, updateTicket, addMessage, markNotificationRead, markAllRead }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
