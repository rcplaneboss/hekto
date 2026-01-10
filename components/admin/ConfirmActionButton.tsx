"use client";

import React, { useState } from "react";

export default function ConfirmActionButton({
  endpoint,
  payload,
  label,
  className,
  confirmMessage,
}: {
  endpoint: string;
  payload: Record<string, any>;
  label?: string;
  className?: string;
  confirmMessage?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    const ok = confirm(confirmMessage || `Are you sure you want to ${label || "perform this action"}?`);
    if (!ok) return;
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Action failed");
      // simple refresh to reflect changes
      location.reload();
    } catch (err: any) {
      alert(err.message || "Action failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleClick} disabled={loading} className={className}>
      {loading ? "Please wait..." : label}
    </button>
  );
}
