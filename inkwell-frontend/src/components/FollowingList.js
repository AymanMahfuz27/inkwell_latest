import React from 'react';
import { UserListCard } from './ListCards';

const FollowingList = ({ following }) => {
  return (
    <div className="following-list">
      <h2>Following</h2>
      {following.length > 0 ? (
        following.map(followed => <UserListCard key={followed.id} user={followed} />)
      ) : (
        <p>Not following anyone yet.</p>
      )}
    </div>
  );
};

export default FollowingList;