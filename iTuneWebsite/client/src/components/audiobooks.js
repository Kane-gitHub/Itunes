//IMPORTED LIBRARIES
//REACT, AXIOS, SEARCH.CSS, PAGE NAV, FAVOURITES, BOOTSTRAP BUTTONS
import React from "react";
import axios from "axios";
import "../search.css";
import PageNavigation from "./PageNavigation";
import Favorite from "./Favorite";
import { Button } from "reactstrap";


class AudioBooks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: "",
      Results: {},
      loading: false,
      message: "",
      totalResult: 0,
      totalPages: 0,
      currentPageNo: 0,
      favoriteList: []
    };
    this.cancel = "";
  }

  // USING MATHFLOOR TO GET THE PAGECOUNT
  // return Math.floor(total / denominator) + valueToBeAdded

  getPageCount = (total, denominator) => {
    const divisible = 0 === total % denominator;
    const valueToBeAdded = divisible ? 0 : 1;
    return Math.floor(total / denominator) + valueToBeAdded;
  };

  // AUTOMATIC PAGE UPDATES WHEN SEARCH RESULTS ARE RETURNED

  componentWillMount = (updatedPageNo = "", query) => {
    let pageNumber = updatedPageNo ? `&page=${updatedPageNo}` : "";
    const searchUrl = `/audiobooks/${query}/${pageNumber}`;

    // CANCEL SEARCH RESULTS IF A USER DELETES OR CHANGES THEIR SEARCH REQUEST
    if (this.cancel) {
      this.cancel.cancel();
    }
    this.cancel = axios.CancelToken.source();

    axios
      .get(searchUrl, {
        cancelToken: this.cancel.token
      })
      .then(res => {
                                                                        // TOTAL RESPONSE OF SEARCH RESULTS RETURNED
        const total = res.data.resultCount;
        const totalPagesCount = this.getPageCount(total, 20);
        const resultNotFound = !res.data.results.length
          ? "There are no more search results. Please try a new search"
          : "";
                                                                        // STATE SET FOR FOR SEARCH
        this.setState({
          Results: res.data.results,
          message: resultNotFound,
          totalResult: total,
          totalPages: totalPagesCount,
          currentPageNo: updatedPageNo,
          loading: false
        });
      })
      .catch(error => {
        if (axios.isCancel(error) || error) {
          this.setState({
            loading: false,
            message: ""
          });
        }
      });
  };

  // IF NO RESULTS ON THE QUERY THE STATE GETS SET BACK TO EMPTY

  handleOnInputChange = event => {
    const query = event.target.value;
    if (!query) {
      this.setState({
        query,
        Results: {},
        message: "",
        totalPages: 0,
        totalResult: 0
      });
    } else {
      this.setState({ query: query, loading: true, message: "" }, () => {
        this.componentWillMount(1, query);
      });
    }
  };

  handlePageClick = (type, e) => {
    e.preventDefault();
    const updatedPageNo =
      "Prev" === type
        ? this.state.currentPageNo - 1
        : this.state.currentPageNo + 1;

    
    // CURRENT PAGE STATE
    //if (!this.state.loading) {
      //this.setState({ loading: true, message: "" }, () => {
        //this.componentWillMount(updatedPageNo, this.state.query)


    if (!this.state.loading) {
      this.setState({ loading: true, message: "" }, () => {
        this.componentWillMount(updatedPageNo, this.state.query);
      });
    }
  };

  // ADD TO FAVOURITES VARIABLE CREATED AND DECLARED
  // LET ITEM = ID, LINK, TITLE, IMG

  addToFavorite = (index, collectionViewUrl, artistName, artworkUrl100) => {
    const { favoriteList } = this.state;

    let item = {
      id: index,
      link: collectionViewUrl,
      title: artistName,
      img: artworkUrl100
    };

    this.setState({ favoriteList: [...favoriteList, item] });

    console.log(favoriteList);
  };

  // SETTING THE STATE FOR SEARCH RESULTS AND RETURNING THE DOM
  renderSearchResults = () => {
    const { Results } = this.state;
    if (Object.keys(Results).length && Results.length) {
      return (
        <div className="results-container">
          {Results.map((result, index) => {
            return (
              <div className="result-item">
                <a key={index} href={result.collectionViewUrl}>
                  <h6 className="image-username">{result.artistName}</h6>
                  <div className="image-wraper">
                    <img
                      className="image"
                      src={result.artworkUrl100}
                      alt={result.artistName}
                    />
                  </div>
                </a>
                <div>
                  <Button
                    color="outline-primary"
                    size="sm"
                    onClick={this.addToFavorite.bind(
                      this,
                      index,
                      result.collectionViewUrl,
                      result.artistName,
                      result.artworkUrl100
                    )}
                  >
                    Add To Favourites
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  };

  // NEXT AND PREVIOUS PAGE BUTTONS

  render() {
    const {
      query,
      loading,
      message,
      currentPageNo,
      totalPages,
      favoriteList
    } = this.state;
    
    const showPrevLink = 1 < currentPageNo;
    const showNextLink = totalPages > currentPageNo;
    console.log(favoriteList);

    return (
      <div className="container">
        {/* FAVOURITE PROPS */}
        <Favorite favoriteList={favoriteList} />

        {/* HEADING*/}
        <h2 className="heading">Search For Audio Books</h2>
        <label className="search-label" htmlFor="search-input">
          <input
            type="text"
            name="query"
            value={query}
            id="search-input"
            placeholder="Search..."
            onChange={this.handleOnInputChange}
          />
          <i className="fa fa-search search-icon" aria-hidden="true" />
        </label>

        {/* MESSAGE */}
        {message && <p className="message"> {message}</p>}

      

        {/* RESULTS */}
        {this.renderSearchResults()}

        {/* NAV */}
        <PageNavigation
          loading={loading}
          showPrevLink={showPrevLink}
          showNextLink={showNextLink}
          handlePrevClick={e => this.handlePageClick("prev", e)}
          handleNextClick={e => this.handlePageClick("next", e)}
        />
      </div>
    );
  }
}

export default AudioBooks;
