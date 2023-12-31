
"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios"
import { Eye, Globe, Mail, Pencil, Share, Trash } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react"


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

export default function Page({ params }: { params: { slug: string } }) {

    let [company, setCompany] = React.useState<any>(null);

    let [postings, setPostings] = React.useState<any>(null);
    let [isLoading, setIsLoading] = React.useState<boolean>(true);
    let [isPostingLoading, setIsPostingLoading] = React.useState<boolean>(true);

    const [alertVisible, setAlertVisible] = React.useState<boolean>(false);
    const [alertTitle, setAlertTitle] = React.useState("");
    const [alertDescription, setAlertDescription] = React.useState("");

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

            await getPostings(params.slug)

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
        } catch (err: any) {
            setAlertTitle(err?.response?.data?.message || "Something went wrong.")
            setAlertDescription(err?.response?.data?.description || "That's all we know.")
            setAlertVisible(true)
            console.log(err)
        }
    }


    useEffect(() => {
        Promise.all([
            getCompany(params.slug),
        ])
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


    function Posting({p, company}: {p: any, company: any}) {

        const [isPostingLoading, setIsPostingLoading] = React.useState<boolean>(true);
        const [posting, setPosting] = React.useState<any>(null);




        React.useEffect(() => {

            async function getPostingMetadata(posting: any) {
                let url = process.env.NEXT_PUBLIC_BACKEND_URL
                let token = window.sessionStorage.getItem("token")
                try {
                    let companyResult = await axios.get(`${url}/company/${company._id}/posting/${p}`, { 
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    })
                    console.log("job postings:", companyResult.data);
                    setPosting(companyResult.data.jobPosting);
                    setIsPostingLoading(false);
                } catch (err) {
                    console.log(err)
            
                }
            }

            getPostingMetadata(p)
    
        }, [p, company._id])


        if (isPostingLoading) {
            return <PostingsLoadingSkeleton/>
        }

        async function deletePosting() {
            let url = process.env.NEXT_PUBLIC_BACKEND_URL
            let token = window.sessionStorage.getItem("token")
            try {
                let companyResult = await axios.delete(`${url}/company/${company._id}/posting/${p}`, { 
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                console.log("job postings:", companyResult.data);
                setPosting(companyResult.data.jobPosting);
                setIsPostingLoading(false);
                window.location.href = `/my/company/${company._id}`
            } catch (err: any) {
                console.log(err)
                setAlertTitle(err?.response?.data?.message || "Something went wrong.")
                setAlertDescription(err?.response?.data?.description || err?.response?.data?.error || "That's all we know.")
                setAlertVisible(true)
        
            }
        }

        return <div className='flex gap-4'>
        <div className=' spacy-y-2 '>
        <h1 className='text-xl font-bold'>{posting.job_title}</h1>
        <p className='text-gray-500'>{posting.location.state}, {posting.location.country}</p>
        <p>{posting.description}</p>

        <Link href={`/my/company/${company._id}/postings/${posting._id}/applicants`}> <Button className="mt-2"> 
           <Eye className="w-4 h-4 mr-2"></Eye>  View Applicants </Button> </Link>
        <Link href={`/my/company/${company._id}/postings/${posting._id}/edit`}> <Button variant="secondary" className="mt-2"> 
        <Pencil className="w-4 h-4 mr-2"></Pencil> 
        Edit </Button> </Link>

        <Button onClick={deletePosting} variant="destructive" className="mt-2">
                <Trash className="mr-2 w-4 h-4"></Trash>
                Delete
            </Button>
        </div>
        </div>
    }

        

    function Postings({company}: {company: any}) {
        let postingComponents: React.ReactNode[] = [];
        postings.every((posting: any) => {
            postingComponents.push(<Posting key={posting} p={posting} company={company}/>)
        })
        return <>
            {postingComponents}
        </>;
    }

    
    return  <AlertDialog open={alertVisible}  onOpenChange={setAlertVisible}>
        <div className="p-4 my-16 max-w-5xl mx-auto">
  

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
            <Link href={`/my/company/${company?._id}/edit`}> <Button variant="secondary" className="mt-2"> 
        <Pencil className="w-4 h-4 mr-2"></Pencil> 
        Edit </Button> </Link>

        </div>
        <div className='mt-4'>
            <div className="space-y-2">
            <h2 className='text-2xl font-bold mb-4'>Job Postings</h2>

            <div className='mt-4'>
            {isPostingLoading ? <PostingsLoadingSkeleton /> : <Postings company={company}/>}
        </div>
            </div>
        </div>
        </div>

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

}