import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCases = () => {
    
    fetch('http://localhost:4000/casesv2')
      .then((res) => res.json())
      .then((data) => {
        setCases(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching cases:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleDelete = (caseId) => {
    if (!window.confirm('Are you sure you want to delete this case?')) return;

    fetch(`http://localhost:4000/cases/${caseId}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (res.ok) {
          setCases((prev) => prev.filter((c) => c.Id !== caseId));
        } else {
          alert('Failed to delete case');
        }
      })
      .catch((err) => {
        console.error('Error deleting case:', err);
        alert('Failed to delete case');
      });
  };

  return (
    <div className="container">
      <h1>Last 10 Salesforce Cases</h1>
      {loading ? (
        <p>Loading...</p>
      ) : cases.length === 0 ? (
        <p>No cases found.</p>
      ) : (
        <table className="case-table">
          <thead>
            <tr>
              <th>Case Number</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Email</th>
              <th>Created Date</th>
              <th>Link</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.Id}>
                <td>{c.CaseNumber}</td>
                <td>{c.Subject}</td>
                <td>{c.Status}</td>
                <td>{c.Email__c}</td>
                <td>{new Date(c.CreatedDate).toLocaleString()}</td>
                <td>
                  <a href={c.link} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(c.Id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
