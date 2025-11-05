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
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-1">Chat with supporters about your requests.</p>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" style={{ height: 'calc(100vh - 250px)' }}>
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-full md:w-80 border-r border-gray-200 flex flex-col">
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedChat(conv.id)}
                  className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    selectedChat === conv.id ? 'bg-indigo-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {conv.avatar}
                      </div>
                      {conv.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{conv.name}</h3>
                        <span className="text-xs text-gray-500">{conv.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{conv.role}</p>
                      <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <span className="flex-shrink-0 w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
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
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {conversations.find((c) => c.id === selectedChat)?.avatar}
                  </div>
                  {conversations.find((c) => c.id === selectedChat)?.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {conversations.find((c) => c.id === selectedChat)?.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {conversations.find((c) => c.id === selectedChat)?.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md ${msg.isMe ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        msg.isMe
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 ${msg.isMe ? 'text-right' : 'text-left'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Paperclip size={20} />
                </button>
                <button
                  type="button"
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Smile size={20} />
                </button>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Send size={20} />
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
