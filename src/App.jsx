import React, {useEffect, useState} from 'react';
import Search from "./components/search.jsx";
import Spinner from "./components/spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import {useDebounce} from 'react-use';
import {updateSearchCount} from "./appwrite.js";
import {getTrendingMovies} from "./appwrite.js";

// define url
const API_BASE_URL = "https://api.themoviedb.org/3/";
// define api key
const API_KEY = import.meta.env.VITE_API_KEY;
// console.log(API_BASE_URL);
// console.log(API_KEY);
// define api options
const API_OPTIONS = {
    method: "GET",
    headers: {
        accept: "application/json",
        authorization: `Bearer ${API_KEY}`
    }
}

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [movieList, setMovieList] = useState([]);
    // loading in React is like while a data is loading it shows some kind of loading
    const [loading, setLoading] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [trendingMovies,setTrendingMovies] = useState([]);

    useDebounce(() => {setDebouncedSearchTerm(searchTerm)}, 200,[searchTerm]);

    // it debounces the search term from making too many request to the website
    const fetchMovies = async (query = '') => {
        setLoading(true);
        setErrorMessage('');
        try {
            // const endpoint = `${API_BASE_URL}/search/movies`;
            const endpoint = query
            ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
            : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

            const response = await fetch(endpoint,API_OPTIONS);
            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }
            const data = await response.json();
            if (data.response === 'False'){
                setErrorMessage(data.Error || 'Failed to fetch movies');
                setMovieList([]);
                return;
            }
            // console.log(data.results);
            setMovieList(data.results || []);

            if(query && data.results.length > 0){
                await updateSearchCount(query,data.results[0]);
            }

        } catch (e) {
            console.log(`Error fetching movies: ${e.message}`);
            setErrorMessage(`Error fetching movies. Please try again later ${e.message}`);
        }finally {
            setLoading(false);
        }
    }

    const loadTrendingMovies = async () => {
        try{
            const movies = await getTrendingMovies();

            setTrendingMovies(movies);
        }catch(error){
            console.error(`Error fetching trending movies: ${error.message}`);
        }
    }



    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
    }, [searchTerm]);

    useEffect(() => {
        loadTrendingMovies();
    }, []);
    return (
        <main>
            <div className={"pattern"}>

            </div>
            <div className={"wrapper"}>
                <header>
                    <img src={"../public/hero.png"} alt="hero banner"/>
                    <h1>Find <span className={"text-gradient"}>Movies</span> You'll Enjoy Without the Hassle</h1>
                    {/*importing first component that is from search.jsx*/}
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
                    {/*<h1 className={"text-white"}>{searchTerm}</h1>*/}
                </header>

                {trendingMovies.length>0 && (
                    <section className={"trending"}>
                        <h2>Trending Movies</h2>
                        <ul>
                            {trendingMovies.map((movie,index) => (
                                <li key={movie.$id}>
                                    <p>{index+1}</p>
                                    <img src={movie.poster_url} alt={movie.title}/>
                                </li>
                            ))}
                        </ul>
                    </section>
                    )}

                <section className={"all-movies"}>
                    <h2>All Movies</h2>
                    {loading ?(
                       <Spinner/>
                    ): errorMessage ?(
                        <p className={"text-red-500"}>{errorMessage}</p>
                    ) : (
                        <ul>{movieList.map((movie)=>(
                            <MovieCard key={movie.id} movie={movie}/>
                        ))}</ul>
                    )
                    }


                </section>
            </div>
        </main>
    );
};

export default App;