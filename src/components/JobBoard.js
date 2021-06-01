import React, { useContext } from 'react';
import { JobsContext } from '../App';
import { JobThumbnail } from '../components';
import moment from 'moment'
const JobBoard = ({ jobs }) => {
    const { mobileFilter } = useContext(JobsContext);
    
    return (
        <section className={`job__board ${mobileFilter ? 'blur' : ''}`}>
           
           {jobs.map(job => (
                       
                       <JobThumbnail 
                           key={job.id}
                           id={job.id}
                           logo={job.company_logo}
                           date={moment(new Date(job.created_at)).fromNow()}
                           lengthTerm={job.type}
                           company={job.company}
                           jobTitle={job.title}
                           location={job.location}
                       />
                   ))
            }
                        
        </section>
    )
}

export default JobBoard