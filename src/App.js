import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import JobListing from './pages/JobListing';
import { Header } from './components';
import './App.scss';

export const JobsContext = createContext();

const App = () => {
    
    const [data, setData] = useState({ jobs:[] });
    const [error, setError] = useState({ error: false });
    const [searchInput, setSearchInput] = useState('');
    const [locationInput, setLocationInput] = useState('');
    const [fullTime, setFullTime] = useState(false);
    const [searchURL, setSearchURL] = useState('');
    const [lightTheme, setLightTheme] = useState(localStorage.getItem('theme') === 'light' ? true : false);
    const [mobileFilter, setMobileFilter] = useState(false);
    const [resultLength, setResultLength] = useState();

    //this one is not working properly
    // const API_URL = https://cors-anywhere.herokuapp.com//https://jobs.github.com/positions
    
    const API_URL = 'https://cors.bridged.cc/https://jobs.github.com/positions';
   

    const fetchGithubAPI = async (url) => {

      
        let loadMore = url.search('page');
    
        let returned =  await fetch(url);

        if (returned.ok) {
            let result = await returned.json();
            setData(prev => ({
                ...prev,
                jobs: loadMore !== -1
                    ? [...prev.jobs, ...result]
                    : [...result]
            }))
            setResultLength(result.length)
        } else {
            setError({
                error: true,
                statusCode: returned.status,
                statusText: returned.statusText
            })  
        }
    }

    useEffect(() => {     
      
        if (!sessionStorage.getItem('search URL')) {
            fetchGithubAPI(`${API_URL}.json`)
           
        } else {
            fetchGithubAPI(sessionStorage.getItem('search URL'))
            setSearchURL(sessionStorage.getItem('search URL'))
          
        }
    }, [])

    return (
        <Router>
            <JobsContext.Provider 
                value={{
                    BASE_URL: API_URL,   fetchGithubAPI,  data,  error,  resultLength,lightTheme, setLightTheme,searchInput, setSearchInput,
                    locationInput, setLocationInput, fullTime, setFullTime,  searchURL, setSearchURL,  mobileFilter, setMobileFilter}}
                >
                <div className="App">
                    <Header />
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/:jobID" component={JobListing} />
                      
                    </Switch>
                </div>
            </JobsContext.Provider>  
        </Router>
    )
}

export default App;