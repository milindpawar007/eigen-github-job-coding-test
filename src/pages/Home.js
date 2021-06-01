import React, { useState, useContext, useEffect } from 'react'
import { JobsContext } from '../App';
import { JobBoard, SearchBar, Error } from '../components';
import arrow from '../images/up-arrow.svg';

const Home = () => {
    const { data: {jobs}, BASE_URL, loading, error, resultLength, searchURL, fetchGithubAPI, mobileFilter } = useContext(JobsContext);
    const [anotherPage, setAnotherPage] = useState(2);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [scroll, setScroll] = useState(window.pageYOffset);
     
    function useWindowSize() {
        useEffect(() => {
            function updateScrollHeight() {
                setWindowHeight(window.innerHeight)
                setScroll(window.pageYOffset)
            }
            window.addEventListener('scroll', updateScrollHeight)
            updateScrollHeight()
            // clean up function on unmount
            return () => window.removeEventListener('scroll', updateScrollHeight)
        }, [windowHeight, scroll])

        return scroll, windowHeight
    }


    useEffect(() => {
        setAnotherPage(2)
    }, [resultLength < 50])

    // button click loadmore 
    const loadMore = () => {
        setAnotherPage(anotherPage + 1)

        const endpoint = searchURL 
            ? `${searchURL}&page=${anotherPage}`
            : `${BASE_URL}.json?page=${anotherPage}`

        fetchGithubAPI(endpoint)       
        sessionStorage.setItem('search URL', endpoint)
    }
    // current size of the browser window
    useWindowSize()

    return (
        <div className="home__page">
            <SearchBar />
            {error.error && (<Error apiError />)}
            {!error.error && !loading && searchURL && jobs.length === 0 && (<Error noJobs />)}
            {jobs && !error.error && (
                <>
                <JobBoard jobs={jobs} />
                                  
                 {/* if alredy more than 50job then dont show load more button */}
                {resultLength >= 50 && !mobileFilter && (
                    <button className="load__more__btn btn" onClick={loadMore}>Load More</button>
                )}

                {/* go to upwards location up arrow */}
                
                {scroll >= (windowHeight * 2) && !mobileFilter && (
                    <button   className="back-to-top"   aria-label="Button to scroll back to top of page"  onClick={() => window.scrollTo(0, 0)}>
                            <img src={arrow} alt="" />
                    </button>
                )}
                </>
            )}         
        </div>
    )
}

export default Home