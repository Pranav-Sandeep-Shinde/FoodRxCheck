import React from 'react';

const parseAndRenderText = (text) => {
  if (!text) {
    return null;
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      const url = part.startsWith('http') ? part : `https://${part}`;
      return (
        <span
          key={index}
          style={styles.linkText}
          onClick={() => window.open(url, '_blank')}
          onContextMenu={(e) => {
            e.preventDefault();
            copyToClipboard(url);
          }}
        >
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

const styles = {
  linkText: {
    fontSize: '16px',
    color: '#6200ee',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
};

export default parseAndRenderText;