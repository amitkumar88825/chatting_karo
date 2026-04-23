// GifPicker.jsx
import React, { useState } from "react";
import { Grid } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";

const API_KEY = import.meta.env.VITE_GIPHY_API_KEY;
const gf = new GiphyFetch(API_KEY);

const GifPicker = ({ onSelect }) => {
  const [search, setSearch] = useState("");

  const fetchGifs = (offset) => {
    if (search.trim()) {
      return gf.search(search, { offset, limit: 20 });
    }
    return gf.trending({ offset, limit: 20 });
  };

  return (
    <div className="w-80 bg-gray-800 rounded-lg shadow-xl overflow-hidden">
      <div className="p-3 border-b border-gray-700">
        <input
          type="text"
          placeholder="Search GIFs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      </div>
      <div className="max-h-80 overflow-y-auto p-3">
        <Grid
          key={search}
          width={290}
          columns={3}
          gutter={6}
          fetchGifs={fetchGifs}
          onGifClick={(gif) => onSelect(gif.images.fixed_height.url)}
          hideAttribution
          noLink
        />
      </div>
    </div>
  );
};

export default GifPicker;