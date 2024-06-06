import React from 'react'; // Import the React library

// Define the Footer component
const Footer = () => {
  return (
    <footer style = {styles.footer}>
      <p>Inkwell, all rights reserved, this is a footer lol</p>
    </footer>
  );
};
const styles = {
    footer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: 'rgba(51, 51, 51, 0.8)', // Translucent background
        color: '#fff',
        position: 'fixed',
        width: '100%',
        bottom: 0,
        zIndex: 1000,
    },
  };
export default Footer; // Export the Footer component
