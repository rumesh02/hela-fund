import { useState } from 'react';
import { Send, Search, MoreVertical, Paperclip, Smile } from 'lucide-react';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [messageInput, setMessageInput] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Supporter',
      lastMessage: 'I found your student ID near the library!',
      time: '2m ago',
      unread: 2,
      avatar: 'SJ',
      online: true,
    },
    {
      id: 2,
      name: 'Mike Chen',
      role: 'Supporter',
      lastMessage: 'I can help with the textbook funding.',
      time: '1h ago',
      unread: 0,
      avatar: 'MC',
      online: true,
    },
    {
      id: 3,
      name: 'Emily Davis',
      role: 'Supporter',
      lastMessage: 'When do you need the study materials?',
      time: '3h ago',
      unread: 1,
      avatar: 'ED',
      online: false,
    },
    {
      id: 4,
      name: 'David Wilson',
      role: 'Supporter',
      lastMessage: 'Thanks for your help!',
      time: '1d ago',
      unread: 0,
      avatar: 'DW',
      online: false,
    },
  ];

  const messages = [
    {
      id: 1,
      sender: 'Sarah Johnson',
      content: 'Hi! I saw your request about the lost student ID.',
      time: '10:30 AM',
      isMe: false,
    },
    {
      id: 2,
      sender: 'Me',
      content: 'Yes! Have you found it?',
      time: '10:32 AM',
      isMe: true,
    },
    {
      id: 3,
      sender: 'Sarah Johnson',
      content: 'I found your student ID near the library! I can meet you there to return it.',
      time: '10:35 AM',
      isMe: false,
    },
    {
      id: 4,
      sender: 'Me',
      content: 'That\'s amazing! Thank you so much! I can meet you at 2 PM today.',
      time: '10:36 AM',
      isMe: true,
    },
    {
      id: 5,
      sender: 'Sarah Johnson',
      content: 'Perfect! See you at the main entrance.',
      time: '10:38 AM',
      isMe: false,
    },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-white border-l-4 border-blue-600 rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-1">Chat with supporters about your requests.</p>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden" style={{ height: 'calc(100vh - 280px)' }}>
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-full md:w-80 border-r border-gray-200 flex flex-col">
            {/* Search Bar */}
            <div className="p-4 border-b-2 border-gray-100 bg-gradient-to-r from-blue-50 to-white">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedChat(conv.id)}
                  className={`p-5 cursor-pointer border-b border-gray-100 hover:bg-blue-50 transition-all ${
                    selectedChat === conv.id ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-l-blue-600' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                        {conv.avatar}
                      </div>
                      {conv.online && (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-gray-900 truncate">{conv.name}</h3>
                        <span className="text-xs text-gray-500 font-medium">{conv.time}</span>
                      </div>
                      <p className="text-xs text-blue-600 mb-1 font-semibold">{conv.role}</p>
                      <p className="text-sm text-gray-700 truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Panel */}
          <div className="flex-1 flex flex-col hidden md:flex">
            {/* Chat Header */}
            <div className="p-5 border-b-2 border-gray-100 flex items-center justify-between bg-gradient-to-r from-white to-blue-50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                    {conversations.find((c) => c.id === selectedChat)?.avatar}
                  </div>
                  {conversations.find((c) => c.id === selectedChat)?.online && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {conversations.find((c) => c.id === selectedChat)?.name}
                  </h3>
                  <p className="text-xs text-blue-600 font-semibold">
                    {conversations.find((c) => c.id === selectedChat)?.online ? '🟢 Online' : '⚫ Offline'}
                  </p>
                </div>
              </div>
              <button className="p-2.5 text-gray-600 hover:bg-blue-50 rounded-xl transition-all">
                <MoreVertical size={22} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-50 to-blue-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md ${msg.isMe ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-2xl px-5 py-3 shadow-lg ${
                        msg.isMe
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-sm'
                          : 'bg-white text-gray-900 rounded-bl-sm border border-gray-100'
                      }`}
                    >
                      <p className="text-sm font-medium">{msg.content}</p>
                    </div>
                    <p className={`text-xs text-gray-500 mt-1.5 font-medium ${msg.isMe ? 'text-right' : 'text-left'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-5 border-t-2 border-gray-100 bg-white">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <button
                  type="button"
                  className="p-3 text-gray-600 hover:bg-blue-50 rounded-xl transition-all"
                >
                  <Paperclip size={22} />
                </button>
                <button
                  type="button"
                  className="p-3 text-gray-600 hover:bg-blue-50 rounded-xl transition-all"
                >
                  <Smile size={22} />
                </button>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                />
                <button
                  type="submit"
                  className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
                >
                  <Send size={22} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
