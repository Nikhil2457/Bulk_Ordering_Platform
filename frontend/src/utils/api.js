import axios from 'axios';

export const getProducts = async () => {
  const res = await axios.get('https://bulk-ordering-platform.onrender.com/api/products');
  return res.data;
};
