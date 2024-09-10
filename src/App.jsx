import { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [swaggerUrl, setSwaggerUrl] = useState('');
  const [swaggerData, setSwaggerData] = useState(null);
  const [manualInput, setManualInput] = useState('{}'); // Default to empty object as a string
  const [endpoint, setEndpoint] = useState('');
  const [method, setMethod] = useState('get');
  const [headers, setHeaders] = useState('{}'); // Default to empty headers as a string
  const [testResult, setTestResult] = useState('');

  // Fetch Swagger data from the backend
  const fetchSwagger = async () => {
    try {
      const response = await axios.post('http://localhost:5000/fetch-swagger', {
        swaggerUrl,
      });
      setSwaggerData(response.data.swaggerData);
    } catch (error) {
      console.error('Error fetching Swagger:', error);
      setTestResult('Error fetching Swagger data');
    }
  };

  // Handle manual input submission
  const handleTestRequest = async () => {
    let parsedInput, parsedHeaders;
    try {
      parsedInput = JSON.parse(manualInput);
      parsedHeaders = JSON.parse(headers);
    } catch (error) {
      setTestResult('Invalid JSON input or headers');
      console.error('Invalid JSON input or headers', error);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/test-request', {
        method,
        endpoint,
        requestData: parsedInput,
        headers: parsedHeaders,
      });
      setTestResult(response.data.message);
    } catch (error) {
      console.error('Error during test:', error);
      setTestResult(error.response?.data?.message || 'Test failed');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Swagger API Tester</h1>

      {/* Input to fetch Swagger JSON */}
      <input
        type="text"
        placeholder="Swagger URL"
        value={swaggerUrl}
        onChange={(e) => setSwaggerUrl(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <button onClick={fetchSwagger} style={{ padding: '10px 20px' }}>
        Fetch Swagger Data
      </button>

      {swaggerData && (
        <>
          <h2>Available Endpoints:</h2>
          <div style={{ maxHeight: '200px', overflowY: 'scroll', marginBottom: '20px' }}>
            {Object.keys(swaggerData.paths).map((path) => (
              <div key={path}>
                <p>{path}</p>
              </div>
            ))}
          </div>

          <h2>Manual Request Testing</h2>

          {/* Select endpoint and method */}
          <input
            type="text"
            placeholder="Endpoint (e.g., /users/{id})"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />

          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            style={{ padding: '10px', marginBottom: '10px' }}
          >
            <option value="get">GET</option>
            <option value="post">POST</option>
            <option value="put">PUT</option>
            <option value="patch">PATCH</option>
            <option value="delete">DELETE</option>
          </select>

          {/* Input fields for the manual request */}
          <textarea
            rows="5"
            placeholder="Request data (JSON)"
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
          ></textarea>

          <textarea
            rows="5"
            placeholder="Headers (JSON)"
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
          ></textarea>

          <button onClick={handleTestRequest} style={{ padding: '10px 20px' }}>
            Test Request
          </button>

          {testResult && <p>Test Result: {testResult}</p>}
        </>
      )}
    </div>
  );
};

export default App;
