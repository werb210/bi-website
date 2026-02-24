import { useState } from "react";

export default function ReferrerPortal() {
  const [referrer,setReferrer]=useState<any>({});
  const [step,setStep]=useState(1);

  function next(){ setStep(2); }

  return (
    <div className="content-section">
      {step===1 && (
        <>
          <h1>Referrer Registration</h1>
          <input placeholder="Company Name"
            onChange={(e)=>setReferrer({...referrer,company:e.target.value})}/>
          <input placeholder="Full Name"
            onChange={(e)=>setReferrer({...referrer,name:e.target.value})}/>
          <input placeholder="Email"
            onChange={(e)=>setReferrer({...referrer,email:e.target.value})}/>
          <input placeholder="Cell Number"
            onChange={(e)=>setReferrer({...referrer,phone:e.target.value})}/>
          <button onClick={next}>Continue</button>
        </>
      )}

      {step===2 && (
        <>
          <h2>Add Referrals (Next Block Will Expand)</h2>
        </>
      )}
    </div>
  );
}
