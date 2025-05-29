import React, {useEffect, useState} from 'react';
import Search from "./components/search.jsx";
import Spinner from "./components/spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";

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


    const fetchMovies = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            // const endpoint = `${API_BASE_URL}/search/movies`;
            const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

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
        } catch (e) {
            console.log(`Error fetching movies: ${e.message}`);
            setErrorMessage(`Error fetching movies. Please try again later ${e.message}`);
        }finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMovies();
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

                <section className={"all-movies"}>
                    <h2 className={"mt-[40px]"}>All Movies</h2>
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