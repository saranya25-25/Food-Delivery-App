import React, { useState } from 'react';
const FoodieBot = () => {
    const [messages, setMessages] = useState([
        {
            sender: 'bot',
            text: '🍗 Hi! I am ChefBot. Tell me what to order (e.g., "Order 2 Hyderabadi Biryanis"), or ask for step-by-step recipes!',
        },
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;
        const userText = inputMessage;
        setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
        setInputMessage('');
        setLoading(true);
        try {
            const response = await fetch('https://food-delivery-project-2y1g.onrender.com/api/chefbot/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userText }),
            });
            if (!response.ok) {
                throw new Error('Server response was not ok');
            }
            const data = await response.json();
            setMessages((prev) => [
                ...prev,
                { sender: 'bot', text: data.reply },
            ]);
        } catch (error) {
            console.error('Error connecting to ChefBot service:', error);
            setMessages((prev) => [
                ...prev,
                { sender: 'bot', text: '❌ Error connecting to ChefBot service.' },
            ]);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="chat-modal">
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
                {loading && <div className="message bot">ChefBot is thinking...</div>}
            </div>
            <div className="chat-input-area">
                <input
                    type="text"
                    placeholder="Ask for food or recipes..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};
export default FoodieBot;