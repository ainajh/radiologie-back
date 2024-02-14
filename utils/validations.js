const isEmptyOrNull =  (data) =>{
    return data === null  || data === "" || data === undefined;
}

const isDate =  (date) =>{

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(date)) return false;
    return true;

}

const isTimeOfDay =  (input) => {
    const regex = /^(Morning|Afternoon|Evening|Night)$/i;
    return regex.test(input);
}

module.exports = {
    isTimeOfDay,
    isDate,
    isEmptyOrNull
};
