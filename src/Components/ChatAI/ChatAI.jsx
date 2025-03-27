import React, { useState } from 'react';
import { Box, IconButton, TextField, Button, Typography, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import ReactMarkdown from 'react-markdown';
import { sendMessageAPI } from '../../apis';

const ChatAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isBotResponding, setIsBotResponding] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { sender: 'user', text: input };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput('');
      setIsBotResponding(true);

      try {
        const userQuery = {
          conversation_id: '123',
          bot_id: '7452931992095899655',
          user: '29032201862555',
          query: input,
          stream: false,
        };

        const botResponse = await sendMessageAPI(userQuery);
        if (botResponse.answer) {
          const botAnswerMessage = { sender: 'bot', text: botResponse.answer };
          setMessages((prevMessages) => [...prevMessages, botAnswerMessage]);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setIsBotResponding(false);
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div>
      <IconButton
        onClick={toggleChat}
        sx={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          bgcolor: 'transparent',
          color: 'white',
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundImage:
            'url("https://static.vecteezy.com/system/resources/previews/053/135/088/non_2x/chatbot-digital-information-free-png.png")',
          backgroundSize: 'contain',
          '&:hover': {
            bgcolor: 'rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        {!isOpen && <div style={{ width: '100%', height: '100%' }} />}
      </IconButton>
      {isOpen && (
        <Box
          sx={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            width: '350px',
            height: '500px',
            bgcolor: 'white',
            boxShadow: 3,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            borderRadius: '16px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#0984e3',
              color: 'white',
              borderTopLeftRadius: 2,
              borderTopRightRadius: 2,
              p: 1,
              borderRadius: '16px 16px 0 0',
            }}
          >
            <IconButton sx={{ color: 'white' }} onClick={toggleChat}>
              <ArrowBackIcon />
            </IconButton>
            <Avatar
              alt="DevNghiepdu"
              src="https://static.vecteezy.com/system/resources/previews/053/135/088/non_2x/chatbot-digital-information-free-png.png"
              sx={{ width: 55, height: 55 }}
            />
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                marginRight: '40px',
                marginTop: '5px',
              }}
            >
              <Typography variant="subtitle1" sx={{ mr: 1, fontSize: '13px' }}>
                Trợ lý ảo của 2HM
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '60px' }}>
                <Box sx={{ width: 8, height: 8, bgcolor: '#9bd529', borderRadius: '50%', mb: 0.5 }} />
                <Typography variant="caption" sx={{ ml: 0.5 }}>
                  Online
                </Typography>
              </Box>
            </Box>
            <IconButton sx={{ color: 'white' }}>
              <MoreVertIcon />
            </IconButton>
            <IconButton sx={{ color: 'white' }} onClick={toggleChat}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  p: 1,
                  m: 1,
                  borderRadius: '12px',
                  bgcolor: message.sender === 'user' ? '#e0f7fa' : '#f1f8e9',
                  alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  wordWrap: 'break-word',
                }}
              >
                {message.sender === 'bot' ? (
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                ) : (
                  <Typography variant="body1">{message.text}</Typography>
                )}
              </Box>
            ))}
            {isBotResponding && (
              <Box
                sx={{
                  p: 1,
                  m: 1,
                  borderRadius: '12px',
                  bgcolor: '#f1f8e9',
                  alignSelf: 'flex-start',
                  maxWidth: '80%',
                  wordWrap: 'break-word',
                }}
              >
                <Typography variant="body2" sx={{ color: '#777', fontStyle: 'italic' }}>
                  Đang phản hồi...
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', p: 1, borderTop: '1px solid #ddd' }}>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{ borderRadius: '12px' }}
            />
            <Button
              variant="contained"
              onClick={handleSend}
              endIcon={<SendIcon sx={{ color: 'white' }} />}
              sx={{ ml: 0.5, borderRadius: '12px', color: 'white', fontSize: '13px' }}
            />
          </Box>
        </Box>
      )}
    </div>
  );
};

export default ChatAI;
