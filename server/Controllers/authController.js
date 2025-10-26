import { registerUser, loginUser } from '../Services/authService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const register = async (req, res)=> {
  try {
    const { first_name, last_name, email, password } = req.body;
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const result = await registerUser(first_name, last_name, email, password);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}
