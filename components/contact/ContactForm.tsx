"use client";

import { useState } from "react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);

  
  const inputStyles = "w-full bg-transparent border border-[#A4B6C8] dark:border-[#383a50] rounded-sm px-4 py-3 outline-none text-[#8A8FB9] dark:text-white placeholder-[#8A8FB9] dark:placeholder-[#6b6e8a] focus:border-[#FB2E86] dark:focus:border-[#FB2E86] transition-colors font-lato";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // Simulation
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    alert("Message Sent!");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-[550px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <input 
          type="text" 
          name="name"
          placeholder="Your Name*" 
          className={inputStyles}
          required 
        />
        <input 
          type="email" 
          name="email"
          placeholder="Your E-mail*" 
          className={inputStyles}
          required 
        />
      </div>
      
      <input 
        type="text" 
        name="subject"
        placeholder="Subject*" 
        className={inputStyles}
        required 
      />
      
      <textarea 
        name="message"
        placeholder="Type Your Message*" 
        rows={6} 
        className={`${inputStyles} resize-none`}
        required 
      />
      
      <button 
        type="submit" 
        disabled={loading}
        className="bg-[#FB2E86] text-white px-6 py-3 rounded-sm font-josefin text-base tracking-wide hover:bg-[#F91875] cursor-pointer transition-all disabled:opacity-70 "
      >
        {loading ? "Sending..." : "Send Mail"}
      </button>
    </form>
  );
}