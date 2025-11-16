"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { signOut } from "@/lib/actions/auth.action"

const Header = () => {
   const router = useRouter();
    const handleSignOut = async () => {
        await signOut();
        router.push("/sign-in");
      };
  return (
    <nav className="flex items-center justify-between">
        <div>
          <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="MockMate Logo" width={38} height={32} />
          <h2 className="text-primary-100">GetPrepared</h2>
        </Link>
        </div>
      <Button className="btn-secondary" onClick={handleSignOut}>
        Sign Out
      </Button>
      </nav>
  )
}

export default Header