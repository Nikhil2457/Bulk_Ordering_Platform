import axios from 'axios';

export const getProducts = async () => {
  const res = await axios.get('https://bulk-ordering-platform.onrender.com/api/products');
  return res.data;
};

 export const getUsername = async () => {
  const res = await axios.get('https://bulk-ordering-platform.onrender.com/api/auth/user', {
    withCredentials: true,
  });
  return res.data.username;
};