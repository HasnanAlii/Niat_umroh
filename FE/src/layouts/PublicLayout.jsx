import { Navbar } from "@/components/Navbar"
import { Outlet } from "react-router"

export const PublicLayout = () => {
  return (
    <>
      <Navbar/>
      <main>
        <Outlet />
      </main>
    </>
  )
}
