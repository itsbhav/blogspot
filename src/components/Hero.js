import React from 'react'
import { memo } from 'react';

const Hero = ({ user }) => {
    const handleFriend = () => {
        const x = document.getElementById('friendList');
        if (x.style.display === 'flex') x.style.display = 'none';
        else x.style.display = 'flex';
    }
  return (
    <main
       className='hero-main basic-protect'
      >
        <div
          className='hero-main-div'
        >
          <img
            src={user.imageUrl}
            alt="User"
            className='hero-image'
          />
          <h2 className='hero-clamp'>{user.username}</h2>
        </div>
        <div className='hero-main-about'>
          <h1 className='hero-clamp'>{user.displayname}</h1>
              <h3 className='hero-clamp'>{user.about}</h3>
              <div role='button' onClick={handleFriend}>{user.friendList.length} Friends</div>
        </div>
      </main>
  )
}

export default memo(Hero)