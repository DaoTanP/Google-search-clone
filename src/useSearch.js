import { useState, useEffect } from "react";

function useSearch(term) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const startTime = new Date();
      fetch(
        // `https://web-crawler.dao-tan-phattan.repl.co/webs?term=${term}`,
        `https://cheerio-web-crawler.dao-tan-phattan.repl.co/search?term=${term}`,
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