const getDates = (startDate, endDate) => {
  const dateList = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dateList.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateList;
};

module.exports = {
  getDates,
};
