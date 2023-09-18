import React, { useState } from 'react';
import './disperse.css';
import InputField from '../inputField/InputField';
import ErrorMessages from '../errorHandler/errorHandler';

const Disperse = () => {
  const [inputText, setInputText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [parsedData, setParsedData] = useState([]);
  const [showKeepFirstOneButton, setShowKeepFirstOneButton] = useState(false);
  const [showCombineBalanceButton, setShowCombineBalanceButton] =
    useState(false);

  const parseInput = () => {
    const lines = inputText.split('\n');
    const seenAddresses = new Map();
    const addressErrors = new Map();
    const errors = [];
    let hasInvalidAmount = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line === '') continue;

      const parts = line.split(/[,=\s]+/); // Updated regex for separation

      if (parts.length !== 2) {
        errors.push(
          `Line ${
            i + 1
          }: Each line should have exactly one address and one amount.`
        );
      } else {
        const [address, amount] = parts;

        if (!/^(0x)?[0-9a-fA-F]{40}$/.test(address)) {
          errors.push(`Line ${i + 1}: Invalid Ethereum address.`);
        }

        if (!/^\d+$/.test(amount)) {
          hasInvalidAmount = true;
          errors.push(`Line ${i + 1}: Invalid amount.`);
        }

        if (seenAddresses.has(address)) {
          const firstOccurrence = seenAddresses.get(address);
          if (!addressErrors.has(address)) {
            addressErrors.set(address, [firstOccurrence]);
          }
          addressErrors.get(address).push(i + 1);
          setShowKeepFirstOneButton(true);
          setShowCombineBalanceButton(true);
        } else {
          const parsedAmount = parseInt(amount, 10);
          if (isNaN(parsedAmount) || parsedAmount <= 0) {
            errors.push(`Line ${i + 1}: Amount should be a positive number.`);
          }
          seenAddresses.set(address, i + 1);
          parsedData.push({ address, amount: parsedAmount });
        }
      }
    }

    if (!hasInvalidAmount) {
      addressErrors.forEach((lines, address) => {
        errors.push(
          `Address ${address} encountered duplicates in Lines: ${lines.join(
            ', '
          )}`
        );
      });
    } else {
      setShowKeepFirstOneButton(false);
      setShowCombineBalanceButton(false);
    }

    if (errors.length > 0) {
      setErrorMessage(errors.join('\n'));
    } else {
      setErrorMessage('');
      setParsedData(parsedData);
      setShowKeepFirstOneButton(false);
      setShowCombineBalanceButton(false);
    }
  };

  const keepFirstOne = () => {
    const lines = inputText.split('\n');
    const seenAddresses = new Set();
    const uniqueLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === '') continue;

      const parts = line.split(/[,=\s]+/);
      const [address] = parts;

      if (!seenAddresses.has(address)) {
        seenAddresses.add(address);
        uniqueLines.push(line);
      }
    }
    setErrorMessage('');
    setInputText(uniqueLines.join('\n'));
    setShowKeepFirstOneButton(false);
    setShowCombineBalanceButton(false);
  };

  const combineBalance = () => {
    const lines = inputText.split('\n');
    const addressAmountMap = new Map();

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === '') continue;

      const parts = line.split(/[,=\s]+/);
      const [address, amount] = parts;

      if (addressAmountMap.has(address)) {
        const currentAmount = addressAmountMap.get(address);
        addressAmountMap.set(address, currentAmount + parseInt(amount, 10));
      } else {
        addressAmountMap.set(address, parseInt(amount, 10));
      }
    }

    const combinedLines = [];
    for (const [address, amount] of addressAmountMap.entries()) {
      combinedLines.push(`${address} ${amount}`);
    }
    setErrorMessage('');
    setInputText(combinedLines.join('\n'));
    setShowKeepFirstOneButton(false);
    setShowCombineBalanceButton(false);
  };

  return (
    <div>
      <div className="container">
        <div className="title">Addresses with Amounts</div>
        <InputField inputText={inputText} setInputText={setInputText} />
        <div className="title">Separated by ',' or ' ' or '='</div>
        {errorMessage && (
          <ErrorMessages
            errorMessage={errorMessage}
            showKeepFirstOneButton={showKeepFirstOneButton}
            showCombineBalanceButton={showCombineBalanceButton}
            keepFirstOne={keepFirstOne}
            combineBalance={combineBalance}
          />
        )}
        <button className="next-button" onClick={parseInput}>
          Next
        </button>
      </div>
      <br />
    </div>
  );
};

export default Disperse;
