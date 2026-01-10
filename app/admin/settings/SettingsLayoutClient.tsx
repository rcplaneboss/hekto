"use client";
import { useState } from "react";

const SUBNAV = [
  { label: "Store Settings", key: "store" },
  { label: "Navigation Links", key: "nav" },
  { label: "Static Pages", key: "pages" },
  { label: "Newsletter", key: "newsletter" },
  { label: "Contact Submissions", key: "contact" },
  { label: "Site Configuration", key: "config" },
];

export default function SettingsLayoutClient() {
  const [active, setActive] = useState("store");

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-josefin font-bold mb-8 text-[#151875] dark:text-white">Settings</h1>
      <nav className="flex gap-4 mb-8">
        {SUBNAV.map((item) => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className={`px-4 py-2 rounded-lg font-lato font-semibold transition-all duration-150
              ${active === item.key ? "bg-[#FB2E86] text-white shadow" : "bg-white dark:bg-slate-800 text-[#151875] dark:text-white hover:bg-[#F6F7FB] dark:hover:bg-slate-700"}
            `}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <section className="bg-white dark:bg-slate-900 rounded-2xl shadow p-8 min-h-[300px]">
        {active === "store" && <div>Store Settings content goes here.</div>}
        {active === "nav" && <div>Navigation Links content goes here.</div>}
        {active === "pages" && <div>Static Pages content goes here.</div>}
        {active === "newsletter" && <div>Newsletter content goes here.</div>}
        {active === "contact" && <div>Contact Submissions content goes here.</div>}
        {active === "config" && <div>Site Configuration content goes here.</div>}
      </section>
    </div>
  );
}
