import { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = "YOUR_TENOR_API_KEY";

const GifPicker = ({ onSelect }) => {
  const [gifs, setGifs] = useState([]);
  const [search, setSearch] = useState("");

  const fetchGifs = async (query = "funny") => {
    try {
      const res = await axios.get(
        `https://g.tenor.com/v1/search?q=${query}&key=${API_KEY}&limit=20`
      );
      setGifs(res.data.results);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchGifs();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchGifs(e.target.value);
  };

  return (
    <div className="bg-gray-800 p-3 rounded-lg">
      <input
        type="text"
        placeholder="Search GIF..."
        value={search}
        onChange={handleSearch}
        className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
      />

      <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
        {gifs.map((gif) => (
          <img
            key={gif.id}
            src={gif.media[0].gif.url}
            alt="gif"
            className="cursor-pointer rounded"
            onClick={() => onSelect(gif.media[0].gif.url)}
          />
        ))}
      </div>
    </div>
  );
};

export default GifPicker;