import React from 'react';

const ErrorMessages = ({
  errorMessage,
  showKeepFirstOneButton,
  showCombineBalanceButton,
  keepFirstOne,
  combineBalance,
}) => {
  return (
    <div className="error-message">
      {showKeepFirstOneButton && showCombineBalanceButton && (
        <div className="button-container">
          <span>Duplicates</span>
          <div>
            <button className="action-button" onClick={keepFirstOne}>
              Keep the first one
            </button>
            <span className="separator">|</span>
            <button className="action-button" onClick={combineBalance}>
              Combine Balance
            </button>
          </div>
        </div>
      )}
      <div className="error-box">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30px"
          height="30px"
          viewBox="0 0 25 25"
          fill="none"
        >
          <path
            d="M12.5 16V14.5M12.5 9V13M20.5 12.5C20.5 16.9183 16.9183 20.5 12.5 20.5C8.08172 20.5 4.5 16.9183 4.5 12.5C4.5 8.08172 8.08172 4.5 12.5 4.5C16.9183 4.5 20.5 8.08172 20.5 12.5Z"
            stroke="red"
            stroke-width="1.2"
          />
        </svg>
        <div className="errors">
          {errorMessage.split('\n').map((message, index) => (
            <div key={index}>{message}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessages;
