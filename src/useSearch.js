import { useState, useEffect } from "react";

function useSearch(term) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const startTime = new Date();
      fetch(
        `https://580abac2-41a0-4dd9-acef-6d5e4fb93a89-00-2sx0zh4c3bt1s.global.replit.dev/search?term=${term}`,
        {
          mode: 'cors',
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
        .then((response) => response.json())
        .then((result) => {
          const responseTime = new Date() - startTime;
          result.time = responseTime;

          setData(result);
        });
    };
    fetchData();
  }, [term]);

  return { data };
}

export default useSearch;
