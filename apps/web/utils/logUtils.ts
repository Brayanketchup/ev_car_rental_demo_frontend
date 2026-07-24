import axios from "axios";

export const handleLogout = async () => {
    try {
      localStorage.clear();
      // await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
    //   setUsername(null); // Clear the username state immediately
    //   router.push('/');  // Redirect to home page
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };