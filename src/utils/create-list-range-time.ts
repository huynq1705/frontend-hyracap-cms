import dayjs from "dayjs";

export const createRangeTime = (
    unit = 30,
    start_time = "00:00:00",
    end_time = "24:00:00"
) => {
    // Convert start_time and end_time to timestamps
    const start = new Date(`1970-01-01T${start_time}Z`).getTime();
    const end = new Date(`1970-01-01T${end_time}Z`).getTime();

    // Initialize an array to store the time slots
    const slots = [];
    let currentTime = start;
    let index = 1;

    // Loop to create time slots until the end time
    while (currentTime < end) {
        const nextTime = new Date(currentTime + unit * 60 * 1000); // Calculate the next time slot
        const formattedCurrent = new Date(currentTime)
            .toISOString()
            .substr(11, 5); // Format current time
        const formattedNext = nextTime.toISOString().substr(11, 5); // Format next time
        // Push the time slot into the slots array
        slots.push(
            {
                value: formattedCurrent,
                label: formattedCurrent,
            }
            // { value: formattedNext, label: formattedNext },
        );

        currentTime = nextTime.getTime(); // Update currentTime to next time slot
        index++; // Increment index
    }

    // Return the array of time slots
    return slots;
};
export function isCurrentTimeInRange(timeRange: string): boolean {
    const currentTime = dayjs();
    const isInRange = currentTime.isAfter(dayjs(timeRange, "HH:mm"));
    return isInRange;
}
