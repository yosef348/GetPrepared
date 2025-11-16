import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/actions/auth.action";
import Header from "@/components/Header";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");


  return (
    <div className="root-layout">
      <Header />
      {children}
    </div> 
  );
};

export default Layout;
