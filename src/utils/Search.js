import React, { useEffect, useRef } from "react";

const Search = ({ query, setQuery }) => {
  const inputEL = useRef(null);

  useEffect(() => {
    inputEL.current.focus();
  }, []);

  return (
    <div>
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={inputEL}
      />
    </div>
  );
};

export default Search;
