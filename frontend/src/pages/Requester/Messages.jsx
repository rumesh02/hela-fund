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
  const [showChat, setShowChat] = useState(false);

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

  useEffect(() => {
    if (!user?.token) return;

    const socket = connectSocket(user.token);

    const handleNewMessage = (message) => {
      const senderId = message.sender._id.toString();
      const recipientId = message.recipient._id.toString();
      const myId = user.id.toString();
      const otherUserId = senderId === myId ? recipientId : senderId;

      if (selectedUserIdRef.current === otherUserId) {
        setMessages((prev) => [...prev, message]);
        if (senderId !== myId) {
          api.put(`/messages/conversation/${senderId}/read`).catch(() => {});
        }
      }

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

      setConversations((prev) => {
        const myId = user.id.toString();
        const updated = prev.map((c) =>
          c._id === selectedUserId
            ? { ...c, lastMessage: { content, createdAt: newMsg.createdAt, sender: myId, isRead: true } }
            : c
        );
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
    return name.includes(searchQuery.toLowerCase());
  });

  const isMyMessage = (msg) => msg.sender._id?.toString() === user.id?.toString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* Page Header */}
      <div className="bg-white border-l-4 border-blue-600 rounded-xl shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-1">Chat with supporters about your requests</p>
      </div>

      {/* Chat Interface */}
      <div
        className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        style={{ height: 'calc(100vh - 280px)' }}
      >
        <div className="flex h-full">
          {/* ── Conversations List ── */}
          <div
            className={`w-full md:w-80 border-r border-gray-200 flex flex-col ${
              showChat ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Search */}
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                    Supporters will reach out when they want to help
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
                    className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-blue-50 transition-all ${
                      isSelected ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-l-blue-600' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-sm shadow">
                        {getInitials(name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-gray-900 truncate text-sm">{name}</span>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                            {formatTime(conv.lastMessage?.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-blue-600 font-semibold mb-0.5">Supporter</p>
                        <p className="text-sm text-gray-700 truncate">
                          {isMe ? 'You: ' : ''}
                          {conv.lastMessage?.content || 'No messages yet'}
                        </p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white text-xs rounded-full flex items-center justify-center font-bold shadow">
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
          <div className={`flex-col flex-1 ${showChat ? 'flex' : 'hidden md:flex'}`}>
            {selectedUserId && selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b-2 border-gray-100 flex items-center gap-3 bg-gradient-to-r from-white to-blue-50">
                  <button
                    onClick={() => setShowChat(false)}
                    className="md:hidden p-1 text-gray-500 hover:text-gray-700"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-sm shadow flex-shrink-0">
                    {getInitials(getUserName(selectedUser))}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm leading-tight">
                      {getUserName(selectedUser)}
                    </p>
                    <p className="text-xs text-blue-600 font-semibold">Supporter</p>
                  </div>
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    title="Refresh messages"
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-40"
                  >
                    <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                  </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-br from-gray-50 to-blue-50">
                  {msgLoading && (
                    <div className="text-center text-gray-400 text-sm py-8">Loading messages...</div>
                  )}

                  {!msgLoading && messages.length === 0 && (
                    <div className="text-center py-12">
                      <MessageSquare className="mx-auto mb-3 text-gray-300" size={36} />
                      <p className="text-gray-500 text-sm">No messages yet</p>
                      <p className="text-gray-400 text-xs mt-1">Start the conversation below</p>
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
                          <div className={`max-w-xs lg:max-w-md ${mine ? 'order-2' : 'order-1'}`}>
                            <div
                              className={`rounded-2xl px-5 py-3 shadow-sm text-sm ${
                                mine
                                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-sm'
                                  : 'bg-white text-gray-900 rounded-bl-sm border border-gray-100'
                              }`}
                            >
                              <p className="font-medium leading-relaxed">{msg.content}</p>
                            </div>
                            <p
                              className={`text-xs text-gray-500 mt-1 font-medium ${
                                mine ? 'text-right' : 'text-left'
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
                <div className="p-4 border-t-2 border-gray-100 bg-white">
                  <div className="flex items-center gap-3">
                    <input
                      ref={inputRef}
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message..."
                      className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-sm"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!messageInput.trim() || sending}
                      className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="text-center">
                  <MessageSquare className="mx-auto mb-4 text-gray-300" size={52} />
                  <h3 className="text-lg font-bold text-gray-700 mb-1">Your Messages</h3>
                  <p className="text-gray-400 text-sm">Select a conversation to read and reply</p>
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
