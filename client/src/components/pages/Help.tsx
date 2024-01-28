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
          as "friends." If you Edit your profile, you can add friends, after
          which clicking on their icon will show you all their public favorites.
        </p>
        <p>Give our site a go, we hope you like it!</p>
      </div>
    </div>
  );
};

export default Help;
