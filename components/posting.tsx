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
import { Textarea } from "@/components/ui/textarea"
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"
 
const formSchema = z.object({

  job_title: z.string().min(5, {
    message: "Job Title must be atleast 5 characters."
  }),
  location_address_1: z.string(),
  location_address_2: z.string(),
  location_city: z.string(),
  location_state: z.string(),
  location_country: z.string(),
  location_pincode: z.string(),
  job_location: z.string(),
  
  job_type: z.string(),
  description: z.string().min(10, {
    message: "Description should contain atleast 10 characters."
  }),
  salary_range: z.string(),
  custom_questions: z.map(z.string().min(5, { message: "question key must contain atleast 5 characters" }), z.string(), {})
})
 
function getCountries(lang = 'en') {
  const A = 65
  const Z = 90
  const countryName = new Intl.DisplayNames([lang], { type: 'region' });
  const countries: Map<string, string> = new Map()
  for(let i=A; i<=Z; ++i) {
      for(let j=A; j<=Z; ++j) {
          let code = String.fromCharCode(i) + String.fromCharCode(j)
          let name = countryName.of(code)
          if (code !== name) {
              countries.set(code, name ?? "")
          }
      }
  }
  return countries
}

export function ProfileForm() {
const [alertVisible, setAlertVisible] = React.useState<boolean>(false);
const [alertTitle, setAlertTitle] = React.useState("");
const [alertDescription, setAlertDescription] = React.useState("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    let url = process.env.NEXT_PUBLIC_BACKEND_URL
    try {
      let result = await axios.post(`${url}/company/654e52dcd9a5b48d87c77e7f/posting`, {
        job_title: values.job_title,
        description: values.description,
        job_location: values.job_location,
        location: {
          address1: values.location_address_1,
          address2: values.location_address_2,
          city: values.location_city,
          state: values.location_state,
          country: values.location_country,
          pincode: values.location_pincode,
        },
        job_type: values.job_type,
        
      }, { withCredentials: true })
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
          name="job_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job title</FormLabel>
              <FormControl>
                <Input required placeholder="Software Engineer" {...field} />
              </FormControl>
              <FormDescription>
                This is the job position displayed to applicants.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea required placeholder="As a [Your Company Name] [Job Title], you will play a key role in [brief description of responsibilities]. We are looking for a motivated individual with expertise in [required skills], a passion for [relevant industry or technology], and a proven track record in [specific experience]. Join our dynamic team and contribute to [company mission or project]" {...field} />
              </FormControl>
              <FormDescription>
                This description would be shown to company applicants.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="job_location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Location</FormLabel>
              <FormControl>
                <Select required>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a job-type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Job Location</SelectLabel>
                      <SelectItem value="REMOTE">Remote</SelectItem>
                      <SelectItem value="ONSITE">On-site</SelectItem>
                      <SelectItem value="HYBRID">Hybrid</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>              
                </FormControl>
              <FormDescription>
                Type of job, such as remote, on-site or hybrid.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="job_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Type</FormLabel>
              <FormControl>
                <Select required>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a job-type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Job Type</SelectLabel>
                      <SelectItem value="FULLTIME">Full-time</SelectItem>
                      <SelectItem value="PARTTIME">Part-time</SelectItem>
                      <SelectItem value="INTERN">Internship</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>              
                </FormControl>
              <FormDescription>
                Type of job, such as remote, on-site or hybrid.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="location_address_1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 1</FormLabel>
              <FormControl>
                <Input required type="address" placeholder="Barclay Ave" {...field} />
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
          name="location_address_2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 2</FormLabel>
              <FormControl>
                <Input type="address" placeholder="7th Block" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location_city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Ballpark Ave." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location_state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Ballpark Ave." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location_country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Ballpark Ave." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location_pincode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pincode</FormLabel>
              <FormControl>
                <Input type="number" placeholder="01234" {...field} />
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