import { useState, useEffect } from "react";
import "../styles/WhiteHouseData.css";

const WhiteHouseData = () => {
  const [docType, setDocType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [documents, setDocuments] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = "https://www.federalregister.gov/api/v1/documents.json";
      const params = new URLSearchParams({
        "conditions[type][]": docType,
        order: sortOrder,
        page: currentPage,
        per_page: 10,
      });

      if (startDate) {
        params.append("conditions[publication_date][gte]", startDate);
      }
      if (endDate) {
        params.append("conditions[publication_date][lte]", endDate);
      }

      const response = await fetch(`${baseUrl}?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setDocuments(data.results);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [docType, startDate, endDate, sortOrder, currentPage]);

  const handleDocTypeChange = (e) => {
    setDocType(e.target.value);
    setCurrentPage(1);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setCurrentPage(1);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setCurrentPage(1);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="white-house-data-container">
      <h2>Federal Register Documents</h2>
      <div className="filters">
        <label>
          Document Type:
          <select value={docType} onChange={handleDocTypeChange}>
            <option value="">Select Type</option>
            <option value="RULE">Rule</option>
            <option value="PRORULE">Proposed Rule</option>
            <option value="NOTICE">Notice</option>
            <option value="PRESDOCU">Presidential Document</option>
          </select>
        </label>
        <label>
          Sort Order:
          <select value={sortOrder} onChange={handleSortOrderChange}>
            <option value="">Select Order</option>
            <option value="publication_date">Publication Date Ascending</option>
            <option value="-publication_date">
              Publication Date Descending
            </option>
          </select>
        </label>
        <div className="dates-selector">
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
            />
          </label>
          <label>
            End Date:
            <input type="date" value={endDate} onChange={handleEndDateChange} />
          </label>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {documents.map((doc) => (
          <li key={doc.document_number}>
            {doc.publication_date}
            {" - "}
            <a href={doc.html_url} target="_blank" rel="noopener noreferrer">
              {doc.title}
            </a>
            <p>{doc.abstract}</p>
          </li>
        ))}
      </ul>
      <div className="pagination-container">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default WhiteHouseData;
