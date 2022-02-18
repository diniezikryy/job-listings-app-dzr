import React, { useState, useEffect } from "react";
import axios from "axios";
import JobBoard from "./components/JobBoard";

// sample pull from json

/* let x = {
  "id": 1,
  "company": "Photosnap",
  "logo": "./assets/photosnap.svg",
  "new": true,
  "featured": true,
  "position": "Senior Frontend Developer",
  "role": "Frontend",
  "level": "Senior",
  "postedAt": "1d ago",
  "contract": "Full Time",
  "location": "USA Only",
  "languages": ["HTML", "CSS", "JavaScript"],
  "tools": []
}, */

const App = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    axios
      .get("/api/jobs")
      .then((res) => {
        setJobs(res.data);
      })
      .catch((err) => {
        console.log("error fetching the data!");
      });
  }, []);

  const filterFunc = ({ role, level, tools, languages }) => {
    if (filters.length === 0) {
      return true;
    }

    const tags = [role, level];

    if (tools) {
      tags.push(...tools);
    }

    if (languages) {
      tags.push(...languages);
    }
    return filters.every((filter) => tags.includes(filter));
  };

  const handleTagClick = (tag) => {
    if (filters.includes(tag)) return;
    setFilters([...filters, tag]);
  };

  const handleFilterClick = (passedFilter) => {
    setFilters(filters.filter((f) => f !== passedFilter));
  };

  const clearFilters = () => {
    setFilters([]);
  };

  const filteredJobs = jobs.filter(filterFunc);

  return (
    <>
      <header className="bg-teal-500 mb-12 bg-cover">
        <img className="w-full" src="/images/bg-header-desktop.svg" alt="" />
      </header>

      <div className="container m-auto">
        {filters.length > 0 && (
          <div
            className={`cursor-pointer flex bg-white shadow-md -my-20 mb-16 mx-10 p-6 rounded z-10 relative`}
          >
            {filters.map((filter) => (
              <span
                onClick={() => handleFilterClick(filter)}
                className="text-teal-500 bg-teal-50 font-bold mr-4 mb-4 p-2 rounded lg:mb-0"
              >
                X {filter}
              </span>
            ))}
            <button
              onClick={clearFilters}
              className="font-bold text-gray-700 ml-auto"
            >
              Clear
            </button>
          </div>
        )}

        {jobs.length === 0 ? (
          <p>Jobs are fetching...</p>
        ) : (
          filteredJobs.map((job) => (
            <JobBoard handleTagClick={handleTagClick} job={job} key={job.id} />
          ))
        )}
      </div>
    </>
  );
};

export default App;
