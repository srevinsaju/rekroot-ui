import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Revolutionize Hiring with <span class="text-primary">rekroot.</span><br className="hidden sm:inline" />{' '}
          Empowering HR Professionals to Streamline Job Postings and Applications
          
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
        Your All-in-One Solution for Effortless Job Postings and Seamless Application Management. Say goodbye to the hassle of traditional hiring processes and embrace the power of Rekroot. Empowering HR professionals, one hire at a time.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href="/login"
          rel="noreferrer"
          className={buttonVariants()}
        >
          Get Started
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href="/login"
          className={buttonVariants({ variant: "outline" })}
        >
          Login
        </Link>
      </div>
    </section>
  )
}
