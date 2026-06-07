import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Search, MessageSquare, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { connectSocket } from '../../utils/socket';

const getUserName = (user) => user?.name || user?.fullName || user?.email || 'Unknown';

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const Messages = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [conversations, setConversations] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showChat, setShowChat] = useState(false); // mobile toggle

  const messagesEndRef = useRef(null);
  const selectedUserIdRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    selectedUserIdRef.current = selectedUserId;
  }, [selectedUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await api.get('/messages/conversations');
      setConversations(res.data || []);
      return res.data || [];
    } catch (err) {
      console.error('Error fetching conversations:', err);
      return [];
    }
  }, []);

  const openConversation = useCallback(async (userId, userInfo) => {
    setSelectedUserId(userId);
    setSelectedUser(userInfo);
    setShowChat(true);
    setMsgLoading(true);
    try {
      const res = await api.get(`/messages/conversation/${userId}`);
      setMessages(res.data || []);
      // Mark messages from this user as read
      await api.put(`/messages/conversation/${userId}/read`).catch(() => {});
      setConversations((prev) =>
        prev.map((c) => (c._id === userId ? { ...c, unreadCount: 0 } : c))
      );
    } catch (err) {
      console.error('Error fetching messages:', err);
      setMessages([]);
    } finally {
      setMsgLoading(false);
    }
  }, []);

  // Load conversations on mount, then handle navigation state
  useEffect(() => {
    const init = async () => {
      const convs = await fetchConversations();
      setLoading(false);

      const navState = location.state;
      if (navState?.userId) {
        const existing = convs.find((c) => c._id === navState.userId);
        if (existing) {
          openConversation(existing._id, existing.user);
        } else {
          // New conversation - user info comes from navigation state
          const userInfo = {
            _id: navState.userId,
            name: navState.userName || 'User',
            avatar: navState.userAvatar || null,
          };
          openConversation(navState.userId, userInfo);
        }
      }
    };
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Socket.io: listen for incoming messages
  useEffect(() => {
    if (!user?.token) return;

    const socket = connectSocket(user.token);

    const handleNewMessage = (message) => {
      const senderId = message.sender._id.toString();
      const recipientId = message.recipient._id.toString();
      const myId = user.id.toString();
      const otherUserId = senderId === myId ? recipientId : senderId;

      // Append to current chat if it's the open conversation
      if (selectedUserIdRef.current === otherUserId) {
        setMessages((prev) => [...prev, message]);
        // Auto-mark as read since we're viewing this conversation
        if (senderId !== myId) {
          api.put(`/messages/conversation/${senderId}/read`).catch(() => {});
        }
      }

      // Refresh conversation list to update last message + unread badge
      fetchConversations();
    };

    socket.on('new_message', handleNewMessage);
    return () => socket.off('new_message', handleNewMessage);
  }, [user?.token, fetchConversations]);

  const handleSend = async () => {
    if (!messageInput.trim() || !selectedUserId || sending) return;

    const content = messageInput.trim();
    setSending(true);
    setMessageInput('');

    try {
      const res = await api.post('/messages', { recipient: selectedUserId, content });
      const newMsg = res.data;
      setMessages((prev) => [...prev, newMsg]);

      // Optimistically update conversation list
      setConversations((prev) => {
        const myId = user.id.toString();
        const updated = prev.map((c) =>
          c._id === selectedUserId
            ? { ...c, lastMessage: { content, createdAt: newMsg.createdAt, sender: myId, isRead: true } }
            : c
        );
        // If this is a brand-new conversation, re-fetch to get it added
        if (!updated.find((c) => c._id === selectedUserId)) {
          fetchConversations();
          return prev;
        }
        return updated.sort(
          (a, b) => new Date(b.lastMessage?.createdAt) - new Date(a.lastMessage?.createdAt)
        );
      });
    } catch (err) {
      console.error('Error sending message:', err);
      // Restore input on failure
      setMessageInput(content);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await fetchConversations();
      if (selectedUserId) {
        const res = await api.get(`/messages/conversation/${selectedUserId}`);
        setMessages(res.data || []);
      }
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const filteredConversations = conversations.filter((c) => {
    const name = getUserName(c.user).toLowerCase();
    const q = searchQuery.toLowerCase();
    return name.includes(q);
  });

  const isMyMessage = (msg) => msg.sender._id?.toString() === user.id?.toString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 p-6">
      {/* Page Header */}
      <div className="bg-white border-l-4 border-teal-600 rounded-xl shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-1">Communicate with requesters you're helping</p>
      </div>

      {/* Chat Interface */}
      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        style={{ height: 'calc(100vh - 250px)' }}
      >
        <div className="flex h-full">
          {/* ── Conversations List ── */}
          <div
            className={`w-full md:w-1/3 border-r border-gray-200 flex flex-col ${
              showChat ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {loading && (
                <div className="p-6 text-center text-gray-500 text-sm">Loading...</div>
              )}

              {!loading && filteredConversations.length === 0 && (
                <div className="p-6 text-center">
                  <MessageSquare className="mx-auto mb-3 text-gray-300" size={40} />
                  <p className="text-gray-500 text-sm">No conversations yet</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Click the message icon on a request to start chatting
                  </p>
                </div>
              )}

              {filteredConversations.map((conv) => {
                const name = getUserName(conv.user);
                const isSelected = selectedUserId === conv._id;
                const isMe = conv.lastMessage?.sender?.toString() === user.id?.toString();

                return (
                  <div
                    key={conv._id}
                    onClick={() => openConversation(conv._id, conv.user)}
                    className={`p-4 cursor-pointer transition-all border-b border-gray-100 hover:bg-teal-50 ${
                      isSelected ? 'bg-teal-50 border-l-4 border-l-teal-600' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <div className="flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold text-sm">
                        {getInitials(name)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-semibold text-gray-800 truncate text-sm">{name}</span>
                          <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                            {formatTime(conv.lastMessage?.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {isMe ? 'You: ' : ''}
                          {conv.lastMessage?.content || 'No messages yet'}
                        </p>
                      </div>

                      {conv.unreadCount > 0 && (
                        <div className="flex-shrink-0 w-5 h-5 bg-teal-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {conv.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Chat Panel ── */}
          <div
            className={`flex-col flex-1 ${showChat ? 'flex' : 'hidden md:flex'}`}
          >
            {selectedUserId && selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-gray-200 flex items-center space-x-3 bg-white">
                  <button
                    onClick={() => setShowChat(false)}
                    className="md:hidden p-1 text-gray-500 hover:text-gray-700"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {getInitials(getUserName(selectedUser))}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm leading-tight">
                      {getUserName(selectedUser)}
                    </p>
                    <p className="text-xs text-gray-400">{selectedUser.email || ''}</p>
                  </div>
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    title="Refresh messages"
                    className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition disabled:opacity-40"
                  >
                    <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                  </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {msgLoading && (
                    <div className="text-center text-gray-400 text-sm py-8">Loading messages...</div>
                  )}

                  {!msgLoading && messages.length === 0 && (
                    <div className="text-center py-12">
                      <MessageSquare className="mx-auto mb-3 text-gray-300" size={36} />
                      <p className="text-gray-500 text-sm">No messages yet</p>
                      <p className="text-gray-400 text-xs mt-1">Send a message to start the conversation</p>
                    </div>
                  )}

                  {!msgLoading &&
                    messages.map((msg) => {
                      const mine = isMyMessage(msg);
                      return (
                        <div
                          key={msg._id}
                          className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] px-4 py-2.5 rounded-2xl shadow-sm text-sm ${
                              mine
                                ? 'bg-teal-600 text-white rounded-br-sm'
                                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                            }`}
                          >
                            <p className="leading-relaxed">{msg.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                mine ? 'text-teal-100 text-right' : 'text-gray-400'
                              }`}
                            >
                              {formatTime(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex items-end space-x-2">
                    <textarea
                      ref={inputRef}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message..."
                      rows={2}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-sm"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!messageInput.trim() || sending}
                      className="p-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <MessageSquare className="mx-auto mb-4 text-gray-300" size={52} />
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">Your Messages</h3>
                  <p className="text-gray-400 text-sm">
                    Select a conversation or message a requester from Browse Requests
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
