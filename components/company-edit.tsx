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
 

  /* {
  "address": {
    "street": "Dino Street",
    "city": "Dino City",
    "pincode": "4313131"
  },
  "_id": "aaaa0739-d87a-42bf-b785-e03a74b7ef69",
  "companyName": "Dino Company",
  "companyWebsite": "https://dino.com",
  "logo": "",
  "support_email": "dino@dino.com",
  "createdBy": "3aed5961-4a99-4dcf-8ddc-6002429b7f69",
  "__v": 0
}
*/
const formSchema = z.object({
    address: z.object({
        street: z.string(),
        city: z.string(),
        pincode: z.string(),
    }),
    companyName: z.string(),
    companyWebsite: z.string().url(),
    logo: z.string().optional(),
    support_email: z.string(),
})
    
 
export function CompanyEdit({ company }: { company: string }) {
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
        let result = await axios.get(`${url}/company/${company}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        
        // email = result.data.email
        // name = result.data.fullName || result.data.email.split("@")[0]
        console.log(result)
        return result.data.company;
      } catch (err: any) {
          console.log(err)
      } 
      
        return {
            address: {
                street: "",
                city: "",
                pincode: "",
            },
            companyName: "",
            companyWebsite: "",
            logo: "",
            support_email: "",
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
      let result = await axios.patch(`${url}/company/${company}`, values, { headers: {
      "Authorization": `Bearer ${token}`
    }})
      console.log(result)
      window.location.href = "/my/companies"
    } catch (err: any) {
        console.log(err)
        setAlertTitle(err?.response?.message || "Something went wrong.")
        setAlertDescription(err?.response?.description || err?.response?.error || "That's all we know.")
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
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="ACME Inc." {...field} />
              </FormControl>
              <FormDescription>
                This is the public display name of the company.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companyWebsite"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="url" placeholder="acme.com" {...field} />
              </FormControl>
              <FormDescription>
                This is the company website. 
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="support_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Support email</FormLabel>
              <FormControl>
                <Input placeholder="support@acme.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address.street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street</FormLabel>
              <FormControl>
                <Input placeholder="123 Dino Street" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address.city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Dino City" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}

        />

        <FormField
          control={form.control}
          name="address.pincode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pincode</FormLabel>
              <FormControl>
                <Input placeholder="123456" {...field} />
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