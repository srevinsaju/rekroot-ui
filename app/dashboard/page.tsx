import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Dashboard - Rekroot",
    description: "Get rekt.",
}



function Ghost() {
    return <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        </div>
    </div>
}


export default function Dashboard() {
    return <>
    
    <div className="p-4 my-16 max-w-5xl mx-auto">
    <h1 className="text-4xl font-bold">Dashboard</h1>
        <div className="py-4">
            <Ghost></Ghost>
        </div>
        <Link href="/job/application">
            <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Application
            </Button>
        </Link>
    </div>
    </>
}