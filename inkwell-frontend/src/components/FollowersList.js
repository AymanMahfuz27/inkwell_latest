import React from 'react';
import { UserListCard } from './ListCards';

const FollowersList = ({ followers }) => {
  return (
    <div className="followers-list">
      <h2>Followers</h2>
      {followers.length > 0 ? (
        followers.map(follower => <UserListCard key={follower.id} user={follower} />)
      ) : (
        <p>No followers yet.</p>
      )}
    </div>
  );
};

export default FollowersList;