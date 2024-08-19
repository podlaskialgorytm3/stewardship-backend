const convertDate = (dateString: string) => {
  const date = new Date(dateString);
  date.setHours(date.getHours() + 2);
  const newDateString = date.toISOString().slice(0, 19);
  return newDateString;
};

export { convertDate };
