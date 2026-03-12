import { useState } from "react";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5203/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.location.href = "/";

    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg w-96 border border-gray-200 dark:border-gray-800"
      >
        {/* Logo / Title */}
        <div className="flex items-center justify-center mb-2">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 dark:bg-blue-600 text-white font-bold text-lg">
            B
          </span>
        </div>

        <h2 className="text-2xl font-bold mb-1 text-center text-gray-900 dark:text-white">
          BookMySpace
        </h2>

        <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-6">
          Sign in to your account
        </p>

        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm mb-3 text-center">{error}</p>
        )}

        <div className="space-y-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-5 w-full bg-blue-600 dark:bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 font-medium cursor-pointer"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}