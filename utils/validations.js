const isEmptyOrNull = (data) => {
  return data === null || data === "" || data === undefined;
};

const isDate = (date) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(date)) return false;
  return true;
};

const isTimeOfDay = (input) => {
  const regex = /^(Matin|Après-midi|Midi|Soir|Nuit)$/i;
  return regex.test(input);
};

const isNumber = (input) => {
  return typeof input === "number";
};

module.exports = {
  isTimeOfDay,
  isDate,
  isEmptyOrNull,
  isNumber,
};
