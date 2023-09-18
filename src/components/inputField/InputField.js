import React from 'react';

const InputField = ({ inputText, setInputText }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const start = event.target.selectionStart;
      const end = event.target.selectionEnd;
      const newText =
        inputText.substring(0, start) + '\t' + inputText.substring(end);
      setInputText(newText);
    }
  };

  return (
    <div className="textarea-container">
      <div className="line-numbers">
        {inputText.split('\n').map((line, index) => (
          <span key={index} className="line-number"></span>
        ))}
      </div>
      <textarea
        className="text-area"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type address and amount (eg: 0x2CB99F193549681e06C6770dDD5543812B4FaFE8 52)"
      />
    </div>
  );
};

export default InputField;
