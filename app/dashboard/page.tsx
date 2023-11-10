"use client";
import { RecentApplications } from "@/components/recent-applications";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect } from "react";



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
    return (
        <Dialog>
            <DialogTrigger asChild>
                
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Join
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle className="text-2xl">Create a company</DialogTitle>
                <DialogDescription>
                Adding your company to Rekroot opens doors to a seamless hiring experience. 
                By providing essential company information, you&apos;re unlocking a world of streamlined recruitment. 
                Enjoy intuitive tools, effortless management, and find your ideal candidates effortlessly. 
                Let&apos;s build your recruitment success together!

                    Fill in the details below to get started.
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                    Company Name
                    </Label>
                    <Input
                    id="name"
                    className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                    Support Email
                    </Label>
                    <Input
                    id="email"
                    type="email"
                    className="col-span-3"
                    />
                </div>
                </div>

                <DialogFooter>
                    <p className="text-foreground-muted text-xs">By continuing, you agree to rekroot&apos;s terms and conditions.</p>
                    <Button type="submit">Join</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
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
                
                <CreateCompany ></CreateCompany>
                
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
                
                
                <Link href="/job/application" className="mt-4">
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
                
                
                <Link href="/job/application" className="mt-4">
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
        </div>

    </div>
    </>
}