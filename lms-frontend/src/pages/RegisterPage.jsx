import { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    role: "",
  });

  useEffect(() => {
    async function fetchRoles() {
      try {
        const res = await api.get("/auth/roles");   // ⭐ FIXED HERE
        console.log("ROLES from API:", res.data);
        setRoles(res.data);
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    }
    fetchRoles();
  }, []);

  const handleSubmit = async () => {
    if (!form.role) return alert("Please select a role!");
    try {
      await api.post("/auth/register", form);
      alert("Registered Successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Error during registration");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Register</h2>

      <input
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      /><br /><br />

      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      /><br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      /><br /><br />

      {/* DROPDOWN */}
      <select
  style={{ width: "200px", padding: "8px" }}
  value={form.role}
  onChange={(e) => setForm({ ...form, role: e.target.value })}
>
  <option value="">-- Select Role --</option>

  {roles.map((r, index) => (
    <option key={r.ID || index} value={r.Name}>
      {r.Name}
    </option>
  ))}

</select>



      <br /><br />
      <button onClick={handleSubmit}>Register</button>
    </div>
  );
}
