import React, { memo } from "react";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

const RTimeAgo = ({ timestamp }) => {
  return (
    <>
      Last Edited:{" "}
      {timestamp && (
        <ReactTimeAgo date={timestamp} locale="en-Us" timeStyle="round" />
      )}
    </>
  );
};

export default memo(RTimeAgo);
