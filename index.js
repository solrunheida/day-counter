// Things to consider:
// - Start date is not included but the end date is included.
// - I won't guarantee the program calculates every case correctly.
// - Validation of input can be improved.
// - There is no check if end date is newer than start date.
// - Styling can be improved.

let months = [31,28,31,30,31,30,31,31,30,31,30,31];

function calculate(e){
    e.preventDefault();
    document.getElementById("total-days").innerHTML = "";
    let startDateString = document.getElementById("start-date").value;
    let endDateString = document.getElementById("end-date").value;
    if(isFormValid(startDateString, endDateString) == true){
        let days = countDays(startDateString, endDateString);
        document.getElementById("total-days").innerHTML = days + " days";
    }else{
        document.getElementById("total-days").innerHTML = "The input is not valid";
    }
}

function isFormValid(start, end){
    if((start != null && start != "") && (end != null && end != "")){
        // RegEx found here: https://stackoverflow.com/questions/15491894/regex-to-validate-date-formats-dd-mm-yyyy-dd-mm-yyyy-dd-mm-yyyy-dd-mmm-yyyy
        let dateRegEx = /^(?:(?:31(\/)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
        if((start.match(dateRegEx)) && (end.match(dateRegEx))){
            return true;
        }
    }
    return false;
}

function countDays(start, end){
    let startDate = parseDate(start);
    let startYear = startDate[2];
    let startMonth = startDate[1];
    let startDay = startDate[0];
    
    let endDate = parseDate(end);
    let endYear = endDate[2];
    let endMonth = endDate[1];
    let endDay = endDate[0];

    let yearDiff = endYear-startYear;
    let monthDiff = endMonth-startMonth;

    let totalDays = 0;
    
    // if dates are in same year and month only subtract days
    if(yearDiff == 0 && monthDiff == 0){
        totalDays += endDay - startDay;
    }else{
        if(yearDiff > 1){ // calculate number of full years
            totalDays += (yearDiff - 1) * 365;
            let firstFullYear = startYear + 1;
            let lastFullYear = endYear - 1;
            let extraDays = getExtraDaysFromLeapYears(firstFullYear, lastFullYear);
            totalDays += extraDays;
        }
    
        let firstWholeMonthIndex = startMonth;
        let lastWholeMonthIndex = endMonth - 2;

        if(yearDiff == 0){ // date in same year
            totalDays += sumDaysInFullMonths(firstWholeMonthIndex, lastWholeMonthIndex, startYear);
        }else{
            totalDays += sumDaysInFullMonths(firstWholeMonthIndex, 11, startYear);
            totalDays += sumDaysInFullMonths(0, lastWholeMonthIndex, endYear);
        }
    
        if(startMonth == 2){
            if(isLeapYear(startYear) == true){
                totalDays += 1;
            }
        }
        totalDays += months[startMonth-1] - startDay + endDay; // the remaining days in the first month and all until the enda day
    }
    return totalDays;
}

function sumDaysInFullMonths(startMonth, endMonth, year){
    let sum = 0;
    
    if(startMonth <= 1 && endMonth >= 1 && isLeapYear(year) == true){ //february included
        sum += 1;
    }

    for(let i = startMonth; i <= endMonth; i++){
        sum += months[i];
    }
    return sum;
}

function isLeapYear(year){
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

function parseDate(dateString){
    return dateString.split("/").map(Number);
}

function getExtraDaysFromLeapYears(first, last){
    let year = first;
    let extraDays = 0;
    
    while(year <= last){
        if(isLeapYear(year) == true){
            extraDays++;
        }
        year++;
    }
    return extraDays;
}