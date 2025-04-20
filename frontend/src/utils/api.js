import axios from 'axios';

export const getProducts = async () => {
  const res = await axios.get('http://bulk-ordering-platform.onrender.com/api/products');
  return res.data;
};
