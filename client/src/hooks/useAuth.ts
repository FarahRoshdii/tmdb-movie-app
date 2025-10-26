import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser, registerUser } from "../services/AuthService";

export function useAuthForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (isRegister && (!firstName || !lastName)) {
      setError("First name and last name are required");
      return;
    }

    try {
      setLoading(true);
      const data = isRegister
        ? await registerUser(email, password, firstName, lastName)
        : await loginUser(email, password);

      setSuccess(
        isRegister ? "Registered successfully!" : "Logged in successfully!"
      );
      if (data.token && data.user) login(data.token, data.user);
      setTimeout(() => navigate("/"), 400);
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    isRegister,
    setIsRegister,
    email,
    setEmail,
    password,
    setPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    loading,
    error,
    success,
    handleSubmit,
  };
}
