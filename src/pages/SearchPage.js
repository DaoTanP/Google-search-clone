import React, { useState, useEffect } from "react";
import "./SearchPage.css";
import useSearch from "../useSearch";
import { useStateValue } from "../StateProvider";
import { Link } from "react-router-dom";
import Search from "../components/Search";

import { Pagination } from "@material-ui/lab";
import usePagination from "../usePagination";

import Spinner from "../components/Spinner";

function SearchPage() {
  const [{ term }, dispatch] = useStateValue();

  // LIVE API CALL
  const { data } = useSearch(term);

  const ResultLoader = ComponentLoader(SearchResult);

  const [appState, setAppState] = useState({
    loading: false,
  });

  useEffect(() => {
    setAppState((pre) => { return { ...pre, isLoading: !pre.isLoading } });

  }, [data, term]);

  return (
    <div className="searchPage">
      <div className="searchPage__header">
        <Link to="/" className="searchPage__logo">
          <div className="logo"></div>
        </Link>
        <div className="searchPage__headerBody">
          <Search hideButtons />
        </div>
      </div>
      <ResultLoader isLoading={appState.isLoading} term={term} data={data} />
    </div>
  );
}

function SearchResult({ term, data }) {

  if (term) {
    if (data && data.length > 0) {
      return (
        <div className="searchPage__results">
          <p className="searchPage__resultCount">
            About {data?.length} results (
            {(data?.time / 1000) || 0} seconds) for {term}
          </p>

          <ResultPagination data={data} />
        </div>
      )
    }

    return (
      <div className="searchPage__results">
        <p className="searchPage__resultCount">
          About {data?.length} results (
          {(data?.time / 1000) || 0} seconds) for {term}
        </p>
        <div className="searchPage__noResult">
          <p>No results containing all your search terms were found.</p>
          <p>Your search - <span style={{ fontWeight: 'bold' }}>{term}</span> - did not match any documents.</p>
          <p>Suggestions:</p>
          <ul>
            <li>Make sure that all words are spelled correctly.</li>
            <li>Try different keywords.</li>
            <li>Try more general keywords.</li>
          </ul>
        </div>
      </div >
    )
  }
  return (
    <div className="searchPage__results">
      <div className="searchPage__noResult">
        <p>An error has occurred.</p>
      </div>
    </div>
  )
}

function ResultPagination({ data }) {
  let [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const count = Math.ceil(data.length / PER_PAGE);
  const _DATA = usePagination(data, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
      /* you can also use 'auto' behaviour
         in place of 'smooth' */
    });
  };

  return (
    <div>
      {_DATA.currentData().map(item => {
        item.url = item.url.replace('https://', '')
        return (
          <div key={item.id} className="searchPage__result">
            <a className="searchPage__resultBreadcrumb txt-wrapped" href={'https://' + item.url} target='_blank'>
              {/* {item.pagemap?.cse_image?.length > 0 &&
                      item.pagemap?.cse_image[0]?.src && (
                        <img
                          className="searchPage__resultImage"
                          src={item.pagemap?.cse_image[0]?.src}
                          alt=""
                        />
                      )} */}
              {'https://' + item.url.replace(/[\/]/g, ' > ')}
            </a>
            <a className="searchPage__resultTitle txt-wrapped" href={'https://' + item.url} target='_blank'>
              {item.title}
            </a>
            <p className="searchPage__resultSnippet txt-wrapped max-line-2">{item.content}</p>
          </div>
        )
      })}

      <div style={{ display: 'grid', placeItems: 'center' }}>
        <Pagination
          count={count}
          page={page}
          // size="large"
          // variant="outlined"
          // shape="rounded"
          onChange={handleChange}
        />
      </div>
    </div>
  )
}

function ComponentLoader(Component) {
  return ({ isLoading, ...props }) => {
    if (!isLoading) return <Component {...props} />;
    return (
      <div style={{ display: 'grid', placeItems: 'center' }}>
        <Spinner style={{ transform: 'scale(1.5)', marginTop: '2rem' }} />
        {/* <p>Loading</p> */}
      </div>
    );
  };
}

export default SearchPage;
