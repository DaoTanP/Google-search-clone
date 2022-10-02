import { useState, useEffect } from "react";

function useSearch(term) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const startTime = new Date();
      fetch(
        // `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CONTEXT_KEY}&q=${term}`
        `https://web-crawler.dao-tan-phattan.repl.co/webs?term=${term}`,
        {
          mode: 'cors',
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
        .then((response) => response.json())
        .then((result) => {
          // console.log('fetch result: ' + result);

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