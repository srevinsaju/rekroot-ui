"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { redirect } from "next/navigation"
import { Icons } from "./icons"
import React from "react"
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
 
const formSchema = z.object({
  fullname: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  username: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(4, { message: "Password must be atleast 8 characters" }),
  phoneNumber: z.string().min(8, { message: "Invalid phone number, expecting atleast 8 characters"}),
  address: z.string(),
  linkedin: z.string(),
})
 
export function ProfileForm() {
  const [alertVisible, setAlertVisible] = React.useState<boolean>(false);
  const [alertTitle, setAlertTitle] = React.useState("");
  const [alertDescription, setAlertDescription] = React.useState("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  // 1. Define your form.

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: async () => {
      let email = "loading..."
      let name = "Loading..."
      let url = process.env.NEXT_PUBLIC_BACKEND_URL
      let token = window.sessionStorage.getItem("token")
      try {
        let result = await axios.get(`${url}/me`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        email = result.data.email
        name = result.data.fullName || result.data.email.split("@")[0]
        console.log(result)
      } catch (err: any) {
          console.log(err)
      } 
      return {
        fullname: name,
        username: email,
        password: "",
        linkedin: "",
        address: "",
        phoneNumber: "",
      }
    }
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    let url = process.env.NEXT_PUBLIC_BACKEND_URL
    let token = window.sessionStorage.getItem("token")
    try {
      let result = await axios.post(`${url}/profile-edit`, {
        email: values.username, 
        password: values.password,
        phoneNo: values.phoneNumber,
        location: values.address,
        linkedin: values.linkedin,
        fullName: values.username,
        designation: "",
    }, { headers: {
      "Authorization": `Bearer ${token}`
    }})
      console.log(result)
      redirect("/dashboard")
    } catch (err: any) {
        console.log(err)
        setAlertTitle(err?.response?.message || "Something went wrong.")
        setAlertDescription(err?.response?.description || "That's all we know.")
        setAlertVisible(true)
    }
    setIsLoading(false);
  }

  return (

    <AlertDialog open={alertVisible}  onOpenChange={setAlertVisible}>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="johndoe@acme.com" {...field} />
              </FormControl>
              <FormDescription>
                This is your email address 
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormDescription>
                Password is required.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input placeholder="+91 123456789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Ballpark Ave." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="linkedin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn Profile</FormLabel>
              <FormControl>
                <Input placeholder="@johndoe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : ("")}{" "}
        
        Submit</Button>
      </form>
    </Form>
    <AlertDialogContent>
    <AlertDialogHeader>
        <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
        <AlertDialogDescription>
        {alertDescription}
        </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogCancel>Ok</AlertDialogCancel>
    </AlertDialogContent>
    </AlertDialog>
  )

}