class WorkScheduleUtils {
  public calculateWorkTimeDecimal({
    startTime,
    endTime,
  }: {
    startTime: string | null;
    endTime: string | null;
  }): number {
    const timeToMinutes = (time: string): number => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const startMinutes = timeToMinutes(startTime || "");
    const endMinutes = timeToMinutes(endTime || "");

    const totalMinutes =
      endMinutes >= startMinutes
        ? endMinutes - startMinutes
        : 24 * 60 - startMinutes + endMinutes;

    const totalHoursDecimal = totalMinutes / 60;

    return totalHoursDecimal;
  }
  public sumHours = ({ hours }: { hours: number[] }) => {
    return hours.reduce((acc, curr) => acc + curr, 0);
  };
}

export { WorkScheduleUtils };
