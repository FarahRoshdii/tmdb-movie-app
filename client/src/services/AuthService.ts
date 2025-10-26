const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed");
  return data;
}

export async function registerUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Registration failed");
  return data;
}
