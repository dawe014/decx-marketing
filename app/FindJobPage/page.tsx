"use client";

import { useState } from "react";

const FindJobPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/jobs");
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Find a Job</h1>
      <button onClick={fetchJobs}>Fetch Jobs</button>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {jobs?.map((job) => (
          <li key={job}>{job}</li>
        ))}
      </ul>
    </div>
  );
};

export default FindJobPage;
