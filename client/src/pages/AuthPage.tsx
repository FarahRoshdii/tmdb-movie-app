import { useAuthForm } from "@/hooks/useAuth";

export default function AuthPage() {
  const {
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
  } = useAuthForm();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black">
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative bg-[#121212] rounded-2xl w-96 md:w-[32rem] p-8 md:p-10 border border-white/20 shadow-2xl">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-100 text-center mb-6">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isRegister && (
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#1f1f1f] text-gray-100 placeholder-gray-500 
                           focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#1f1f1f] text-gray-100 placeholder-gray-500 
                           focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#1f1f1f] text-gray-100 placeholder-gray-500 
                       focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#1f1f1f] text-gray-100 placeholder-gray-500 
                       focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
            minLength={6}
          />

          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
              <p className="text-red-500 text-sm text-center">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500 rounded-lg p-3">
              <p className="text-green-500 text-sm text-center">{success}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white 
                       font-semibold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Please wait..." : isRegister ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-600 font-semibold hover:underline"
          >
            {isRegister ? "Sign In" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}
