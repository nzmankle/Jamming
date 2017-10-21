import React from 'react';
import Track from '../Track/Track';
import './TrackList.css';

class TrackList extends React.Component {
  listTracks() {

    let tracks = this.props.tracks.map(
      track => <Track
        key={track.id}
        isRemoval={this.props.isRemoval}
        track={track}
        onAdd={this.props.onAdd}
        onRemove={this.props.onRemove} />);

    return tracks;
  }

  render() {
    return (
      <div className="TrackList">
          {this.listTracks()}
      </div>
    );
  }
};

export default TrackList;
