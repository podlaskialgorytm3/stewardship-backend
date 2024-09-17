import { WorkScheduleModal } from "../../models/work-schedule";

class WorkScheduleValidate {
  month: number;
  year: number;
  monthDays: { [key: number]: number };
  constructor() {
    this.month = new Date().getMonth() + 2 > 12 ? 1 : new Date().getMonth() + 2;
    this.year =
      this.month > 12 ? new Date().getFullYear() + 1 : new Date().getFullYear();
    this.monthDays = {
      1: 31,
      2: this.year % 4 === 0 ? 29 : 28,
      3: 31,
      4: 30,
      5: 31,
      6: 30,
      7: 31,
      8: 31,
      9: 30,
      10: 31,
      11: 30,
      12: 31,
    };
  }
  public isDayOffMonth = ({
    days,
    month,
    quantityOfDays,
  }: {
    days: string[];
    month: number;
    quantityOfDays: number;
  }) => {
    try {
      for (let i = 0; i < quantityOfDays; i++) {
        const dayNumber = parseInt(days[i]);
        if (dayNumber < 1 || dayNumber > this.monthDays[month]) {
          return true;
        }
      }
      return false;
    } catch (error) {
      return {
        type: "error",
        message: "An error occurred while validating the days: " + error,
      };
    }
  };
  public isDayUsed = async ({
    groupUserId,
    days,
    month,
    year,
  }: {
    groupUserId: string;
    days: string[];
    month: number;
    year: number;
  }) => {
    try {
      const data = await Promise.all(
        days.map(async (day) => {
          const workSchedule = await WorkScheduleModal.findOne({
            where: {
              groupUserId,
              day,
              month,
              year,
            },
          });
          if (workSchedule) {
            return true;
          }
          return false;
        })
      );
      return data.includes(true);
    } catch (error) {
      return {
        type: "error",
        message: "An error occurred while checking if day is working: " + error,
      };
    }
  };
  public checkIfDaysAreSame = ({ days }: { days: string[] }) => {
    try {
      const daysSet = new Set(days);
      return days.length !== daysSet.size;
    } catch (error) {
      return true;
    }
  };
}

export { WorkScheduleValidate };
