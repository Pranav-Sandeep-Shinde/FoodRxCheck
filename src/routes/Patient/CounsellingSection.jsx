import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const CounsellingSection = ({ counsellingTips }) => {
  if (!counsellingTips) return null;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <FontAwesomeIcon icon={faInfoCircle} size="lg" color="#0a7ea4" />
        <span style={styles.headerText}>Counselling Tips</span>
      </div>
      <p style={styles.content}>{counsellingTips}</p>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '10px',
    marginVertical: '10px',
    boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
    border: '1px solid gray',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '5px',
  },
  headerText: {
    marginLeft: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#0a7ea4',
  },
  content: {
    fontSize: '14px',
    color: '#333',
  },
};

export default CounsellingSection;