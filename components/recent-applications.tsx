"use client"

import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { Share } from "lucide-react";
import moment from "moment";
import axios from "axios";
import React, { useState, useEffect } from 'react';
import Link from "next/link";

function Event({ke, name, company, position, timestamp, c} : {ke: string, name: string, company: string, position: string, timestamp: number, c: string}) {
    return <div className="flex ">
    <Avatar className="h-9 w-9">
      <AvatarImage src={`https://avatar.vercel.sh/${name}?size=30`} alt="Avatar" />
      <AvatarFallback>OM</AvatarFallback>
    </Avatar>
    <div className="ml-4 space-y-1">
      <p className="text-sm font-medium leading-none">{name}</p>
      <p className="text-sm text-muted-foreground">
        Posted an opening for <span className="font-bold">{position}</span> at <span className="font-bold">{company}</span>
      </p>
      <p className="text-xs">{moment.unix(timestamp).fromNow()}</p>
      <div>
      <Link href={`/company/${c}/postings/${ke}/apply`}> <Button className="mt-2 mr-2"> Apply </Button> </Link>
      <Link href={`/company/${c}`}>
            <Button size="sm" variant="outline"  className="mt-2 mr-2"> View</Button>
            </Link>
      <Button size="sm" variant="outline" className="mt-2">
        <Share className="mr-2 h-3 w-3"></Share>
        Share
        </Button>
      </div>
    </div>
  </div>
}

function Posting({ name, company, position, timestamp} : { name: string, company: string, position: string, timestamp: number}) {
  return <div className="flex ">

  <div className="space-y-1">
    <p className="text-sm font-medium leading-none">{position}</p>
    <p className="text-sm ">{company}</p>
    <p className="text-sm text-muted-foreground">
      Status pending. <span className="italic">Last Updated {moment.unix(timestamp).fromNow()}</span>
    </p>
    <p className="text-xs">{moment.unix(timestamp).fromNow()}</p>
    <div>
    <Button size="sm" className="mt-2 mr-2">Apply</Button>
    <Button size="sm" variant="outline" className="mt-2 mr-2">View</Button>
    <Button size="sm" variant="outline" className="mt-2">
      <Share className="mr-2 h-3 w-3"></Share>
      Share
      </Button>
    </div>
  </div>
</div>
}


// export function RecentApplications() {
//     let happenings: React.ReactElement[] = [];
//     let people = [{ name: 'Emma Johnson', company: 'Tech Innovators', position: 'Software Engineer', timestamp: 1699644905 }, // Timestamp for 2023-03-08 00:00:00 UTC
//     { name: 'Daniel Smith', company: 'Data Solutions Ltd.', position: 'Data Analyst', timestamp: 1699212105 }, // Timestamp for 2023-03-09 00:00:00 UTC
//     { name: 'Sophia Lee', company: 'Cloud Dynamics', position: 'Systems Architect', timestamp: 1698856505 }, // Timestamp for 2023-03-10 00:00:00 UTC
//     { name: 'James Miller', company: 'AI Innovations', position: 'Machine Learning Specialist', timestamp: 1698597305 }, // Timestamp for 2023-03-11 00:00:00 UTC
//       ]

//     people.forEach( (v, i) => {
//         happenings.push(
//             <Event ke={v.name} name={v.name} company={v.company} position={v.position} timestamp={v.timestamp}></Event>
//         )
//     })


//     const fetchJobPosts = async () => {
//       let url = process.env.NEXT_PUBLIC_BACKEND_URL
//       let token = window.sessionStorage.getItem("token")
//       try {
//         const response = await axios.get(`${url}/all-jobposts`);
//         const jobPost = response.data.jobPosts;
  
//         happenings.push(
//           <Event ke={"{names}"} name={"{names}"} company={"{names}"} position={"{names}"} timestamp= {1699212105} ></Event>
//         ); //why its not working inside fetchJobPosts but its working outsidee it
//         console.log("Done dona done");
//       } catch (err:any) {
//         console.log(err);
//         return [];
//       }
//   }
//   useEffect(() => {
//     fetchJobPosts();
//   }, []);



//     return (
//         <div className="space-y-8">
//           {happenings}
//         </div>
//       )
//     }

export function RecentApplications() {
  const [happenings, setHappenings] = useState<React.ReactElement[]>([]);
  const [myData, setMyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let url = process.env.NEXT_PUBLIC_BACKEND_URL;

      try {
        const response = await axios.get(`${url}/all-jobposts`);
        const jobPosts = response.data.jobPosts;

        // Update myData state
        setMyData(jobPosts);

        // Clear happenings state before adding new elements
        setHappenings([]);

        // Create React elements and update happenings
        const elements = jobPosts.map((post:any) => (
          <Event
            key={post._id}
            ke={post._id}
            c = {post.company._id}
            name={post.createdBy.fullName}
            company={post.company.companyName}
            position={post.job_title}
            timestamp={Math.floor(new Date(post.created_at).getTime() / 1000)}
          />
        ));

        // Update happenings state
        setHappenings((prevHappenings) => [...prevHappenings, ...elements]);
      } catch (err) {
        console.error('Error fetching job posts:', err);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures that this effect runs only once, equivalent to componentDidMount

  // Render the component
  return (
    <div className="space-y-8">
      {happenings}
    </div>
  );
}


export function ApplicationStatus() {
  let happenings: React.ReactElement[] = [];
  let people = [{ name: 'Emma Johnson', company: 'Cyber Security Solutions', position: 'Software Engineer', timestamp: 1699644905 }, // Timestamp for 2023-03-08 00:00:00 UTC
  { name: 'Daniel Smith', company: 'AI Innovations.', position: 'Data Analyst', timestamp: 1699202105 }, // Timestamp for 2023-03-09 00:00:00 UTC
    ]

  people.forEach( (v, i) => {
      happenings.push(
          <Posting key={v.name} name={v.name} company={v.company} position={v.position} timestamp={v.timestamp}></Posting>
      )
  })


  return (
      <div className="space-y-8">
        {happenings}
      </div>
    )
  
}
