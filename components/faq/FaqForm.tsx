"use client";

import { useState } from "react";

export default function FaqForm() {
  const [loading, setLoading] = useState(false);

  // White background inputs to contrast with the grey form background
  const inputStyles = "w-full bg-white dark:bg-[#2f3245] border border-transparent dark:border-[#383a50] rounded-[3px] px-4 py-3 outline-none text-[#8990b2] dark:text-white placeholder-[#8990b2] dark:placeholder-[#6b6e8a] focus:border-[#FB2E86] transition-colors font-lato shadow-sm";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000)); // Simulate API
    setLoading(false);
    alert("Question Submitted!");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      <input 
        type="text" 
        placeholder="Your Name*" 
        className={inputStyles}
        required 
      />
      
      <input 
        type="text" 
        placeholder="Subject*" 
        className={inputStyles}
        required 
      />
      
      <textarea 
        placeholder="Type Your Message*" 
        rows={6} 
        className={`${inputStyles} resize-none`}
        required 
      />
      
      <button 
        type="submit" 
        disabled={loading}
        className="bg-[#FB2E86] text-white px-10 py-3 rounded-[3px] font-josefin text-base hover:bg-[#F91875] transition-all disabled:opacity-70"
      >
        {loading ? "Sending..." : "Send Mail"}
      </button>
    </form>
  );
}