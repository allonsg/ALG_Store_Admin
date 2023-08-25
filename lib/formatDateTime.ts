const pluralize = (count: number, singular: string): string => {
  return count === 1 ? singular : `${singular}s`;
};

export const formatDateTime = (inputDateTime: string): string => {
  const currentTime = new Date();
  const dt = new Date(inputDateTime);

  const elapsedMilliseconds = currentTime.getTime() - dt.getTime();

  const minuteInMilliseconds = 60 * 1000;
  const hourInMilliseconds = 60 * minuteInMilliseconds;
  const dayInMilliseconds = 24 * hourInMilliseconds;

  if (elapsedMilliseconds < minuteInMilliseconds) {
    return "Just now";
  } else if (elapsedMilliseconds < hourInMilliseconds) {
    const minutesAgo = Math.floor(elapsedMilliseconds / minuteInMilliseconds);
    return `${minutesAgo} ${pluralize(minutesAgo, "minute")} ago`;
  } else if (elapsedMilliseconds < dayInMilliseconds) {
    const hoursAgo = Math.floor(elapsedMilliseconds / hourInMilliseconds);
    return `${hoursAgo} ${pluralize(hoursAgo, "hour")} ago`;
  } else {
    const day = dt.getDate();
    const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
      dt,
    );
    const year = dt.getFullYear();

    return `${day} ${month} ${year}`;
  }
};
