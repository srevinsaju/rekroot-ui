"use client";
import axios from 'axios';

import React, { useEffect } from 'react';

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
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Edit, Eye, Plus } from 'lucide-react';
import Link from 'next/link';
import { Company } from '@/components/company-small-block';

export default function Companies() {
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [alertVisible, setAlertVisible] = React.useState<boolean>(false);
    const [alertTitle, setAlertTitle] = React.useState("");
    const [alertDescription, setAlertDescription] = React.useState("");
    const [companies, setCompanies] = React.useState<any[]>([]);
    

    async function loadCompanies() {


    
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        let url = process.env.NEXT_PUBLIC_BACKEND_URL
        let token = window.sessionStorage.getItem("token")
        try {
            let result = await axios.get(`${url}/me/companies`, { 
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(result.data.companyUUIDs)
            let datas = [];
            for (let i = 0; i < result.data.companyUUIDs.length; i++) {
                
                let companyID = result.data.companyUUIDs[i];
                let companyResult = await axios.get(`${url}/company/${companyID}`, { 
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                console.log("company:", companyResult.data.company);
                datas.push(companyResult.data.company);
            }
            setCompanies(datas)
            console.log("Loaded all companies data.")
            
        } catch (err: any) {
            console.log(err)
            // setAlertTitle(err?.response?.message || "Something went wrong.")
            // setAlertDescription(err?.response?.description || "That's all we know.")
            // setAlertVisible(true)
        }
        console.log("companies loaded!");
        setIsLoading(false);
    }




    function CompanyList() {
        let companyComponents: React.ReactNode[] = [];
        console.log("companies:", companies);

        companies.every((company) => {
            console.log("checking company:", company)
            companyComponents.push(<Company prefix="/my"  key={company._id} company={company} showCreatePosting={true} showView={true} showEdit={true} showDelete={true}/>)
            return true;
        })
        return <>
            {companyComponents}
        </>;
    }


    function LoadingSkeletonSingleton() {
        return <div className='flex gap-4 mt-4'>
            <div className=''>

            <Skeleton className='h-32 w-32'/>
            </div>
            <div className='grid spacy-y-2 w-full'>

            <Skeleton className=' h-6'/>

            <Skeleton className=' h-6 w-32'/>

            <Skeleton className=' h-6 w-[50%]'/>

            <Skeleton className=' h-6 w-[90%]'/>
            </div>
        </div>
    }

    function LoadingSkeleton() {
        let skeletons: React.ReactNode[] = [];
        for (let i = 0; i < 4; i++) {
            skeletons.push(<LoadingSkeletonSingleton key={i}/>)
        }        
        return <>{skeletons}</>
    }

    useEffect(() => {
        loadCompanies();
    }, [])
        
    
    return <div className="p-4 my-16 max-w-5xl mx-auto">
         <h1 className="text-4xl font-bold">My Companies</h1>
        
        <div className="flex justify-between items-center">
            <p className="text-lg text-gray-500">Here are all the companies you have created.</p>
        </div>

        <div className='mt-4'>
            {isLoading ? <LoadingSkeleton /> : <CompanyList/>}
        </div>
        </div>

}