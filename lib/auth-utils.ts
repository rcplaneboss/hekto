import { auth } from "@/auth"
import { redirect } from "next/navigation"

/**
 * Ensure user is authenticated and is an admin
 * Redirect to login if not authenticated or to home if not admin
 */
export async function requireAdmin() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }
  
  if (session.user.role !== "ADMIN") {
    redirect("/")
  }
  
  return session
}

/**
 * Check if user is admin without redirecting
 */
export async function isAdmin() {
  const session = await auth()
  return session?.user?.role === "ADMIN"
}
