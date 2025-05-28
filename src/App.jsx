import React, {useState} from 'react';
import Search from "./components/search.jsx";

const App = () => {
    const [searchTerm, setSearchTerm] = useState('')
    return (
        <main>
            <div className={"pattern"}>

            </div>
            <div className={"wrapper"}>
                <header>
                    <img src={"../public/hero.png"} alt="hero banner" />
                    <h1>Find <span className={"text-gradient"}>Movies</span> You'll Enjoy Without the Hassle</h1>
                </header>

                {/*importing first component that is from search.jsx*/}
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                <h1 className={"text-white"}>{searchTerm}</h1>
            </div>
        </main>
    );
};

export default App;