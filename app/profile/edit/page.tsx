import { ProfileForm } from "@/components/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "New Job Application - Rekroot",
    description: "Get rekt.",
}



export default function Dashboard() {
    return <>
    
    <div className="p-4 my-16 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold">Edit Profile</h1>

        <div className="py-4">

            <ProfileForm />
        </div>
    </div>

    </>
}