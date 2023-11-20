
"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios"
import { Globe, Mail, Share } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react"

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
    async function getPostings(companyID: String) {
        let url = process.env.NEXT_PUBLIC_BACKEND_URL
        let token = window.sessionStorage.getItem("token")
        try {
            let companyResult = await axios.get(`${url}/company/${companyID}/postings`, { 
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log("job postings:", companyResult.data.postings);
            setPostings(companyResult.data.postings);
            setIsPostingLoading(false);
        } catch (err) {
            console.log(err)
    
        }
    }


    useEffect(() => {
        getCompany(params.slug)
    }, [params.slug])
    

    function LoadingSkeleton() {
        return             <div className='flex gap-4'>
        <div className=''>

        <Skeleton className='h-32 w-32'/>
        </div>
        <div className=' spacy-y-2 col-span-3 grid items-center '>
        <Skeleton className=' h-12'/>

        <Skeleton className=' h-6 w-32'/>

        <Skeleton className=' h-6 w-[50%]'/>

        <Skeleton className=' h-6 w-[90%]'/>
        </div>
    </div>
    }

    function PostingsLoadingSkeleton() {
        return  <div className='grid gap-2'>
 

        <Skeleton className=' h-6 w-[70%]'/>

        <Skeleton className=' h-6 w-32'/>

        <Skeleton className=' h-6 w-[50%]'/>

        <Skeleton className=' h-6 w-[90%]'/>

        <Skeleton className=' h-6 w-[80%]'/>
        </div>
    }

    function Company() {
        return <div className='flex gap-4'>
        <div className=''>
        <img src="https://via.placeholder.com/150" className='h-32 w-32 object-cover rounded-lg'/>
        </div>
        <div className=' spacy-y-2 '>
        <h1 className='text-4xl font-bold'>{company.companyName}</h1>
        <p className='text-gray-500'>{company.description}</p>
        <p className='text-gray-500 text-xl'>{company.companyWebsite}</p>
        <p className='text-gray-500 pt-2'>{company.support_email}</p>
        </div>
    
    </div>
    }


    function Posting(posting: any) {
        return <>{posting}</>
    }

        

    function Postings() {
        let postingComponents: React.ReactNode[] = [];
        postings.every((posting: any) => {
            postingComponents.push(<Posting posting={posting}/>)
        })
        return <>
            {postingComponents}
        </>;
    }

    
    return <div className="p-4 my-16 max-w-5xl mx-auto">
  

        <div className='mt-4'>
            {isLoading ? <LoadingSkeleton /> : <Company/>}
        </div>
        <div className='mt-4 space-x-2'>
            <Link href={`mailto:${company?.support_email || "loading..."}`}>
            <Button>
                <Mail className="mr-2 w-4 h-4"></Mail>
            Contact</Button>
            </Link>
            <Button variant="secondary">
                <Share className="mr-2 w-4 h-4"></Share>
                Share
            </Button>
            <Link href={company?.companyWebsite || "loading..."}>
            <Button variant="secondary">
                <Globe className="mr-2 w-4 h-4"></Globe>
                Website
            </Button>
            </Link>
        </div>
        <div className='mt-4'>
            <div className="space-y-2">
            <h2 className='text-2xl font-bold'>Job Postings</h2>

            <div className='mt-4'>
            {isPostingLoading ? <PostingsLoadingSkeleton /> : <Postings/>}
        </div>
            </div>
        </div>
        </div>

}