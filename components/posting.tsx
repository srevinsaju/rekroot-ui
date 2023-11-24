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

  location_state: z.string(),
  location_country: z.string(),
  job_location: z.string(),
  job_type: z.string(),
  description: z.string().min(10, {
    message: "Description should contain atleast 10 characters."
  }),

  salary_range: z.string(),
  customQuestions: z.object({
    question1: z.string().optional(),
    question2: z.string().optional(),
    question3: z.string().optional(),
  }).optional(),
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

export function ProfileForm({company: company}: { company: any}) {
const [alertVisible, setAlertVisible] = React.useState<boolean>(false);
const [alertTitle, setAlertTitle] = React.useState("");
const [alertDescription, setAlertDescription] = React.useState("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customQuestions: {
        question1: "Test Question 1",
        question2: "Test Question 2",
        question3: "Test Question 3",
      },
      job_title: "",
      location_state: "",
      location_country: "",
      job_location: "",
      job_type: "",
      description: "",
      salary_range: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Hello");
    setIsLoading(true);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    let url = process.env.NEXT_PUBLIC_BACKEND_URL
    try {
      let result = await axios.post(`${url}/company/${company._id}/posting`, {
        job_title: values.job_title,
        description: values.description,
        location: {
          // address1: values.location_address_1,
          // address2: values.location_address_2,
          // city: values.location_city,
          state: values.location_state,
          country: values.location_country,
          // pincode: values.location_pincode,
        },
        job_type: values.job_location,
        salary_range: values.salary_range,
        customQuestions: values.customQuestions,
      }, {
        headers: {
          "Authorization": `Bearer ${window.sessionStorage.getItem("token")}`
        }
      })
      console.log(result)
      window.location.href = "my/company/" + company._id
    } catch (err: any) {
        console.log(err)
        setAlertTitle(err?.response?.data?.message || "Something went wrong.")
        setAlertDescription(err?.response?.data?.description || "That's all we know.")
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
                <Textarea required defaultValue={`As a ${company?.companyName || "[Company Name]"} [Job Title], you will play a key role in [brief description of responsibilities]. We are looking for a motivated individual with expertise in [required skills], a passion for [relevant industry or technology], and a proven track record in [specific experience]. Join our dynamic team and contribute to [company mission or project]`} {...field} />
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
                <Select            disabled={isLoading}
          onValueChange={field.onChange}
          {...field}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a job-type"/>
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
                <Select  disabled={isLoading}
          onValueChange={field.onChange}
           {...field}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a job-type"/>
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
          name="location_state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input placeholder="State" {...field} />
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
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder="Country" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="salary_range"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salary Range</FormLabel>
              <FormControl>
                <Input placeholder="Salary Range" {...field} />
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