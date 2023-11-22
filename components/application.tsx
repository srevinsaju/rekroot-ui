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
import { format } from "date-fns"
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
import { Textarea } from "./ui/textarea"
import { Checkbox } from "./ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "./ui/calendar"
import { cn } from "@/lib/utils"
 



// create formSchema from 
// the following schema 
/* 
 const JobApplicaionSchema = new Schema({
  _id: { type: String, required: true },
  applicantName: { type: String, required: true, default: "" },
  applicantID: { type: String, required: true },
  email: { type: String, required: true },
  phone: {type: Number, required: true },
  education: [
    {
      degree: { type: String, required: true }, 
      institution: { type: String, required: true },
      graduationDate: {type: Number, required: true },
      cgpa: {type: Number, required: true }
    }
  ],
  workExperience: [
    {
      company: { type: String, required: true },
      position: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true},
      yearsOfExp: { type: Number, required: true },
      responsibilities: { type: String, required: true }
    }
  ],
  resume: {type: String, required: true },
  coverLetter: {type: String, required: true },
  linkedinProfile: {type: String, required: true },
  githubProfile: {type: String, required: true },
  portfolio: {type: String, required: true },
  skills: [{ type:String, required: true }],
  currLoc: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true }         
  },
  shiftToNew: { type:Boolean, required: true },
  slot: { type: Date, required: true },
  references: [
    {
      name: { type: String, required: true }, 
      relationship: { type: String, required: true },
      contact: {type: Number, required: true },
    }
  ],
  customQuestions: {
    question1: { type: String, required: true },
    question2: { type: String, required: true },
    question3: { type: String, required: true },
  },
  status: { type: String, required: true, enum: ["APPROVED", "PENDING", "REJECTED"], default: "PENDING" },
  jobPost: { type: String, required: true },
  company: { type: String, required: true }
});
  */

const formSchema = z.object({
  applicantName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.number().optional(),
  education: z.string().optional(),
  // z.array(z.object({
  //   degree: z.string(),
  //   institution: z.string(),
  //   graduationDate: z.date(),
  //   cgpa: z.number()
  // })).optional(),

  workExperience: z.string().optional(),
  // z.array(z.object({
  //   company: z.string(),
  //   position: z.string(),
  //   startDate: z.date(),
  //   endDate: z.date(),
  //   yearsOfExp: z.number(),
  //   responsibilities: z.string()
  // })).optional(),

  resume: z.string().optional(),
  coverLetter: z.string().optional(),
  linkedinProfile: z.string().optional(),
  githubProfile: z.string().optional(),
  portfolio: z.string().optional(),
  skills: z.string().optional(),
  currLoc: z.object({
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional()
  }),
  shiftToNew: z.boolean(),
  slot: z.date(),
  references: z.string().optional()
  // z.array(z.object({
  //   name: z.string(),
  //   relationship: z.string(),
  //   contact: z.number()
  // })).optional()
})
 
export function ProfileForm({ posting, company} : { posting: string, company: string}) {
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
        applicantName: name,
        email: email,
        shiftToNew: false,
        slot: new Date(),
        phone: 0,
        education: "",
        workExperience: "",
        resume: "",
        coverLetter: "",
        linkedinProfile: "",
        githubProfile: "",
        portfolio: "",
        skills: "",
        currLoc: {
          city: "",
          state: "",
          country: ""
        },
        references: "",
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
      let result = await axios.post(`${url}/company/${company}/posting/${posting}/application`, values, { headers: {
      "Authorization": `Bearer ${token}`
    }})
      console.log(result)
      redirect("/dashboard")
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
          name="applicantName"
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

        <FormField control={form.control} name="email" disabled render={({ field }) => (
            <FormItem><FormLabel>Email</FormLabel><FormControl><Input disabled placeholder="email@emai.com" type="email" {...field} /></FormControl>
              <FormDescription>This is your email which will be used to contact you.</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="+91 ..." type="text" {...field} /></FormControl>
              <FormDescription>This is your phone number which will be used to contact you.</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="education" render={({ field }) => (
            <FormItem><FormLabel>Education</FormLabel><FormControl>
              <Textarea placeholder="Enter your education." {...field} />
            </FormControl>
              <FormDescription>What is your highest education?</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="workExperience" render={({ field }) => (
            <FormItem><FormLabel>Work Experience</FormLabel><FormControl><Textarea placeholder="Enter places and positions that you have worked at." {...field} /></FormControl>
              <FormDescription>What is your work experience?</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="resume" render={({ field }) => (
            <FormItem><FormLabel>Resume</FormLabel><FormControl><Textarea placeholder="Include a text version of your resume." {...field} /></FormControl>
              <FormDescription>Upload your resume.</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="coverLetter" render={({ field }) => (
            <FormItem><FormLabel>Cover Letter</FormLabel><FormControl><Input placeholder="If required, include cover letter." {...field} /></FormControl>
              <FormDescription>Upload your cover letter.</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="linkedinProfile" render={({ field }) => (
            <FormItem><FormLabel>LinkedIn Profile</FormLabel><FormControl><Input placeholder="@johndoe" {...field} /></FormControl>
              <FormDescription>What is your LinkedIn profile?</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="githubProfile" render={({ field }) => (
            <FormItem><FormLabel>Github Profile</FormLabel><FormControl><Input placeholder="@johndoe" {...field} /></FormControl>
              <FormDescription>What is your Github profile?</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="portfolio" render={({ field }) => (
            <FormItem><FormLabel>Portfolio</FormLabel><FormControl><Input placeholder="https://example.com" {...field} /></FormControl>
              <FormDescription>Your portfolio link if you have one.</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="skills" render={({ field }) => (
            <FormItem><FormLabel>Skills</FormLabel><FormControl><Textarea placeholder="Python" {...field} /></FormControl>
              <FormDescription>What are your skills?</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="currLoc.city" render={({ field }) => (
            <FormItem><FormLabel>Current City</FormLabel><FormControl><Input placeholder="City" {...field} /></FormControl>
              <FormDescription>What is your current location?</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="currLoc.state" render={({ field }) => (
            <FormItem><FormLabel>Current State</FormLabel><FormControl><Input placeholder="State" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="currLoc.country" render={({ field }) => (
            <FormItem><FormLabel>Current Country</FormLabel><FormControl><Input placeholder="Country" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="shiftToNew" render={({ field }) => (  
            <FormItem><FormLabel>Shift to New Location</FormLabel><FormControl>
              <div><Checkbox checked={field.value} className="mt-2" /></div></FormControl>
              <FormDescription>Are you willing to shift to a new location?</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="slot" render={({ field }) => (
           <FormItem className="flex flex-col">
           <FormLabel>Interview Slot</FormLabel>
           <Popover>
             <PopoverTrigger asChild>
               <FormControl>
                 <Button
                   variant={"outline"}
                   className={cn(
                     "w-[240px] pl-3 text-left font-normal",
                     !field.value && "text-muted-foreground"
                   )}
                 >
                   {field.value ? (
                     format(field.value, "PPP")
                   ) : (
                     <span>Pick a date</span>
                   )}
                   <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                 </Button>
               </FormControl>
             </PopoverTrigger>
             <PopoverContent className="w-auto p-0" align="start">
               <Calendar
                 mode="single"
                 selected={field.value}
                 onSelect={field.onChange}
                 disabled={(date: Date) =>
                   date < new Date()
                 }
                 initialFocus
               />
             </PopoverContent>
           </Popover>
           <FormDescription>
             When would you like to have your interview?
           </FormDescription>
           <FormMessage />
         </FormItem>
          )} />
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