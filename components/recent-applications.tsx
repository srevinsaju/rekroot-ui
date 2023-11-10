import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { Share } from "lucide-react";
import moment from "moment";

function Event({ name, company, position, timestamp} : { name: string, company: string, position: string, timestamp: number}) {
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

export function RecentApplications() {
    let happenings: React.ReactElement[] = [];
    let people = [{ name: 'Emma Johnson', company: 'Tech Innovators', position: 'Software Engineer', timestamp: 1699644905 }, // Timestamp for 2023-03-08 00:00:00 UTC
    { name: 'Daniel Smith', company: 'Data Solutions Ltd.', position: 'Data Analyst', timestamp: 1699202105 }, // Timestamp for 2023-03-09 00:00:00 UTC
    { name: 'Sophia Lee', company: 'Cloud Dynamics', position: 'Systems Architect', timestamp: 1698856505 }, // Timestamp for 2023-03-10 00:00:00 UTC
    { name: 'James Miller', company: 'AI Innovations', position: 'Machine Learning Specialist', timestamp: 1698597305 }, // Timestamp for 2023-03-11 00:00:00 UTC
    { name: 'Olivia Davis', company: 'Cyber Security Solutions', position: 'Security Analyst', timestamp: 1698165305 } // Timestamp for 2023-03-12 00:00:00 UTC
      ]

    people.forEach( (v, i) => {
        happenings.push(
            <Event key={v.name} name={v.name} company={v.company} position={v.position} timestamp={v.timestamp}></Event>
        )
    })


    return (
        <div className="space-y-8">
          {happenings}
        </div>
      )
    
}