import React from 'react';
import '../styles/myspotify.css'

function MySpotifyPlaylist() {
  return (
    <div>
      <main className="main-content" style={{ paddingBottom: '50px' }}>
        <h1 style={{ marginBottom: '10px' }}>My Spotify Playlist</h1>
        {/* Embed Spotify Playlist */}
        <iframe
          title="Hibiki 30s"
          src="https://open.spotify.com/embed/playlist/6HiidJWEpLnnAuFHy3ukPN?utm_source=generator"
          width="100%"
          height="380"
          frameBorder="0"
          allowtransparency="true"
          allow="encrypted-media"
        ></iframe>
      
        {/* Prompt and button to connect on Spotify */}
        <div className="spotify-connect">
          <a href="https://ivoryle82.github.io/portfolio/compatibility" className="spotify-button" id="spotify-login-button">
            <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_Black.png" alt="Spotify Logo" className="spotify-logo" /> Let's connect on Spotify
          </a>
        </div>
      </main>
    </div>
  );
}

export default MySpotifyPlaylist;
// https://ivoryle82.github.io/

