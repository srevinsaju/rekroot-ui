"use client";

import { ProfileForm } from "@/components/posting";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import React, { useEffect } from "react";




export default function Page({ params }: { params: { slug: string } }) {
    let [company, setCompany] = React.useState<any>(null);

    let [postings, setPostings] = React.useState<any>(null);
    let [isLoading, setIsLoading] = React.useState<boolean>(true);
    let [isPostingLoading, setIsPostingLoading] = React.useState<boolean>(true);
    async function getCompany(companyID: String) {
        let url = process.env.NEXT_PUBLIC_BACKEND_URL
        let token = window.sessionStorage.getItem("token")
        try {
            let companyResult = await axios.get(`${url}/company/${companyID}`, { 
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log("company:", companyResult.data.company);
            setCompany(companyResult.data.company);
            setIsLoading(false);
        } catch (err) {
            console.log(err)
    
        }
    }


    function CompanyNameComponent() {
        if (company) {
            return <>{company.companyName}</>
        } else {
            return <Skeleton className="h-6 w-48"></Skeleton> 
        }
    }

    useEffect(() => {
        getCompany(params.slug)
    }, [params.slug])


    return <>
    
    <div className="p-4 my-16 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold">New Application</h1>
        <h2 className="text-lg inline">Creating new application for <CompanyNameComponent /></h2>

        <div className="py-4">

            <ProfileForm company={company} />
        </div>
    </div>

    </>
}