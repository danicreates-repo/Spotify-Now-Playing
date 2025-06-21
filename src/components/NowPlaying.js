import React, { useState, useEffect, useRef, useCallback } from 'react';
import './NowPlaying.css';
import axios from 'axios';

const POLLING_INTERVAL = 10000; // 10 seconds

function NowPlaying() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayProgressMs, setDisplayProgressMs] = useState(0);

  const pollIntervalRef = useRef();
  const progressIntervalRef = useRef();

  const fetchCurrentTrack = useCallback(async () => {
    try {
      setError(null);
      const { data } = await axios.get('/api/now-playing');

      if (data && data.item) {
        setCurrentTrack(data);
        setDisplayProgressMs(data.progress_ms);
      } else {
        setCurrentTrack(null);
      }

    } catch (error) {
      console.error('Error fetching from backend:', error);
      setError('Failed to fetch from server. Is it running?');
      clearInterval(pollIntervalRef.current);
    } finally {
      if (isInitialLoading) {
        setIsInitialLoading(false);
      }
    }
  }, [isInitialLoading]);

  // Effect for polling the backend API
  useEffect(() => {
    fetchCurrentTrack();
    pollIntervalRef.current = setInterval(fetchCurrentTrack, POLLING_INTERVAL);
    return () => clearInterval(pollIntervalRef.current);
  }, [fetchCurrentTrack]);

  // Effect for the local progress bar timer
  useEffect(() => {
    clearInterval(progressIntervalRef.current);

    if (currentTrack?.is_playing) {
      progressIntervalRef.current = setInterval(() => {
        setDisplayProgressMs(prevProgress => {
          const newProgress = prevProgress + 1000;
          if (newProgress >= currentTrack.item.duration_ms) {
            setTimeout(fetchCurrentTrack, 1500);
            clearInterval(progressIntervalRef.current);
            return currentTrack.item.duration_ms;
          }
          return newProgress;
        });
      }, 1000);
    }

    return () => clearInterval(progressIntervalRef.current);
  }, [currentTrack, fetchCurrentTrack]);

  const formatTime = (ms) => {
    if (!ms) return '0:00';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleJoinParty = () => {
    if (currentTrack && currentTrack.item) {
      const spotifyUri = currentTrack.item.uri;
      window.open(spotifyUri, '_blank');
    }
  };

  const albumArtUrl = currentTrack?.item?.album?.images?.[0]?.url;

  const renderContent = () => {
    if (isInitialLoading) {
      return (
        <div className="container">
          <div className="card">
            <div className="loading-spinner"></div>
            <p>Loading current track...</p>
          </div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="container">
          <div className="card">
            <div className="error-message">{error}</div>
            <button className="btn" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </div>
      );
    }
  
    if (!currentTrack || !currentTrack.item) {
      return (
        <div className="container">
          <div className="card">
            <h2>Nothing Currently Playing</h2>
            <p>Start playing a track on Spotify to see it here!</p>
            <button className="btn" onClick={() => window.location.reload()}>
              Refresh
            </button>
          </div>
        </div>
      );
    }
  
    const track = currentTrack.item;
    const isPlaying = currentTrack.is_playing;
    const progressPercent = (displayProgressMs / track.duration_ms) * 100;
  
    return (
      <div className="container">
        <div className="card now-playing-card">
          <div className="header">
            <h1>Now Playing</h1>
          </div>
  
          <div className="track-info">
            <div className="album-art">
              <img 
                src={track.album.images[0]?.url || '/placeholder-album.png'} 
                alt={`${track.album.name} cover`}
                className="album-cover"
              />
              {isPlaying && <div className="playing-indicator">▶</div>}
            </div>
  
            <div className="track-details">
              <h2 className="track-title">{track.name}</h2>
              <p className="track-artist">{track.artists.map(artist => artist.name).join(', ')}</p>
              <p className="track-album">{track.album.name}</p>
            </div>
          </div>
  
          <div className="progress-section">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="time-info">
              <span>{formatTime(displayProgressMs)}</span>
              <span>{formatTime(track.duration_ms)}</span>
            </div>
          </div>
  
          <div className="actions">
            <button className="btn join-party-btn" onClick={handleJoinParty}>
              🎵 Join the Party
            </button>
            <p className="join-party-info">
              Click to open this track in your Spotify app
            </p>
          </div>
  
          <div className="track-metadata">
            <div className="metadata-item">
              <span className="label">Release Date:</span>
              <span>{new Date(track.album.release_date).getFullYear()}</span>
            </div>
            <div className="metadata-item">
              <span className="label">Popularity:</span>
              <span>{track.popularity}%</span>
            </div>
            {track.explicit && (
              <div className="metadata-item">
                <span className="explicit-badge">EXPLICIT</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div 
        className={`background-art ${albumArtUrl ? 'active' : ''}`}
        style={{ backgroundImage: albumArtUrl ? `url(${albumArtUrl})` : 'none' }}
      ></div>
      {renderContent()}
    </>
  )
}

export default NowPlaying;