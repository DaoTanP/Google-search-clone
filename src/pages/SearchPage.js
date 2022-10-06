import React, { useState, useEffect } from "react";
import "./SearchPage.css";
import useSearch from "../useSearch";
import { useStateValue } from "../StateProvider";
import { Link } from "react-router-dom";
import Search from "../components/Search";
import SearchIcon from "@material-ui/icons/Search";

import DescriptionIcon from "@material-ui/icons/Description";
import ImageIcon from "@material-ui/icons/Image";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import RoomIcon from "@material-ui/icons/Room";

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
        <Link to="/">
          <img
            className="searchPage__logo"
            src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
            alt=""
          />
        </Link>
        <div className="searchPage__headerBody">
          <Search hideButtons />

          <div className="searchPage_options">
            <div className="searchPage_optionsLeft">
              <div className="searchPage_option">
                <SearchIcon />
                <Link to="/all">All</Link>
              </div>
              <div className="searchPage_option">
                <DescriptionIcon />
                <Link to="/news">News</Link>
              </div>
              <div className="searchPage_option">
                <ImageIcon />
                <Link to="/images">Images</Link>
              </div>
              <div className="searchPage_option">
                <LocalOfferIcon />
                <Link to="/shopping">Shopping</Link>
              </div>
              <div className="searchPage_option">
                <RoomIcon />
                <Link to="/maps">Maps</Link>
              </div>
              <div className="searchPage_option">
                <MoreVertIcon />
                <Link to="/more">More</Link>
              </div>
            </div>

            <div className="searchPage_optionsRight">
              <div className="searchPage_option">
                <Link to="/settings">Settings</Link>
              </div>
              <div className="searchPage_option">
                <Link to="/tools">Tools</Link>
              </div>
            </div>
          </div>
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
        return (
          <div key={item.id} className="searchPage__result">
            <a className="searchPage__resultBreadcrumb txt-wrapped" href={'https://' + item.url}>
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
            <a className="searchPage__resultTitle txt-wrapped" href={'https://' + item.url}>
              {item.title}
            </a>
            <p className="searchPage__resultSnippet txt-wrapped max-line-2">{item.content}</p>
          </div>
        )
      })}

      <Pagination
        count={count}
        page={page}
        // size="large"
        // variant="outlined"
        // shape="rounded"
        onChange={handleChange}
      />
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
