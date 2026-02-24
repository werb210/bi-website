import { useState } from "react";

export default function LenderPortal() {
  const [email,setEmail]=useState("");

  async function login() {
    await fetch(`${import.meta.env.VITE_API_URL}/api/lender-login`,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ email })
    });
    alert("OTP Sent");
  }

  return (
    <div className="content-section">
      <h1>Lender Application Portal</h1>
      <input
        placeholder="Lender Email"
        onChange={(e)=>setEmail(e.target.value)}
      />
      <button onClick={login}>Continue</button>
    </div>
  );
}
