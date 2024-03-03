import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at_date');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(20);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/data');
        setData(response.data);
      } catch (error ) {
        console.error('Error fetching data', error);
      }
  };

    fetchData();
  }, []);

  // Filtering based on search term
  const filteredData = data.filter(
    (item) =>
      item.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting based on date or time
  const sortedData = filteredData.sort((a, b) =>
    sortBy === 'created_at_date'
      ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      : new Date(a.created_at).getHours() * 60 +
        new Date(a.created_at).getMinutes() -
        (new Date(b.created_at).getHours() * 60 + new Date(b.created_at).getMinutes())
  );

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedData.slice(indexOfFirstRecord, indexOfLastRecord);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-1">
      <input
        type="text"
        placeholder="Search by name or location"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
        <table className="container mt-3">
          <thead style={{ backgroundColor: '#6fd5d3' }}>
            <tr  className='customer'>
              <th>S.No</th>
              <th>Customer Name</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Location</th>
              <th>
              <button onClick={() => setSortBy('created_at_date')}>Sort by Date</button>
              </th>
              <th>
              <button onClick={() => setSortBy('created_at_time')}>Sort by Time</button>
              </th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: '#f8f7f7'}}>
          {currentRecords.map((item, index) => (
            <tr key={item.s_no}>
              <td style={{ backgroundColor: '#fae3da' }}>{item.s_no}</td>
              <td>{item.customer_name}</td>
              <td>{item.age}</td>
              <td>{item.phone}</td>
              <td>{item.location}</td>
              <td>{new Date(item.created_at).toLocaleDateString()}</td>
              <td>{new Date(item.created_at).toLocaleTimeString()}</td>
            </tr>
          ))}  
        </tbody>
      </table>

      {/* Pagination  */}
      <div className="container mt-1">
        {Array.from({ length: Math.ceil(sortedData.length / recordsPerPage) }, (_, index) => (
        <button className="btn btn-primary btn-block" key={index} onClick={() => paginate(index + 1)}>
        {index + 1}
        </button>
      ))}
     </div> 

    </div>
  );
}

export default App