import { Edit, Eye, Plus, Trash } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import React, { useEffect } from "react";
import axios from "axios";
import { Badge } from "./ui/badge";





function ViewCompany({prefix, c, showView = false, showEdit = false}: {prefix: string, c: any, showView: boolean, showEdit: boolean}) {
    let variant: "secondary" | "default" = showEdit ? "secondary" : "default";
    if (!showView) {
        return <></>
    }
    return <Link href={`${prefix}/company/${c._id}`}>
            <Button variant={variant}  className="mt-2"><Eye className="w-4 h-4 mr-2"></Eye> View</Button>
            </Link>
}

function EditCompany({prefix, c, showEdit = false}: {prefix: string, c: any, showEdit: boolean}) {
    console.log("ss", showEdit)
    if (!showEdit) {
        return <></>
    }
    return <Button className="mt-2"><Edit className="w-4 h-4 mr-2"></Edit> Edit</Button>
}


export function Company(
    {company, showEdit = false, showView = false, showCreatePosting = false, prefix = "", showDelete = false}: 
    {company: any, showEdit: boolean, showView: boolean, showCreatePosting: boolean, prefix: string, showDelete: boolean }) 
{

    async function companyDelete() {
        let url = process.env.NEXT_PUBLIC_BACKEND_URL
        let token = window.sessionStorage.getItem("token")
        try {
            let companyResult = await axios.delete(`${url}/company/${company._id}`, { 
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log("company deleted:", companyResult)
            // window.location.href = "/my/companies"
        } catch (err) {
            console.log(err)
    
        }
    }
    console.log("received company:", company.company)
    let c = company;
    return <div className='flex gap-4 mt-4'>
        <div className=''>
            <img src="https://source.unsplash.com/140x140/?office" className='h-32 w-32 object-cover rounded-lg'/>
        </div>
        <div className='grid'>
            <div>
                <h1 className='text-2xl font-bold'>{c.companyName}</h1>
                <p className='text-gray-500'>{c.companyWebsite}</p>
            </div>
            <div className="space-x-2">

            {showEdit && <EditCompany prefix={prefix} c={c} showEdit={showEdit}/>}
            {showView && <ViewCompany prefix={prefix} c={c} showView={showView} showEdit={showEdit}/>}
            

            {showCreatePosting && <Link href={`${prefix}/company/${c._id}/postings/new`}>
                <Button variant="secondary" className="mt-2"><Plus className="w-4 h-4 mr-2"></Plus> Create Application</Button>
            </Link> }
            {showDelete && <Button onClick={companyDelete} variant="destructive" className="mt-2"><Trash className="w-4 h-4 mr-2"></Trash> Delete</Button>} 

            </div>
        </div>
    </div>
}


export function Application(
    {application, showEdit = false, showView = false, showCreatePosting = false}: 
    {application: any, showEdit: boolean, showView: boolean, showCreatePosting: boolean}) 
{

    const [posting, setPosting] = React.useState<any>(null);
    const [company, setCompany] = React.useState<any>(null);

    async function getPostingMetadata(posting: any) {
        let url = process.env.NEXT_PUBLIC_BACKEND_URL
        let token = window.sessionStorage.getItem("token")
        try {
            let companyResult = await axios.get(`${url}/company/${posting.company}/posting/${posting.jobPost}`, { 
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log("job postings:", companyResult.data);
            setPosting(companyResult.data.jobPosting);
        } catch (err) {
            console.log(err)
    
        }
    }

    async function getCompanyMetadata(posting: any) {
        let url = process.env.NEXT_PUBLIC_BACKEND_URL
        let token = window.sessionStorage.getItem("token")
        try {
            let companyResult = await axios.get(`${url}/company/${posting.company}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log("company name:", companyResult.data);
            setCompany(companyResult.data.company);
        } catch (err) {
            console.log(err)
        }

    }

    useEffect(() => {
        getPostingMetadata(application)
        getCompanyMetadata(application)
    }, [application])

    console.log("received application:", application)
    let c = application;
    return <div className='flex gap-4 mt-4'>
        <div className='grid'>
            <div>
                <h1 className='text-2xl font-bold'>{posting?.job_title || "Loading..."}</h1>
                <p className='text-gray-500'>{posting?.description || "Loading description..."}</p>
                <p>{company?.companyName || "Loading company name..."}</p>
            </div>

            <div className="space-x-2 mt-2">

            <Badge>{application.status} </Badge>

            {showEdit && <EditCompany prefix="" c={c} showEdit={showEdit}/>}
            {showView && <ViewCompany prefix="" c={c} showView={showView} showEdit={showEdit}/>}
            

            {showCreatePosting && <Link href={`/company/${c._id}/postings/new`}>
                <Button variant="secondary" className="mt-2"><Plus className="w-4 h-4 mr-2"></Plus> Create Application</Button>
            </Link> }

            </div>
        </div>
    </div>
}