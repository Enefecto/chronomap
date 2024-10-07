// components/CityList.jsx
import React from 'react';

const CityList = ({ cities, flyToCity }) => (
  <div className="bg-slate-700 text-white p-4 overflow-y-auto">
    <h1 className="text-4xl text-center border-b-2 border-red-600 pb-1 mb-5">
      Chrono Map de Chile
    </h1>
    <ul>
      {cities.map((city, index) => (
        <li
          key={index}
          className="cursor-pointer hover:text-yellow-300 my-2"
          onClick={() => flyToCity(city.lat, city.lng)}
        >
          {city.name}
        </li>
      ))}
    </ul>
  </div>
);

export default CityList;
