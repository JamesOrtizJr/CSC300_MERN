import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import axios from 'axios';

function MbtaLines() {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await axios(
        'https://api-v3.mbta.com/lines'
      );
      setLines(result.data.data);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>MBTA Lines</h1>

      {lines.map(line => (
        <Card
        key={line.id}
        className="mx-1 my-2"
        style={{
          width: "30rem",
          borderLeft: `10px solid #${line.attributes.color}`
        }}
      >
      
          <Card.Body>
            <Card.Title>{line.attributes.name}</Card.Title>
            <Card.Text>
              {line.id}
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default MbtaLines;
