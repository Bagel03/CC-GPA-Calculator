export const getCurrentSchoolYear = () => {
    const date = new Date();
    const currYear = date.getFullYear();
    const month = date.getMonth();

    let schoolYear = currYear.toString();
    if (month < 6) {
        schoolYear = currYear - 1 + " - " + schoolYear;
    } else {
        schoolYear = schoolYear + " - " + (currYear + 1);
    }

    return schoolYear;
};
