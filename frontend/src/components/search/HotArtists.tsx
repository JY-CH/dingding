import React from 'react';

interface Artist {
  id: number;
  name: string;
  thumbnail: string;
}

interface HotArtistsProps {
  artists: Artist[];
}

const HotArtists: React.FC<HotArtistsProps> = ({ artists }) => {
  return (
    <div>
      <h2 className="text-white text-xl font-bold mb-4">🔥 핫한 아티스트</h2>
      <ul className="space-y-4">
        {artists.map((artist) => (
          <li key={artist.id} className="flex items-center space-x-4">
            <img src={artist.thumbnail} alt={artist.name} className="w-16 h-16 rounded-full" />
            <p className="text-white font-semibold">{artist.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HotArtists;
