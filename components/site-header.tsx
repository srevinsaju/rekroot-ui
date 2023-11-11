"use client";
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "./user-nav"
import React, { useEffect } from "react";

function UserBlock() {
  let loggedIn = false
  useEffect( () => {
  if ( window.sessionStorage.getItem("token")) {
    console.log("login status check: ", true)
    loggedIn = true
  }})
  if (loggedIn) {
    return <UserNav />
  }

  return <></>
}

export function SiteHeader() {
  const [loggedIn, setLoggedIn] = React.useState<boolean>(false);

  let userBlock: React.ReactNode = <UserNav />

  useEffect( () => {
    if ( window.sessionStorage.getItem("token")) {
      setLoggedIn(true)
    }
  })
  

  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            
            <ThemeToggle />
            {loggedIn ? userBlock: <></>}
          </nav>
        </div>
      </div>
    </header>
  )
}
