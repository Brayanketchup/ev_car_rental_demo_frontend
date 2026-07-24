// import React from 'react';

// interface LogoutButtonProps {
//     onLogout: () => void;  // This specifies that `onLogout` is a function returning void
// }

// // export const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
// export const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {

//     const LogoutButton = () => {
    
//     //     fetch('http://localhost:5000/api/logout', {
//     //       method: 'POST',
//     //       credentials: 'include', // Ensure cookies are included with the request
//     //     })
//     //     .then(response => response.json())
//     //     .then(data => {
//     //       console.log(data.message);
//     //       // Perform additional actions post-logout like redirecting or state update
//     //       // Redirect to login or home page
//     //       window.location.href = '/login';
//     //     })
//     //     .catch(error => console.error('Error logging out:', error));
//     //   };
//     const handleLogout = () => {
//         fetch('http://localhost:5000/api/logout', {
//           method: 'POST',
//           credentials: 'include', // Ensure cookies are included with the request
//         })
//         .then(response => response.json())
//         .then(data => {
//           console.log(data.message);
//           // Perform additional actions post-logout like redirecting or state update
//           window.location.href = '/login';
//         })
//         .catch(error => console.error('Error logging out:', error));
//       };
    
//   return (
//     <>
    
//     <button onClick={onLogout} className="logout-button">
//       Log Out
//     </button>

//     </>
//   );
// };

// // export default LogoutButton;

import React from 'react';

interface LogoutButtonProps {
    // Props types if needed
}

export const LogoutButton: React.FC<LogoutButtonProps> = () => {

    const handleLogout = () => {
        fetch('http://localhost:5000/api/logout', {
          method: 'POST',
          credentials: 'include', // Ensure cookies are included with the request
        })
        .then(response => response.json())
        .then(data => {
          console.log(data.message);
          // Perform additional actions post-logout like redirecting or state update
          window.location.href = '/login';
        })
        .catch(error => console.error('Error logging out:', error));
      };
    
    return (
        <button onClick={handleLogout} className="logout-button">
          Log Out
        </button>
    );
};

// export default LogoutButton;
