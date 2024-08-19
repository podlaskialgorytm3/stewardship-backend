const convertDate = (dateString: string) => {
  const date = new Date(dateString);

  console.log("DATA POWAŻNA", dateString);

  date.setHours(date.getHours() + 2);
  const newDateString = date.toISOString().slice(0, 19);

  console.log("DATA NOWA POWAŻNA", newDateString);

  return newDateString;
};

export { convertDate };
