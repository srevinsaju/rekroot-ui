"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import axios, { AxiosError } from 'axios'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { redirect } from "next/navigation"
import { useRouter } from "next/router"


interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("")
  const [alertVisible, setAlertVisible] = React.useState<boolean>(false);

  const [alertTitle, setAlertTitle] = React.useState("");
  const [alertDescription, setAlertDescription] = React.useState("");
  const [success, setSuccess] = React.useState<boolean>(false);

  async function onSubmit(event: React.SyntheticEvent) {

    event.preventDefault()
    setIsLoading(true)
    let url = process.env.NEXT_PUBLIC_BACKEND_URL
    try {
      let result = await axios.post(`${url}/sign-up`, {
        email: email, 
        password: password,
      })
      console.log(result)
      setAlertTitle("You are in! 🤟")
      setAlertDescription("Congratulations! You're now a part of the Rekroot community. Your account has been successfully created, unlocking a world of effortless hiring. Dive in and start streamlining your job postings and applications with Rekroot's intuitive features. Happy recruiting!")
      setSuccess(true);
    } catch (err: any) {
      setAlertTitle(err.response.data.message)
      setAlertDescription(err.response.data?.description || `That's all we know.`)
      console.log(err.response.data.message)
    }

    setAlertVisible(true);
    setIsLoading(false)

    
    
  }

  async function alertButtonCallback() {
    console.log("cancel callback")
    if (success) {
      console.log("account creation successful.")
      document.location.href = "/login"
    }
  }

  

  return (
    <AlertDialog open={alertVisible}  onOpenChange={setAlertVisible}>
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
            <Input
              id="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              placeholder="Password"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading || email.length == 0 || password.length == 0}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign Up with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        Github
      </Button>
    </div>
    <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
      <AlertDialogDescription>
        {alertDescription}
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogCancel onClick={alertButtonCallback}>Ok</AlertDialogCancel>
    </AlertDialogContent>
    </AlertDialog>
  )
}