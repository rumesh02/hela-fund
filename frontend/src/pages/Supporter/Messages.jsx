import { useState } from 'react';
import { Send, Paperclip, Search, MoreVertical, Phone, Video } from 'lucide-react';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'Kasun Perera',
      university: 'University of Colombo',
      lastMessage: 'Thank you so much for your help!',
      time: '10:30 AM',
      unread: 2,
      avatar: '👨‍🎓',
      online: true,
      request: 'Laptop for Online Classes'
    },
    {
      id: 2,
      name: 'Nimali Silva',
      university: 'University of Peradeniya',
      lastMessage: 'I received the books yesterday',
      time: 'Yesterday',
      unread: 0,
      avatar: '👩‍🎓',
      online: false,
      request: 'Engineering Textbooks'
    },
    {
      id: 3,
      name: 'Amila Fernando',
      university: 'University of Ruhuna',
      lastMessage: 'When can we arrange the meeting?',
      time: '2 days ago',
      unread: 1,
      avatar: '👨‍🎓',
      online: true,
      request: 'Monthly Bus Pass Support'
    },
    {
      id: 4,
      name: 'Sanduni Rathnayake',
      university: 'University of Jaffna',
      lastMessage: 'The data package is working great',
      time: '3 days ago',
      unread: 0,
      avatar: '👩‍🎓',
      online: false,
      request: 'Internet Data Package'
    },
    {
      id: 5,
      name: 'Ruwan Wickramasinghe',
      university: 'University of Sri Jayewardenepura',
      lastMessage: 'I am feeling much better now',
      time: '1 week ago',
      unread: 0,
      avatar: '👨‍🎓',
      online: false,
      request: 'Medical Supplies'
    }
  ];

  const messages = {
    1: [
      {
        id: 1,
        sender: 'other',
        text: 'Hello! Thank you for offering to help with my laptop request.',
        time: '10:15 AM'
      },
      {
        id: 2,
        sender: 'me',
        text: 'Hi Kasun! I\'m happy to help. Can you tell me more about what happened to your laptop?',
        time: '10:18 AM'
      },
      {
        id: 3,
        sender: 'other',
        text: 'My laptop screen cracked and the repair cost is too high. I need it for my online classes and assignments.',
        time: '10:20 AM'
      },
      {
        id: 4,
        sender: 'me',
        text: 'I understand. I can help you with the repair cost. Let\'s arrange a time to discuss the details.',
        time: '10:25 AM'
      },
      {
        id: 5,
        sender: 'other',
        text: 'Thank you so much for your help! This means a lot to me.',
        time: '10:30 AM'
      }
    ],
    2: [
      {
        id: 1,
        sender: 'other',
        text: 'Hi! I just wanted to let you know that I received the books yesterday.',
        time: 'Yesterday 3:45 PM'
      },
      {
        id: 2,
        sender: 'me',
        text: 'That\'s great news! Are they in good condition?',
        time: 'Yesterday 4:00 PM'
      },
      {
        id: 3,
        sender: 'other',
        text: 'Yes, they are perfect! Thank you so much for your generosity.',
        time: 'Yesterday 4:05 PM'
      }
    ],
    3: [
      {
        id: 1,
        sender: 'other',
        text: 'Hello! Thank you for supporting my transport request.',
        time: '2 days ago 2:00 PM'
      },
      {
        id: 2,
        sender: 'me',
        text: 'You\'re welcome! How can I help you with the bus pass?',
        time: '2 days ago 2:15 PM'
      },
      {
        id: 3,
        sender: 'other',
        text: 'When can we arrange the meeting to discuss the details?',
        time: '2 days ago 2:30 PM'
      }
    ]
  };

  const activeConversation = conversations.find((conv) => conv.id === selectedChat);
  const activeMessages = messages[selectedChat] || [];

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.request.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // In real app, send message to backend
      setMessageInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 p-6">
      {/* Page Header */}
      <div className="bg-white border-l-4 border-teal-600 rounded-xl shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-1">Communicate with requesters you're helping</p>
      </div>

      {/* Chat Interface */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" style={{ height: 'calc(100vh - 250px)' }}>
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Conversation Items */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedChat(conv.id)}
                  className={`p-4 cursor-pointer transition-all border-b border-gray-200 hover:bg-teal-50 ${
                    selectedChat === conv.id ? 'bg-teal-50 border-l-4 border-l-teal-600' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center text-2xl">
                        {conv.avatar}
                      </div>
                      {conv.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-gray-800 truncate">{conv.name}</h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{conv.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1 truncate">{conv.request}</p>
                      <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <div className="flex-shrink-0 w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {conv.unread}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="hidden md:flex md:flex-col flex-1">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center text-xl">
                        {activeConversation.avatar}
                      </div>
                      {activeConversation.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{activeConversation.name}</h3>
                      <p className="text-xs text-gray-500">{activeConversation.university}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                      <Phone size={20} />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                      <Video size={20} />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>

                {/* Request Context Banner */}
                <div className="bg-teal-50 border-b border-teal-200 px-4 py-3">
                  <p className="text-sm text-teal-800">
                    <span className="font-medium">Request:</span> {activeConversation.request}
                  </p>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {activeMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender === 'me'
                            ? 'bg-teal-600 text-white'
                            : 'bg-white text-gray-800 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === 'me' ? 'text-teal-100' : 'text-gray-500'
                          }`}
                        >
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex items-end space-x-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                      <Paperclip size={20} />
                    </button>
                    <div className="flex-1">
                      <textarea
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      className="p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!messageInput.trim()}
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Select a conversation</h3>
                  <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
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
