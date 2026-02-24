import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState<any>({});

  async function submit() {
    await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    alert("Submitted");
  }

  return (
    <div className="content-section">
      <h1>Contact Us</h1>

      <input
        placeholder="Company Name (optional)"
        onChange={(e)=>setForm({...form,company:e.target.value})}
      />

      <input
        placeholder="Full Name *"
        required
        onChange={(e)=>setForm({...form,name:e.target.value})}
      />

      <input
        placeholder="Email *"
        required
        onChange={(e)=>setForm({...form,email:e.target.value})}
      />

      <input
        placeholder="Phone Number *"
        required
        onChange={(e)=>setForm({...form,phone:e.target.value})}
      />

      <button onClick={submit}>Request Assistance</button>
    </div>
  );
}
