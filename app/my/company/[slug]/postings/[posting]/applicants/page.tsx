
"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios"
import { Check, CircleSlashed, Globe, Mail, Share } from "lucide-react";
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
import { Card } from "@/components/ui/card";
import moment from "moment";
import { Badge } from "@/components/ui/badge";

export default function Page({ params }: { params: { slug: string, posting: string } }) {

    let [company, setCompany] = React.useState<any>(null);

    let [postings, setPostings] = React.useState<any>(null);
    let [applications, setApplications] = React.useState<any>(null);
    let [isLoading, setIsLoading] = React.useState<boolean>(true);
    let [isPostingLoading, setIsPostingLoading] = React.useState<boolean>(true);
    let [isApplicationLoading, setIsApplicationloading] = React.useState<boolean>(true);
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

            await getPostings(params.slug, params.posting)
            setIsLoading(false);
        } catch (err) {
            console.log(err)
    
        }

    }


    async function getPostings(companyID: String, posting: string) {
        let url = process.env.NEXT_PUBLIC_BACKEND_URL
        let token = window.sessionStorage.getItem("token")
        try {
            let companyResult = await axios.get(`${url}/company/${companyID}/posting/${posting}`, { 
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log("job posting:", companyResult.data.jobPosting);
            setPostings(companyResult.data.jobPosting);
            setIsPostingLoading(false);
        } catch (err: any) {
            setAlertTitle(err?.response?.data?.message || "Something went wrong.")
            setAlertDescription(err?.response?.data?.description || "That's all we know.")
            setAlertVisible(true)
            console.log(err)
        }
    }

    
    async function getApplications(slug: string, posting: string) {
        let url = process.env.NEXT_PUBLIC_BACKEND_URL
        let token = window.sessionStorage.getItem("token")
        try {
            let companyResult = await axios.get(`${url}/company/${slug}/posting/${posting}/application`, { 
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log("job applications:", companyResult.data.applications);
            setApplications(companyResult.data.applications);
            setIsApplicationloading(false);
        } catch (err: any) {
            setAlertTitle(err?.response?.data?.message || "Something went wrong.")
            setAlertDescription(err?.response?.data?.description || "That's all we know.")
            setAlertVisible(true)
            console.log(err)
        }
    }

    useEffect(() => {
        Promise.all([
            getApplications(params.slug, params.posting),
            getCompany(params.slug),
        ])
    }, [params.slug, params.posting])
    

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

        <div className=' spacy-y-2 '>
        <h1 className='text font-bold'>{company.companyName}</h1>
        </div>
    
    </div>
    }


    function Application({application}: {application: string}) {
        
        const [isApplicationLoading, setIsApplicationLoading] = React.useState<boolean>(true);
        const [applicationData, setApplicationData] = React.useState<any>(null);
        const [status, setStatus] = React.useState<any>(null);
        async function acceptApplicant() {
            let url = process.env.NEXT_PUBLIC_BACKEND_URL
            let token = window.sessionStorage.getItem("token")
            try {
                let companyResult = await axios.post(`${url}/company/${params.slug}/posting/${params.posting}/application/${application}/status/APPROVED`, {}, { 
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                setStatus("APPROVED")
                console.log(applicationData)
            } catch (err: any) {
                setAlertTitle(err?.response?.data?.message || "Something went wrong.")
                setAlertDescription(err?.response?.data?.description || "That's all we know.")
                setAlertVisible(true)
                console.log(err)
            }
        }

        async function rejectApplicant() {
            let url = process.env.NEXT_PUBLIC_BACKEND_URL
            let token = window.sessionStorage.getItem("token")
            try {
                let companyResult = await axios.post(`${url}/company/${params.slug}/posting/${params.posting}/application/${application}/status/REJECTED`, {}, { 
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                setStatus("REJECTED")
            } catch (err: any) {
                console.log(err)
                setAlertTitle(err?.response?.data?.message || "Something went wrong.")
                setAlertDescription(err?.response?.data?.description || "That's all we know.")
                setAlertVisible(true)
            }
        }

        React.useEffect(() => {
            console.log("SSSS")

            async function getApplicationMetadata(application: any) {
                let url = process.env.NEXT_PUBLIC_BACKEND_URL
                let token = window.sessionStorage.getItem("token")
                try {
                    let companyResult = await axios.get(`${url}/company/${params.slug}/posting/${params.posting}/application/${application}`, { 
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    })
                    console.log("job applications:", companyResult.data);
                    setApplicationData(companyResult.data.application);
                    setStatus(companyResult.data.application.status)
                    setIsApplicationLoading(false);
                } catch (err) {
                    console.log(err)
            
                }
            }

            getApplicationMetadata(application)
    
        }, [application])

        if (isApplicationLoading) {
            return <div className='mt-4'>
            <div className='space-y-2 '>
           <Skeleton className=' h-6 w-[70%]'/>
            <Skeleton className=' h-6 w-32'/>
            <Skeleton className=' h-6 w-[50%]'/>

            </div>
            </div>
        }

        console.log(applicationData)

        /**
         * {
  "currLoc": {
    "city": "Chennai",
    "state": "Tamil Nadu",
    "country": "India"
  },
  "_id": "392806c0-8f6b-4c3e-8a5c-50a96553c3b3",
  "applicantName": "John Doe",
  "applicantID": "75ff2fa7-b1d5-4a9d-a49b-d324b8ec7508",
  "email": "johndoe@rekroot.io",
  "phone": "",
  "education": [
    {
      "degree": "Bachelor of Engineering",
      "institution": "Vellore Institute of Technology",
      "graduationDate": "2023-11-14T21:00:00.000Z",
      "cgpa": 10,
      "_id": "655fbb93814d008f0f6cc91e"
    }
  ],
  "workExperience": [],
  "resume": "",
  "coverLetter": "",
  "linkedinProfile": "",
  "githubProfile": "",
  "portfolio": "",
  "skills": [],
  "shiftToNew": false,
  "slot": "2023-11-23T20:51:13.708Z",
  "references": [],
  "status": "PENDING",
  "jobPost": "83b8549e-5423-4202-af9d-120cfa76e284",
  "company": "aaaa0739-d87a-42bf-b785-e03a74b7ef69",
  "__v": 0
}
         */

        return <div className='mt-6'>
           
        <Card className="p-4"><h1 className='text-xl font-bold'>{applicationData?.applicantName}</h1>
        <Badge className='mt-2' variant={status == "PENDING" ? "secondary" : status == "APPROVED" ? "default" : "destructive"}>{status}</Badge>
        <div className="mt-4">
        <p className=''>{applicationData?.email}</p>
        <p className=''>{applicationData?.phone}</p>
        <p className=''>{applicationData?.currLoc?.city}, {applicationData?.currLoc?.state}, {applicationData?.currLoc?.country}</p>
        <p className='text-gray-500'>{applicationData?.jobPost}</p>
        <p className='text-gray-500'>{applicationData?.slot}</p>
        <p className='text-gray-500'>{applicationData?.shiftToNew}</p>

        </div>
        <div className="mt-4">

        <h3 className='text-lg font-bold mt-2'>Resume</h3>
        <p className='text-gray-500'>{applicationData?.resume || "No resume provided."}</p>
        <h3 className='text-lg font-bold mt-2'>Cover Letter</h3>
        <p className='text-gray-500'>{applicationData?.coverLetter || "No cover letter provided."}</p>
        
        
        <p className='text-gray-500'>{applicationData?.linkedinProfile}</p>
        <p className='text-gray-500'>{applicationData?.githubProfile}</p>
        <p className='text-gray-500'>{applicationData?.portfolio}</p>

        <h3 className='text-lg font-bold mt-2'>Skills</h3>
        {applicationData?.skills?.length == 0 && <p className='text-gray-500'>No skills provided.</p>}
        {applicationData?.skills?.map((skill: any) => {
            return <Badge className='mt-2' color="blue">{skill}</Badge>
        })}
        
        <h3 className='text-lg font-bold mt-2'>References</h3>
        {applicationData?.references?.length == 0 && <p className='text-gray-500'>No references provided.</p>}
        <p className='text-gray-500'>{applicationData?.references || "No references provided."}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="mt-4">
        <h2 className='text-lg font-bold'>Work Experience</h2>
        {applicationData?.workExperience?.map((workExperience: any) => {
            return <div className='mt-4'>
                <p className=''>{workExperience.company}</p>
                <p className=''>{workExperience.position}</p>
                <p className=''>{workExperience.startDate}</p>
                <p className=''>{workExperience.endDate}</p>
                <p className=''>{workExperience.description}</p>
            </div>
        })}
        {applicationData?.workExperience?.length == 0 && <p className='text-gray-500'>No work experience provided.</p>}
        </div>
        
        <div className="mt-4">
        <h2 className='text-lg font-bold'>Education</h2>
        {applicationData?.education?.map((education: any) => {
            return <div className='mt-4'>
                <p className='font-bold text-lg'>{education.degree}</p>
                <p className=''>{education.institution}</p>
                <p className=''>Graduation: {moment(education.graduationDate).fromNow()}</p>
                <p className=''>CGPA: {education.cgpa}</p>
            </div>
        })}
        {applicationData?.education?.length == 0 && <p className='text-gray-500'>No education provided.</p>}
        </div>
        </div>
        <div className="space-x-2">
        <Button onClick={acceptApplicant} className="mt-4" variant="secondary">
            <Check className="w-4 h-4 mr-2"></Check> Accept</Button>
        <Button onClick={rejectApplicant} className="mt-4" variant="destructive">
            <CircleSlashed className="w-4 h-4 mr-2"></CircleSlashed> Reject </Button>
       
        </div>
        
        </Card>
   
        </div>
    }



    function Posting({p, company}: {p: string, company: any}) {

        const [isPostingLoading, setIsPostingLoading] = React.useState<boolean>(true);
        const [posting, setPosting] = React.useState<any>(null);




        React.useEffect(() => {
            console.log("SSSS")

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

        return <div><div className='flex gap-4'>
        <div className=' spacy-y-2 '>
        <h1 className='text-xl font-bold'>{posting.job_title}</h1>
        <p className='text-gray-500'>{posting.location.state}, {posting.location.country}</p>
        <p>{posting.description}</p>

        </div>
        </div>
        
        <div className="mt-4">
            <h2 className="text-xl font-bold">Applications</h2>


            {applications.map((application: any) => {
                return <Application key={application} application={application}/>
            })}
        </div>
        </div>
    }

        

    function Postings({company}: {company: any}) {
        return <Posting key={params.posting} p={params.posting} company={company}/>
        
    }

    
    return  <AlertDialog open={alertVisible}  onOpenChange={setAlertVisible}>
        <div className="p-4 my-16 max-w-5xl mx-auto">
  

        <div className='mt-4'>
            {isLoading ? <LoadingSkeleton /> : <Company/>}
        </div>
        
        <div className='mt-4'>
            {isPostingLoading ? <PostingsLoadingSkeleton /> : <Postings company={company}/>}
        
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