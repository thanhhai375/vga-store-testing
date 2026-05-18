import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './AIChatWidget.css';

const currencyFormatter = new Intl.NumberFormat("vi-VN");

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Chào bạn! Tôi là trợ lý AI của VGA Store. Tôi có thể tư vấn từ cấu hình PC đến lựa chọn Card đồ họa. Bạn cần giúp gì ạ?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const allProducts = useSelector(state => state.product?.products || []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setShowTooltip(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isLoading]);

  useEffect(() => {
    // Hiện tooltip sau 3 giây
    const showTimer = setTimeout(() => {
      if (!isOpen) setShowTooltip(true);
    }, 3000);

    // Tự động ẩn sau 15 giây
    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 15000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const userMessage = { sender: 'user', text: userText };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error('Chưa cấu hình API Key');

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      // Tạo danh mục sản phẩm thu gọn
      const productCatalog = allProducts.map(p => `ID: ${p.id} | Tên: ${p.name} | Giá: ${p.price} | Hãng: ${p.brand?.name} | VRAM: ${p.vram}`).join('\n');

      const systemPrompt = `Bạn là nhân viên tư vấn nhiệt tình của VGA Store. Bạn hiểu biết sâu sắc về máy tính, phần cứng và card đồ họa.
Dưới đây là danh sách sản phẩm cửa hàng đang có:
${productCatalog}

Nhiệm vụ của bạn là tư vấn cho khách hàng dựa trên dữ liệu sản phẩm trên. Bạn cũng có thể trò chuyện tán gẫu về các chủ đề liên quan đến PC, game.
Bắt buộc phải trả về JSON theo đúng schema sau:
{
  "response_text": "Câu trả lời thân thiện của bạn. KHÔNG dùng markdown định dạng in đậm hay in nghiêng.",
  "recommended_product_ids": [id1, id2] // Mảng số nguyên chứa ID các sản phẩm bạn gợi ý (tối đa 3). Nếu không cần gợi ý, hãy để mảng rỗng []
}`;

      const history = messages.slice(1).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: JSON.stringify({ response_text: msg.text, recommended_product_ids: [] }) }]
      }));

      const chat = model.startChat({
        history: [
          { role: 'user', parts: [{ text: systemPrompt }] },
          { role: 'model', parts: [{ text: '{"response_text": "Dạ vâng, tôi đã hiểu. Tôi sẽ trả lời dưới dạng JSON chuẩn.", "recommended_product_ids": []}' }] },
          ...history
        ]
      });

      const result = await chat.sendMessage(userText);
      const responseText = result.response.text();
      
      const jsonResult = JSON.parse(responseText);
      const botResponse = jsonResult.response_text;
      const recommendedProductIds = jsonResult.recommended_product_ids || [];
      const recommendedProducts = allProducts.filter(p => recommendedProductIds.includes(Number(p.id)));

      setMessages(prev => [...prev, { sender: 'bot', text: botResponse, products: recommendedProducts }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Dạ hệ thống AI đang quá tải, bạn vui lòng thử lại sau ít phút nhé!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="ai-chat-container">
      {/* Tooltip Gợi ý */}
      {!isOpen && showTooltip && (
        <div className="ai-chat-tooltip" onClick={toggleChat}>
          <div className="tooltip-content">
            👋 Chào bạn, bạn cần tư vấn mua linh kiện gì không?
          </div>
          <div className="tooltip-close" onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}>✕</div>
        </div>
      )}

      <button className={`ai-chat-btn ${isOpen ? 'active' : ''}`} onClick={toggleChat}>
        {isOpen ? '✕' : (
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8V4H8"></path>
            <rect width="16" height="12" x="4" y="8" rx="2"></rect>
            <path d="M2 14h2"></path>
            <path d="M20 14h2"></path>
            <path d="M15 13v2"></path>
            <path d="M9 13v2"></path>
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="ai-chat-window">
          <div className="ai-chat-header">
            <div className="ai-avatar">🤖</div>
            <div className="ai-header-info">
              <h3>Trợ lý AI</h3>
              <span>VGA Store Support</span>
            </div>
          </div>
          
          <div className="ai-chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`ai-message-row ${msg.sender}`}>
                {msg.sender === 'bot' && <div className="ai-msg-avatar">🤖</div>}
                <div className={`ai-message-bubble-wrapper ${msg.sender}`}>
                  <div className={`ai-message-bubble ${msg.sender}`}>
                    {msg.text}
                  </div>
                  {msg.products && msg.products.length > 0 && (
                    <div className="ai-product-recommendations">
                      {msg.products.map(p => {
                         const dbImageUrl = p.imageUrl || p.imgUrl || p.img_url || p.image || (p.images && p.images.length > 0 && p.images[0]?.url);
                         let formattedImageUrl = dbImageUrl;
                         if (dbImageUrl && dbImageUrl.startsWith('/uploads/')) {
                           formattedImageUrl = `http://localhost:8080${dbImageUrl}`;
                         }
                         
                         return (
                           <Link to={`/product/${p.id}`} key={p.id} className="ai-product-card">
                             <img src={formattedImageUrl || '/images/products/gpu_original.png'} alt={p.name} />
                             <div className="ai-product-info">
                               <span className="ai-product-name" title={p.name}>{p.name}</span>
                               <span className="ai-product-price">{currencyFormatter.format(p.price)}₫</span>
                             </div>
                           </Link>
                         );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="ai-message-row bot">
                <div className="ai-msg-avatar">🤖</div>
                <div className="ai-message-bubble bot" style={{ fontStyle: 'italic', opacity: 0.7 }}>
                  AI đang suy nghĩ...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="ai-chat-input-area">
            <input 
              type="text" 
              placeholder="Nhập yêu cầu (VD: RTX 3060, dòng 6g)..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSend}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatWidget;
