import moment from "moment";


export function formatDateToMDY(dateString: string) {
    return moment(dateString).format('MM-DD-YYYY');
}

export function formatDateToMonthDayYear(dateString: string) {
    return moment(dateString).format('MMMM DD, YYYY');
}

export function formatDateToMonthDDYYYY(dateString: string) {
    return moment(dateString).format('MMM D, YYYY');
}

export function formatDateToMMMDDYYYY(dateString: string) {
    const formattedTime = moment(dateString).format('h:mma');
    return `${moment(dateString).format('MMM D, YYYY')} ${formattedTime}`;
}

export function formatTimeHmma(dateString: string) {
    // const formattedTime = moment(dateString).format('h:mma');
    return `${moment(dateString).format('h:mma')}`;
}

// Function to convert a UTC datestring to CST date in the format 'MMM D, YYYY'
export function utcToCstDate(utcDatestring: string): string {
    try {
        // Parse the UTC datetime object
        const utcDatetime = moment(utcDatestring);

        // Calculate the CST timezone offset
        const cstOffset = moment.duration(-6, 'hours');

        // Convert UTC datetime to CST datetime
        const cstDatetime = utcDatetime.clone().add(cstOffset);

        // Format the CST date in the correct format
        return cstDatetime.format('MMM D, YYYY');
    } catch (error) {
        return 'Error: Invalid date format';
    }
}

// Function to extract the time in the format 'h:mma' from a UTC datestring
export function extractTime(utcDatestring: string): string {
    try {
        // Parse the UTC datetime object
        const utcDatetime = moment(utcDatestring);

        // Extract and format the time
        return utcDatetime.format('h:mma');
    } catch (error) {
        return 'Error: Invalid date format';
    }
}