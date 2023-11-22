import { Edit, Eye, Plus } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";





function ViewCompany({c, showView = false, showEdit = false}: {c: any, showView: boolean, showEdit: boolean}) {
    let variant: "secondary" | "default" = showEdit ? "secondary" : "default";
    if (!showView) {
        return <></>
    }
    return <Link href={`/company/${c._id}`}>
            <Button variant={variant}  className="mt-2"><Eye className="w-4 h-4 mr-2"></Eye> View</Button>
            </Link>
}

function EditCompany({c, showEdit = false}: {c: any, showEdit: boolean}) {
    console.log("ss", showEdit)
    if (!showEdit) {
        return <></>
    }
    return <Button className="mt-2"><Edit className="w-4 h-4 mr-2"></Edit> Edit</Button>
}


export function Company(
    {company, showEdit = false, showView = false, showCreatePosting = false}: 
    {company: any, showEdit: boolean, showView: boolean, showCreatePosting: boolean}) 
{
    console.log("received company:", company.company)
    let c = company;
    return <div className='flex gap-4 mt-4'>
        <div className=''>
            <img src="https://via.placeholder.com/150" className='h-32 w-32 object-cover rounded-lg'/>
        </div>
        <div className='grid'>
            <div>
                <h1 className='text-2xl font-bold'>{c.companyName}</h1>
                <p className='text-gray-500'>{c.companyWebsite}</p>
            </div>
            <div className="space-x-2">

            {showEdit && <EditCompany c={c} showEdit={showEdit}/>}
            {showView && <ViewCompany c={c} showView={showView} showEdit={showEdit}/>}
            

            {showCreatePosting && <Link href={`/company/${c._id}/postings/new`}>
                <Button variant="secondary" className="mt-2"><Plus className="w-4 h-4 mr-2"></Plus> Create Application</Button>
            </Link> }

            </div>
        </div>
    </div>
}