const clientId = 'ff522c7c5c2a44cc884a9220dd937d5b';
const redirectUri = 'http://localhost:3000/';
let accessToken;

export const Spotify = {

  getAccessToken() {

    //access token is present
    if (accessToken) {
      return accessToken;
    }

    //check if token is in url
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      let expiresIn = expiresInMatch[1]; //make this a number
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    }

    //set url to get token
    else {
      const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = url;
    }

  },


  search(searchTerm) {
    //get token
    const token = this.getAccessToken();

    //check there is a token
    console.log('got this far');
    const url = `https://api.spotify.com/v1/search?type=track&q=${searchTerm}`;

    return fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if(jsonResponse.tracks) {
        return jsonResponse.tracks.items.map(track => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }
        })
      }
    });
  },


  savePlaylist(playlistName, playlistTracks) {
    this.getAccessToken();

    let userId;
    let playlistId;
    let url = 'https://api.spotify.com/v1/me';

    //get user name
    fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      userId = jsonResponse.id;
    }).then(() => {

      //make playlist
      url = `https://api.spotify.com/v1/users/${userId}/playlists`;
      fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          name: playlistName
        })
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        playlistId = jsonResponse.id;
      }).then(() => {

        //add tracks
        url = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`;
        fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-type": "application/json"
          },
          body: JSON.stringify({
            uris: playlistTracks
          })
        });
      });
    });
  }

}
