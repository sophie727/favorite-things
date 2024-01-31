import React, { useState, useEffect } from "react";

import "./Help.css";

type Props = {};

const Help = (props: Props) => {
  return (
    <div className="help">
      <h1 className="u-textCenter">What is this site?</h1>
      <div className="helpText">
        <p>
          This is a site where you can store all your favorites for future
          reference. The hope is that, when you're feeling a bit sad, you might
          pull up this site and feel a bit cheered. At the top of your homepage,
          we've highlighted a random favorite for you to enjoy.
        </p>
        <p>
          If you click open your profile page, note that there are such things
          as "friends." To add friends, go to the Community page (or click on
          the + button in your profile), search for your friend's name, click on
          their profile, and send them a friend request. After you become
          friends, you can see each others' public favorites!
        </p>
        <p>Give our site a go. We hope you like it!</p>
        <p>
          Some caveats: Tags cannot have commas in them, and cannot be the empty
          string.
        </p>
      </div>
    </div>
  );
};

export default Help;
