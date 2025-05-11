import React, { useState, useEffect } from 'react';
import './App.css'

const App = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(true);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("chatHistory"))
    if (saved) setMessages(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages))
  }, [messages])

  const sendMessage = async () => {
    if (!input) return
  
    const newMessages = [...messages, { text: input, sender: "user" }]
    setMessages(newMessages)
  
    console.log("Sending message:", input) 
  
    try {
      const res = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      })
  
      if (res.ok) {
        const data = await res.json()
        console.log("Received reply from backend:", data) 
        if (data.reply) {
          setMessages([...newMessages, { text: data.reply, sender: "bot" }])
          speakText(data.reply)
        }
      } else {
        console.error("Error from backend:", res.status, res.statusText)
      }
    } catch (error) {
      console.error("Error in fetch:", error)
    }
  
    setInput('')
  }
  
  const speakText = (text) => {
    if (!isSpeakingEnabled) return;
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const startVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      console.log("Voice input:", transcript) 
    }
    recognition.start()
  }

  return (
    <div className="chat-container">
      <div className='nav-box'>
          <div id='bot'><i class='bx bx-menu'></i> ChatBot</div>
          <div>
            <a href=''><button name="New" className='newButton'>New</button></a>
            <button onClick={() => setIsSpeakingEnabled(!isSpeakingEnabled)}>
            {isSpeakingEnabled ? "🔈 Voice: On" : "🔇 Voice: Off"}
            </button>
          </div>
      </div>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <br></br>
      <div className="chat-controls">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="sendButton" onClick={sendMessage}><i class='bx bx-up-arrow-alt'></i>Send</button>
        <button onClick={startVoiceInput}>🎤</button>
      </div>
      <br></br>
    </div>
  )
}

export default App