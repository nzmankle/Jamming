import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import { Spotify } from '../../util/Spotify';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }


  addTrack(track) {
    //make copy of playlistTracks
    let playlistTracks = this.state.playlistTracks;

    //assume its a new track
    let newTrack = true;

    //check playlistTracks for track
    playlistTracks.forEach(playlistTrack => {
      if (track.id === playlistTrack.id) {
        //track found in playlist, not a new track
        newTrack = false;
      }
    });

    //add new track to playlistTracks and update state
    if (newTrack) {
      playlistTracks.push(track);
      this.setState({
        playlistTracks: playlistTracks
      });
    }
  }


  removeTrack(track) {
    //make copy of playlistTracks
    let playlistTracks = this.state.playlistTracks;

    //find the id of the track to remove and remove it
    for (let i = 0; i < playlistTracks.length; i++) {
      if (playlistTracks[i].id === track.id) {
        playlistTracks.splice(i, 1);
      }
    };

    //update state
    this.setState({
      playlistTracks: playlistTracks
    });
  }


  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    });
  }


  savePlaylist() {
    //check there is a playlist
    if (this.state.playlistName && this.state.playlistTracks[0]) {
      Spotify.savePlaylist(this.state.playlistName, this.state.playlistTracks.map(track => track.uri));

      //empty playlistTracks and reset playlistName
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      });
    }
  }


  search(searchTerm) {
    //check there is a search term
    if (searchTerm) {
      Spotify.search(searchTerm).then(results =>

        //display results
        this.setState({
          searchResults: results
        })
      );
    }
  }


  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
