"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { redirect } from "next/navigation"
import { Icons } from "./icons"
import React from "react"
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
import { Textarea } from "./ui/textarea"
import { Checkbox } from "./ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { CalendarIcon, Plus } from "lucide-react"
import { Calendar } from "./ui/calendar"
import { cn } from "@/lib/utils"
import { Card } from "./ui/card"
import { MultiSelect } from "./ui/multi-select"
 



// create formSchema from 
// the following schema 
/* 
 const JobApplicaionSchema = new Schema({
  _id: { type: String, required: true },
  applicantName: { type: String, required: true, default: "" },
  applicantID: { type: String, required: true },
  email: { type: String, required: true },
  phone: {type: Number, required: true },
  education: [
    {
      degree: { type: String, required: true }, 
      institution: { type: String, required: true },
      graduationDate: {type: Number, required: true },
      cgpa: {type: Number, required: true }
    }
  ],
  workExperience: [
    {
      company: { type: String, required: true },
      position: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true},
      yearsOfExp: { type: Number, required: true },
      responsibilities: { type: String, required: true }
    }
  ],
  resume: {type: String, required: true },
  coverLetter: {type: String, required: true },
  linkedinProfile: {type: String, required: true },
  githubProfile: {type: String, required: true },
  portfolio: {type: String, required: true },
  skills: [{ type:String, required: true }],
  currLoc: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true }         
  },
  shiftToNew: { type:Boolean, required: true },
  slot: { type: Date, required: true },
  references: [
    {
      name: { type: String, required: true }, 
      relationship: { type: String, required: true },
      contact: {type: Number, required: true },
    }
  ],
  customQuestions: {
    question1: { type: String, required: true },
    question2: { type: String, required: true },
    question3: { type: String, required: true },
  },
  status: { type: String, required: true, enum: ["APPROVED", "PENDING", "REJECTED"], default: "PENDING" },
  jobPost: { type: String, required: true },
  company: { type: String, required: true }
});
  */

const formSchema = z.object({
  applicantName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().optional(),
  education: z.array(z.object({
    degree: z.string(),
    institution: z.string(),
    graduationDate: z.date(),
    cgpa: z.number()
  })).optional(),

  workExperience: z.array(z.object({
    company: z.string(),
    position: z.string(),
    startDate: z.date(),
    endDate: z.date(),
    yearsOfExp: z.number(),
    responsibilities: z.string()
  })).optional(),

  resume: z.string().optional(),
  coverLetter: z.string().optional(),
  linkedinProfile: z.string().optional(),
  githubProfile: z.string().optional(),
  portfolio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  currLoc: z.object({
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional()
  }),
  shiftToNew: z.boolean(),
  slot: z.date(),
  references: z.array(z.object({
    name: z.string(),
    relationship: z.string(),
    contact: z.string()
  })).optional()
})


 
export function ProfileForm({ posting, company} : { posting: string, company: string}) {

const [education, setEducation] = React.useState<any>([]);
const [workExperience, setWorkExperience] = React.useState<any>([]);
  const [alertVisible, setAlertVisible] = React.useState<boolean>(false);
  const [alertTitle, setAlertTitle] = React.useState("");
  const [alertDescription, setAlertDescription] = React.useState("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  // 1. Define your form.

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: async () => {
      let email = "loading..."
      let name = "Loading..."
      let url = process.env.NEXT_PUBLIC_BACKEND_URL
      let token = window.sessionStorage.getItem("token")
      try {
        let result = await axios.get(`${url}/me`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        email = result.data.email
        name = result.data.fullName || result.data.email.split("@")[0]
        console.log(result)
      } catch (err: any) {
          console.log(err)
      } 
      return {
        applicantName: name,
        email: email,
        shiftToNew: false,
        slot: new Date(),
        phone: "",
        education: [],
        workExperience: [],
        resume: "",
        coverLetter: "",
        linkedinProfile: "",
        githubProfile: "",
        portfolio: "",
        skills: [],
        currLoc: {
          city: "",
          state: "",
          country: ""
        },
        references: [],
      }
    }
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    let url = process.env.NEXT_PUBLIC_BACKEND_URL
    let token = window.sessionStorage.getItem("token")
    try {
      let result = await axios.post(`${url}/company/${company}/posting/${posting}/application`, values, { headers: {
      "Authorization": `Bearer ${token}`
    }})
      console.log(result)
      redirect("/dashboard")
    } catch (err: any) {
        console.log(err)
        setAlertTitle(err?.response?.data?.message || "Something went wrong.")
        setAlertDescription(err?.response?.data?.description ||err?.response?.data?.error || "That's all we know.")
        setAlertVisible(true)
    }
    setIsLoading(false);
  }

  async function onInvalid(errors: any) {
    console.log(errors)
  }


  function EducationBlock() {
    
  }


  function handleAddWorkExperience(event: any) {

    const newWorkExperience = { company: "", position: "", startDate: new Date(), endDate: new Date(), yearsOfExp: 0, responsibilities: "" };

    setWorkExperience([...workExperience, newWorkExperience]);

    event.preventDefault();

  };

  function handleRemoveWorkExperience(f: typeof form, index: number) {
    const updatedWorkExperience = [...workExperience];
    updatedWorkExperience.splice(index, 1);
    setWorkExperience(updatedWorkExperience);
    f.setValue("workExperience", updatedWorkExperience);
  };

  function handleWorkExperienceChange(f: typeof form, index: number, name: string, value: string|Date|number) {
    console.log("index:", index, "name:", name, "value:", value, "Updating work experience.")
    const updatedWorkExperience = [...workExperience];
    updatedWorkExperience[index][name] = value;
    setWorkExperience(updatedWorkExperience);

    f.setValue("workExperience", updatedWorkExperience);
  };




  function handleAddEducation(event: any) {

    const newEducation = { degree: "", institution: "", graduationDate: new Date(), cgpa: 0 };

    setEducation([...education, newEducation]);

    event.preventDefault();

  };

  function handleRemoveEducation(f: typeof form, index: number) {
    const updatedEducation = [...education];
    updatedEducation.splice(index, 1);
    setEducation(updatedEducation);
    f.setValue("education", updatedEducation);
  };

  function handleEducationChange(f: typeof form, index: number, name: string, value: string|Date|number) {
    console.log("index:", index, "name:", name, "value:", value, "Updating education.")
    const updatedEducation = [...education];
    updatedEducation[index][name] = value;
    setEducation(updatedEducation);

    f.setValue("education", updatedEducation);
  };



  return (

    <AlertDialog open={alertVisible}  onOpenChange={setAlertVisible}>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
        <FormField
          control={form.control}
          name="applicantName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField control={form.control} name="email" disabled render={({ field }) => (
            <FormItem><FormLabel>Email</FormLabel><FormControl><Input disabled placeholder="email@emai.com" type="email" {...field} /></FormControl>
              <FormDescription>This is your email which will be used to contact you.</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        {/* <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="+91 ..." type="number" {...field} /></FormControl>
              <FormDescription>This is your phone number which will be used to contact you.</FormDescription>
              <FormMessage />
            </FormItem>
          )} /> */}
        <h1 className="text-lg font-bold">Education</h1>
                
        <Button onClick={handleAddEducation} variant="outline" ><Plus className="w-4 h-4 mr-2"></Plus>  Add Education</Button>

        {education.map((edu: any, index: number) => (
              <Card key={index} className="p-4 space-y-4">

                <h1 className="font-bold">Education #{index + 1}</h1>
                <FormItem><FormLabel>Degree</FormLabel><FormControl><Input 
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(form, index, 'degree', e.target.value)}
                  type="text" placeholder={`Degree #${index}`} /></FormControl>
                  <FormDescription>What is your degree?</FormDescription>
                  <FormMessage />
                </FormItem>

                <FormItem><FormLabel>Institution</FormLabel><FormControl><Input value={edu.institution}
                  onChange={(e) => handleEducationChange(form, index, 'institution', e.target.value)}
                  type="text" placeholder={`Institution #${index}`} /></FormControl>
                  <FormDescription>What is your institution?</FormDescription>
                  <FormMessage />
                </FormItem>

                <FormItem><FormLabel>Graduation Date </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !edu.graduationDate && "text-muted-foreground"
                        )}
                      >
                        {edu.graduationDate ? (
                          format(edu.graduationDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={edu.graduationDate}
                      onSelect={(day) => handleEducationChange(form, index, 'graduationDate', day ? day : new Date())}
                      disabled={(date: Date) => date > new Date()}

                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
                <FormItem><FormLabel>CGPA</FormLabel><FormControl>
                  <Input value={edu.cgpa} type="number" placeholder={`CGPA #${index}`} 
                  onChange={(e) => handleEducationChange(form, index, 'cgpa', e.target.valueAsNumber)}/>
                  </FormControl>
                  <FormDescription>What is your CGPA?</FormDescription>
                  <FormMessage />
                </FormItem>
              </Card>
            ))
          }
        <h1 className="text-lg font-bold">Work Experience</h1>


        
        <Button onClick={handleAddWorkExperience} variant="outline" ><Plus className="w-4 h-4 mr-2"></Plus>  Add Work Experience</Button>

        {workExperience.map((edu: any, index: number) => (
              <Card key={index} className="p-4 space-y-4">

                <h1 className="font-bold">Company #{index + 1}</h1>
                <FormItem><FormLabel>Company Name</FormLabel><FormControl><Input 
                  value={edu.company}
                  onChange={(e) => handleWorkExperienceChange(form, index, 'company', e.target.value)}
                   type="text" placeholder={`Company #${index}`} /></FormControl>
                  <FormDescription>Name of the company you worked at.</FormDescription>
                  <FormMessage />
                </FormItem>

                <FormItem><FormLabel>Position</FormLabel><FormControl><Input value={edu.position}
                  onChange={(e) => handleWorkExperienceChange(form, index, 'position', e.target.value)}
                   type="text" placeholder={`Position #${index}`} /></FormControl>
                  <FormDescription>What was your position?</FormDescription>
                  <FormMessage />
                </FormItem>

                <FormItem><FormLabel>Start Date </FormLabel><FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !edu.startDate && "text-muted-foreground"
                        )}
                      >
                        {edu.startDate ? (
                          format(edu.startDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={edu.startDate}
                      onSelect={(day) => handleWorkExperienceChange(form, index, 'startDate', day ? day : new Date())}
                      disabled={(date: Date) => date > new Date()}

                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                  
                  </FormControl>
                  <FormDescription>When did you start working?</FormDescription>
                  <FormMessage />
                </FormItem>

                <FormItem><FormLabel>End Date</FormLabel><FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !edu.endDate && "text-muted-foreground"
                          )}
                        >
                          {edu.endDate ? (
                            format(edu.endDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={edu.endDate}
                        onSelect={(day) => handleWorkExperienceChange(form, index, 'endDate', day ? day : new Date())}
                        disabled={(date: Date) => date > new Date()}

                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  </FormControl>
                </FormItem>

                <FormItem><FormLabel>Years of Experience</FormLabel><FormControl>
                  <Input value={edu.yearsOfExp} type="number" placeholder={`Years of Experience #${index}`} 
                  onChange={(e) => handleWorkExperienceChange(form, index, 'yearsOfExp', e.target.valueAsNumber)}/>
                  </FormControl>
                  <FormDescription>How many years of experience do you have?</FormDescription>
                  <FormMessage />
                </FormItem>

                <FormItem><FormLabel>Responsibilities #{index}</FormLabel><FormControl>
                  <Textarea placeholder={`Responsibilities #${index}`} 
                  value={edu.responsibilities}
                  onChange={(e) => handleWorkExperienceChange(form, index, 'responsibilities', e.target.value)} />
                  </FormControl>
                  <FormDescription>What were your responsibilities?</FormDescription>
                  <FormMessage />
                </FormItem>


              </Card>
            ))
          }
        <FormField control={form.control} name="resume" render={({ field }) => (
            <FormItem><FormLabel>Resume</FormLabel><FormControl><Textarea placeholder="Include a text version of your resume." {...field} /></FormControl>
              <FormDescription>Upload your resume.</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="coverLetter" render={({ field }) => (
            <FormItem><FormLabel>Cover Letter</FormLabel><FormControl><Input placeholder="If required, include cover letter." {...field} /></FormControl>
              <FormDescription>Upload your cover letter.</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="linkedinProfile" render={({ field }) => (
            <FormItem><FormLabel>LinkedIn Profile</FormLabel><FormControl><Input placeholder="@johndoe" {...field} /></FormControl>
              <FormDescription>What is your LinkedIn profile?</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="githubProfile" render={({ field }) => (
            <FormItem><FormLabel>Github Profile</FormLabel><FormControl><Input placeholder="@johndoe" {...field} /></FormControl>
              <FormDescription>What is your Github profile?</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="portfolio" render={({ field }) => (
            <FormItem><FormLabel>Portfolio</FormLabel><FormControl><Input placeholder="https://example.com" {...field} /></FormControl>
              <FormDescription>Your portfolio link if you have one.</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        
        <FormField
        control={form.control}
        name="skills"
        render={({ field }) => (
            <FormItem>
                <FormLabel>Select Skills</FormLabel>
                    <MultiSelect
                        selected={field.value || []}
                        options={[
                          { "value": "go", "label": "Go" },
                          { "value": "rust", "label": "Rust" },
                          { "value": "python", "label": "Python" },
                          { "value": "javascript", "label": "JavaScript" },
                          { "value": "typescript", "label": "TypeScript" },
                          { "value": "java", "label": "Java" },
                          { "value": "csharp", "label": "C#" },
                          { "value": "php", "label": "PHP" },
                          { "value": "swift", "label": "Swift" },
                          { "value": "kotlin", "label": "Kotlin" },
                          { "value": "ruby", "label": "Ruby" },
                          { "value": "html", "label": "HTML" },
                          { "value": "css", "label": "CSS" },
                          { "value": "sql", "label": "SQL" },
                          { "value": "bash", "label": "Bash" },
                          { "value": "git", "label": "Git" },
                          { "value": "docker", "label": "Docker" },
                          { "value": "kubernetes", "label": "Kubernetes" },
                          { "value": "terraform", "label": "Terraform" },
                          { "value": "jenkins", "label": "Jenkins" },
                          { "value": "ansible", "label": "Ansible" },
                          { "value": "next.js", "label": "Next.js" },
                          { "value": "react", "label": "React" },
                          { "value": "vue", "label": "Vue.js" },
                          { "value": "angular", "label": "Angular" },
                          { "value": "node.js", "label": "Node.js" },
                          { "value": "express.js", "label": "Express.js" },
                          { "value": "spring", "label": "Spring Framework" },
                          { "value": "django", "label": "Django" },
                          { "value": "flask", "label": "Flask" },
                          { "value": "laravel", "label": "Laravel" },
                          { "value": "symfony", "label": "Symfony" },
                          { "value": "android", "label": "Android Development" },
                          { "value": "ios", "label": "iOS Development" },
                          { "value": "machinelearning", "label": "Machine Learning" },
                          { "value": "datascience", "label": "Data Science" },
                          { "value": "cloudcomputing", "label": "Cloud Computing" },
                          { "value": "devops", "label": "DevOps" },
                          { "value": "linux", "label": "Linux" },
                          { "value": "windows", "label": "Windows" },
                          { "value": "macos", "label": "macOS" },
                          { "value": "androidstudio", "label": "Android Studio" },
                          { "value": "xcode", "label": "Xcode" },
                          { "value": "visualstudio", "label": "Visual Studio" },
                          { "value": "intellij", "label": "IntelliJ IDEA" },
                          { "value": "vscode", "label": "Visual Studio Code" },
                          { "value": "atom", "label": "Atom" },
                          { "value": "emacs", "label": "Emacs" },
                          { "value": "vim", "label": "Vim" },
                          { "value": "agile", "label": "Agile Methodology" },
                          { "value": "scrum", "label": "Scrum" },
                          { "value": "kanban", "label": "Kanban" },
                          { "value": "jenkins", "label": "Jenkins" },
                          { "value": "circleci", "label": "CircleCI" },
                          { "value": "travis", "label": "Travis CI" },
                          { "value": "gitlab", "label": "GitLab CI/CD" },
                          { "value": "githubactions", "label": "GitHub Actions" },
                          { "value": "jira", "label": "Jira" },
                          { "value": "confluence", "label": "Confluence" },
                          { "value": "gitlab", "label": "GitLab" },
                          { "value": "bitbucket", "label": "Bitbucket" },
                          { "value": "mongodb", "label": "MongoDB" },
                          { "value": "mysql", "label": "MySQL" },
                          { "value": "postgresql", "label": "PostgreSQL" },
                          { "value": "redis", "label": "Redis" },
                          { "value": "elasticsearch", "label": "Elasticsearch" },
                          { "value": "graphql", "label": "GraphQL" },
                          { "value": "restapi", "label": "RESTful API" },
                          { "value": "grpc", "label": "gRPC" },
                          { "value": "oauth", "label": "OAuth" },
                          { "value": "jwt", "label": "JWT" },
                          { "value": "websocket", "label": "WebSocket" },
                          { "value": "linuxadministration", "label": "Linux Administration" },
                          { "value": "windowsadministration", "label": "Windows Administration" },
                          { "value": "networking", "label": "Networking" },
                          { "value": "security", "label": "Security" },
                          { "value": "bashscripting", "label": "Bash Scripting" },
                          { "value": "powershell", "label": "PowerShell" },
                          { "value": "agile", "label": "Agile Methodology" },
                          { "value": "systemdesign", "label": "System Design" },
                          { "value": "microservices", "label": "Microservices" },
                          { "value": "distributedsystems", "label": "Distributed Systems" },
                          { "value": "containers", "label": "Containers" },
                          { "value": "serverless", "label": "Serverless" },
                          { "value": "nosql", "label": "NoSQL" },
                          { "value": "bigdata", "label": "Big Data" },
                          { "value": "elasticstack", "label": "Elastic Stack" },
                          { "value": "grafana", "label": "Grafana" },
                          { "value": "prometheus", "label": "Prometheus" },
                          { "value": "datamigration", "label": "Data Migration" },
                          { "value": "continuousintegration", "label": "Continuous Integration" },
                          { "value": "continuousdeployment", "label": "Continuous Deployment" }
                        ]
                        }
                        {...field}
                        className="sm:w-[510px]"
                    />
                <FormMessage />
            </FormItem>
        )}
    />
        

        <FormField control={form.control} name="currLoc.city" render={({ field }) => (
            <FormItem><FormLabel>Current City</FormLabel><FormControl><Input placeholder="City" {...field} /></FormControl>
              <FormDescription>What is your current location?</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="currLoc.state" render={({ field }) => (
            <FormItem><FormLabel>Current State</FormLabel><FormControl><Input placeholder="State" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="currLoc.country" render={({ field }) => (
            <FormItem><FormLabel>Current Country</FormLabel><FormControl><Input placeholder="Country" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="shiftToNew" render={({ field }) => (  
            <FormItem><FormLabel>Shift to New Location</FormLabel><FormControl>
              <div><Checkbox checked={field.value} className="mt-2" /></div></FormControl>
              <FormDescription>Are you willing to shift to a new location?</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="slot" render={({ field }) => (
           <FormItem className="flex flex-col">
           <FormLabel>Interview Slot</FormLabel>
           <Popover>
             <PopoverTrigger asChild>
               <FormControl>
                 <Button
                   variant={"outline"}
                   className={cn(
                     "w-[240px] pl-3 text-left font-normal",
                     !field.value && "text-muted-foreground"
                   )}
                 >
                   {field.value ? (
                     format(field.value, "PPP")
                   ) : (
                     <span>Pick a date</span>
                   )}
                   <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                 </Button>
               </FormControl>
             </PopoverTrigger>
             <PopoverContent className="w-auto p-0" align="start">
               <Calendar
                 mode="single"
                 selected={field.value}
                 onSelect={field.onChange}
                 disabled={(date: Date) =>
                   date < new Date()
                 }
                 initialFocus
               />
             </PopoverContent>
           </Popover>
           <FormDescription>
             When would you like to have your interview?
           </FormDescription>
           <FormMessage />
         </FormItem>
          )} />
        <Button type="submit">
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : ("")}{" "}
        
        Submit</Button>
      </form>
    </Form>
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
  )

}