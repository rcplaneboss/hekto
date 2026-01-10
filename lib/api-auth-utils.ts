import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

/**
 * Check if request is from an admin user
 * Returns error response if not authorized
 */
export async function requireAdminAuth(req: NextRequest) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized - Please sign in" },
      { status: 401 }
    )
  }
  
  if (session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden - Admin access required" },
      { status: 403 }
    )
  }
  
  return null // Authorization successful
}
