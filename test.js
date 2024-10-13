// Function to calculate the total annual target, based on the input dates
function calculateTotalTarget(startDate, endDate, totalAnnualTarget) {
  // Convert the input dates (startDate and endDate) to JavaScript-readable dates
  const start = new Date(startDate);
  const end = new Date(endDate);

  // This function determines the number of days in each month
  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  // This function counts the working days in each month
  // Working days are those that are not Friday (5)
  function getWorkingDays(year, month) {
    const daysInMonth = getDaysInMonth(year, month);
    let workingDays = 0;

    // Loop through all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dayOfWeek = currentDate.getDay();

      // If the day is not Friday (5), it's a working day
      if (dayOfWeek !== 5) {
        workingDays++;
      }
    }

    return workingDays;
  }

  // This function counts the worked days within a month, based on the given dates
  // It also skips Fridays (5)
  function getWorkedDaysInMonth(year, month, start, end) {
    const daysInMonth = getDaysInMonth(year, month);
    let workedDays = 0;

    // Loop through each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);

      // Check if the current date is within the start and end range
      if (currentDate >= start && currentDate <= end) {
        const dayOfWeek = currentDate.getDay();

        // Skip Friday
        if (dayOfWeek !== 5) {
          workedDays++;
        }
      }
    }

    return workedDays;
  }

  // Create an object to store the results
  const result = {
    totalWorkedDays: 0,
    monthlyTargets: [],
    totalTarget: 0,
  };

  let totalWorkingDays = 0;

  // Loop through each month within the date range
  let currentDate = new Date(start);
  while (currentDate <= end) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get the working days for this month
    const workingDaysInMonth = getWorkingDays(year, month);
    totalWorkingDays += workingDaysInMonth;

    // Get the worked days for this month
    const workedDaysInMonth = getWorkedDaysInMonth(year, month, start, end);
    result.totalWorkedDays += workedDaysInMonth;

    // Move to the next month
    currentDate.setMonth(currentDate.getMonth() + 1);
    currentDate.setDate(1);
  }

  // Calculate the daily target by dividing the annual target by total working days
  const dailyTarget = totalAnnualTarget / totalWorkingDays;

  // Calculate the total target based on worked days
  result.totalTarget = result.totalWorkedDays * dailyTarget;

  // Calculate monthly targets (assuming each month's target is proportional to its worked days)
  currentDate = new Date(start);
  while (currentDate <= end) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const workedDaysInMonth = getWorkedDaysInMonth(year, month, start, end);
    const monthlyTarget = workedDaysInMonth * dailyTarget;
    result.monthlyTargets.push({
      year: year,
      month: month + 1, // Adding 1 because getMonth() returns 0-11
      target: monthlyTarget
    });

    // Move to the next month
    currentDate.setMonth(currentDate.getMonth() + 1);
    currentDate.setDate(1);
  }

  return result;
}

// Example usage
const startDate = '2024-01-01';
const endDate = '2024-03-31';
const totalAnnualTarget = 5220;

const targetData = calculateTotalTarget(startDate, endDate, totalAnnualTarget);
console.log(JSON.stringify(targetData, null, 2));
