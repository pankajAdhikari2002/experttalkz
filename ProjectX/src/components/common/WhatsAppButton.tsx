import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const phoneNumber = "1234567890"; // Replace with real number
  const message = "Hi, I'm interested in your courses!";
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        backgroundColor: '#25D366',
        color: 'white',
        width: '3.5rem',
        height: '3.5rem',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        zIndex: 5000,
        transition: 'transform 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      title="Chat with us on WhatsApp"
    >
      <MessageCircle size={32} />
    </a>
  );
};

export default WhatsAppButton;
