import React, { useState, useRef, useEffect } from 'react';

const CaptchaComponent = ({ onVerify }) => {
  const canvasRef = useRef(null);
  const [captchaText, setCaptchaText] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  // Генерація випадкового тексту для CAPTCHA
  const generateCaptchaText = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: 6 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');
  };

  // Малювання CAPTCHA на Canvas
  const drawCaptcha = (text) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Очищаємо Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Задаємо стиль
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Додаємо текст
    ctx.font = '24px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText(text, 20, 30);

    // Додаємо "шум" у вигляді ліній
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(0, 0, 0, ${Math.random()})`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
  };

  // Оновлення CAPTCHA
  const refreshCaptcha = () => {
    const newText = generateCaptchaText();
    setCaptchaText(newText);
    drawCaptcha(newText);
    setCaptchaError('');
    setInputValue('');
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const handleVerify = () => {
    if (inputValue === captchaText) {
      setCaptchaError('');
      onVerify(true);
    } else {
      setCaptchaError('Неправильна CAPTCHA. Спробуйте ще раз.');
      refreshCaptcha();
      onVerify(false);
    }
  };

  return (
    <div className="mb-4">
      <canvas ref={canvasRef} width={200} height={50} className="border mb-2" />
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Введіть CAPTCHA"
          className="border rounded p-2 flex-1"
        />
        <button
          onClick={handleVerify}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Перевірити
        </button>
      </div>
      {captchaError && <p className="text-red-500 mt-2">{captchaError}</p>}
      <button
        onClick={refreshCaptcha}
        className="text-blue-500 underline mt-2"
      >
        Оновити CAPTCHA
      </button>
    </div>
  );
};

export default CaptchaComponent;
