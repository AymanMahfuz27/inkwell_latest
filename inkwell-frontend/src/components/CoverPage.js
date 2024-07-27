// import React from 'react';
// import '../css/CoverPage.css';

// const CoverPage = ({ book }) => {
//   return (
//     <div className="cover-page">
//       <div className="cover-image-container">
//         <img 
//           src={book.cover_picture || '/default-cover.jpg'} 
//           alt={`${book.title} cover`}
//           className="cover-image"
//         />
//       </div>
//       <div className="book-details">
//         <h1>{book.title}</h1>
//         <p className="author">By {book.uploaded_by}</p>
//         {book.genre_names && book.genre_names.length > 0 && (
//           <p className="genres">Genres: {book.genre_names.join(', ')}</p>
//         )}
//         {book.description && <p className="description">{book.description}</p>}
//       </div>
//     </div>
//   );
// };

// export default CoverPage;

import React from 'react';
import '../css/CoverPage.css';

const CoverPage = ({ book, onStartReading }) => {
  return (
    <div className="cover-page">
      <div className="cover-image-container">
        <img 
          src={book.cover_picture || '/default-cover.jpg'} 
          alt={`${book.title} cover`}
          className="cover-image"
        />
      </div>
      <div className="book-details">
        <h1>{book.title}</h1>
        <p className="author">By {book.uploaded_by}</p>
        {book.genre_names && book.genre_names.length > 0 && (
          <p className="genres">Genres: {book.genre_names.join(', ')}</p>
        )}
        {book.description && <p className="description">{book.description}</p>}
        <button onClick={onStartReading} className="start-reading-button">Start Reading</button>
      </div>
    </div>
  );
};

export default CoverPage;
