"use client";
import { ApplicationStatus, RecentApplications } from "@/components/recent-applications";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form"
import React, { useEffect } from "react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

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

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/icons";
import axios from "axios";
 
const companyCreateFormSchema = z.object({
    companyName: z.string().min(3).max(255),
    companyWebsite: z.string().url(),
    address: z.object({
        street: z.string().min(3).max(255),
        city: z.string().min(3).max(255),
        pincode: z.string().min(3).max(255),
    }),
    support_email: z.string().email(),
})


function Ghost() {
    return <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        </div>
    </div>
}

function Me() {
    return <>
        <h2>Hello {}</h2>
    </>
}

function Recruiter() {
    
}


function CreateCompany() {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [alertVisible, setAlertVisible] = React.useState<boolean>(false);
    const [alertTitle, setAlertTitle] = React.useState("");
    const [alertDescription, setAlertDescription] = React.useState("");

    const form = useForm<z.infer<typeof companyCreateFormSchema>>({
        resolver: zodResolver(companyCreateFormSchema),
        defaultValues: {
        },
      })
  

    async function onSubmit(values: z.infer<typeof companyCreateFormSchema>) {

        setIsLoading(true);
        console.log(values)

        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        let url = process.env.NEXT_PUBLIC_BACKEND_URL
        let token = window.sessionStorage.getItem("token")
        try {
        let result = await axios.post(`${url}/company`, values, { 
            headers: {
                 "Authorization": `Bearer ${token}`
            }
        })
        console.log(result)
        window.location.href = "/my/companies"
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
        <Dialog>
            <DialogTrigger asChild>
                
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Join
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                <DialogTitle className="text-2xl">Create a company</DialogTitle>
                <DialogDescription>
                Adding your company to Rekroot opens doors to a seamless hiring experience. 
                By providing essential company information, you&apos;re unlocking a world of streamlined recruitment. 
                Enjoy intuitive tools, effortless management, and find your ideal candidates effortlessly. 
                Let&apos;s build your recruitment success together!
<br></br> 
                    Fill in the details below to get started.
                </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField control={form.control} name="companyName" 
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Company Name" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the public name of your company.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )} />

                        <div className="flex flex-row space-x-4">
                        <FormField control={form.control} name="companyWebsite" 
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                                <Input placeholder="Website" {...field} />
                            </FormControl>
                            <FormDescription>
                                This website will be displayed on your company&apos;s profile.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField control={form.control} name="support_email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Support Email</FormLabel>
                            <FormControl>
                                <Input placeholder="company@acme.sh"  type="email" {...field} />
                            </FormControl>
                            <FormDescription>
                                Required for communication from rekroot team and candidates.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        </div>
                        <div className="flex flex-row space-x-4">
                        <FormField control={form.control} name="address.street" 
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Street</FormLabel>
                            <FormControl>
                                <Input className="w-full" placeholder="Street" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField control={form.control} name="address.city"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                                <Input placeholder="City" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField control={form.control} name="address.pincode"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Pincode</FormLabel>
                            <FormControl>
                                <Input placeholder="Pincode" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                            </div>
                        
                        
                        {/* <FormField control={form.control} name="logo"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Logo</FormLabel>
                            <FormControl>
                                <Input placeholder="Logo" type="file" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        /> */}
                        <DialogFooter>
                            <div className="text-right">
                            <p className="text-foreground-muted text-xs">By continuing, you agree to rekroot&apos;s terms and conditions.</p>
                            
                            <Button type="submit" className="mt-2" >
                                {isLoading ? (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                ) : ("")}{" "}
                                
                                Join</Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>

                
            </DialogContent>
        </Dialog>
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

export default function Dashboard() {
    useEffect(() => {
        if (!window.sessionStorage.getItem("token")) {
            redirect("/login")
        }
    })

    return <>
    
    <div className="p-4 my-16 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold">Dashboard</h1>


        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-8 pb-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium">
                    Join.
                </CardTitle>

                <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                </CardHeader>
                <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                Elevate your company&apos;s hiring experience by adding it to Rekroot. 
                Join now to access powerful tools and streamline your recruitment process effortlessly.
                </p>
                
                <div className="flex gap-2">
                <CreateCompany ></CreateCompany>
                <Link href="/my/companies">
                <Button className="" variant="secondary">
                    <Eye className="w-4 h-4 mr-2"></Eye>
                     View</Button>
                     </Link>
                </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium">
                    Recruit.
                </CardTitle>

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                </CardHeader>
                <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                Craft compelling job posts effortlessly with Rekroot&apos;s Recruit feature. Simplify your hiring process and find the perfect candidates.
                Create multiple postings and see them at one spot.
                </p>
                
                
                <Link href="/my/companies" className="mt-4">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Job Posting
                    </Button>
                </Link>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium">
                    Apply.
                </CardTitle>

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                </CardHeader>
                <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                Job seekers, your opportunity awaits! Browse through exciting job openings and apply seamlessly with Rekroot&apos;s Apply feature. Your next career move is just a click away.
                </p>
                
                
                <Link href="/companies" className="mt-4">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Apply
                    </Button>
                </Link>
                </CardContent>
            </Card>
 
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">

        <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">
                    Happening now.
                </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
        <RecentApplications />
        </CardContent>
        </Card>

        <div className="space-y-4">
            <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="font-medium text-sm">
                        Companies
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mb-4">Apply to top companies with rekroot</p>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="flex gap-2">
                <Link href="/companies">
                    <Button>
                        <Eye className="mr-2 h-4 w-4" />
                         View all companies</Button>

                </Link>
                <Link href="/my/companies">
                    <Button variant="secondary">
                        <Eye className="mr-2 h-4 w-4" />
                         View your companies</Button>
                </Link>
                </div>
            </CardContent>
            </Card>
            <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="font-medium text-sm">
                        Applications
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mb-4">See your current job applications</p>
            </CardHeader>
            <CardContent className="pt-4">
            <div className="flex gap-2 mb-6">
                <Link href="/my/postings">
                    <Button variant="secondary">
                        <Eye className="mr-2 h-4 w-4" />
                         View your postings</Button>

                </Link>
                <Link href="/my/applications">
                    <Button variant="secondary">
                        <Eye className="mr-2 h-4 w-4" />
                         View your applications</Button>
                </Link>
                </div>

                <div>
                    <ApplicationStatus/>
                </div>

            </CardContent>
            </Card>
        </div>
        </div>

    </div>
    </>
}