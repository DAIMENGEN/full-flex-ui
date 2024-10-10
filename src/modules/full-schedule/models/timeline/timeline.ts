import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";
import {MountArg} from "../../../../common/models/common";
import {TimeStatus} from "../time";
import {PublicScheduleApi} from "../schedule";
import {GroupUtil} from "../../../../common/utils/group-util";
import {ScheduleViewType} from "../schedule-view";

dayjs.extend(isSameOrBefore);
dayjs.extend(quarterOfYear);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

export type TimelineSlotArg = {
    scheduleApi: PublicScheduleApi;
    date: dayjs.Dayjs;
    level?: number;
    timeText?: string;
    slotType: ScheduleViewType;
}

export type TimelineSlotLaneMountArg = MountArg<TimelineSlotArg & TimeStatus>;

export type TimelineSlotLabelMountArg = MountArg<TimelineSlotArg & TimeStatus>;

export type TimelineData = {
    years: Record<string, Array<dayjs.Dayjs>>;
    months: Record<string, Array<dayjs.Dayjs>>;
    quarters: Record<string, Array<dayjs.Dayjs>>;
    weeks: Record<string, Array<dayjs.Dayjs>>;
    days: Array<dayjs.Dayjs>;
}

export class TimelineApi {
    private start: dayjs.Dayjs;
    private end: dayjs.Dayjs;
    private timelineData: TimelineData;
    private specialWorkdays?: Array<dayjs.Dayjs>;
    private companyHolidays?: Array<dayjs.Dayjs>;
    private nationalHolidays?: Array<dayjs.Dayjs>;

    private generateTimelineData(start: dayjs.Dayjs, end: dayjs.Dayjs): TimelineData {
        let currentDate: dayjs.Dayjs = start.clone();
        const timelineData: TimelineData = {
            years: {},
            months: {},
            quarters: {},
            weeks: {},
            days: []
        };
        while (currentDate.isSameOrBefore(end, "day")) {
            // calculate year.
            const yearKey = currentDate.startOf("year").format("YYYY-MM-DD");
            timelineData.years[yearKey] = timelineData.years[yearKey] || [];
            timelineData.years[yearKey].push(currentDate.clone());
            // calculate quarter.
            const quarterKey = currentDate.startOf("quarter").format("YYYY-MM-DD");
            timelineData.quarters[quarterKey] = timelineData.quarters[quarterKey] || [];
            timelineData.quarters[quarterKey].push(currentDate.clone());
            // calculate month.
            const monthKey = currentDate.startOf("month").format("YYYY-MM-DD");
            timelineData.months[monthKey] = timelineData.months[monthKey] || [];
            timelineData.months[monthKey].push(currentDate.clone());
            // calculate week.
            const weekKey = currentDate.startOf("week").format("YYYY-MM-DD");
            timelineData.weeks[weekKey] = timelineData.weeks[weekKey] || [];
            timelineData.weeks[weekKey].push(currentDate.clone());
            // calculate day.
            timelineData.days.push(currentDate.clone());
            // next loop.
            currentDate = currentDate.add(1, "day");
        }
        return timelineData;
    }

    constructor(start: dayjs.Dayjs, end: dayjs.Dayjs) {
        this.start = start;
        this.end = end;
        this.timelineData = this.generateTimelineData(start, end);
    }

    setStart(start: dayjs.Dayjs): void {
        this.start = start;
        this.timelineData = this.generateTimelineData(start, this.getEnd());
    }

    getStart(): dayjs.Dayjs {
        return this.start;
    }

    setEnd(end: dayjs.Dayjs): void {
        this.end = end;
        this.timelineData = this.generateTimelineData(this.getStart(), end);
    }

    getEnd(): dayjs.Dayjs {
        return this.end;
    }

    getDays(): Array<dayjs.Dayjs> {
        return this.timelineData.days;
    }

    getWeeks(): Array<dayjs.Dayjs> {
        return Object.keys(this.timelineData.weeks).map(weekKey => dayjs(weekKey));
    }

    getMonths(): Array<dayjs.Dayjs> {
        return Object.keys(this.timelineData.months).map(monthKey => dayjs(monthKey));
    }

    getQuarters(): Array<dayjs.Dayjs> {
        return Object.keys(this.timelineData.quarters).map(quarterKey => dayjs(quarterKey));
    }

    getYears(): Array<dayjs.Dayjs> {
        return Object.keys(this.timelineData.years).map(yearKey => dayjs(yearKey));
    }

    setSpecialWorkdays(specialWorkdays: Array<dayjs.Dayjs>): void {
        this.specialWorkdays = specialWorkdays;
    }

    getSpecialWorkdays(): Array<dayjs.Dayjs> {
        return this.specialWorkdays || [];
    }

    setCompanyHolidays(companyHolidays: Array<dayjs.Dayjs>): void {
        this.companyHolidays = companyHolidays;
    }

    getCompanyHolidays(): Array<dayjs.Dayjs> {
        return this.companyHolidays || [];
    }

    setNationalHolidays(nationalHolidays: Array<dayjs.Dayjs>): void {
        this.nationalHolidays = nationalHolidays;
    }

    getNationalHolidays(): Array<dayjs.Dayjs> {
        return this.nationalHolidays || [];
    }

    isWeekend(target: dayjs.Dayjs): Boolean {
        return target.day() === 0 || target.day() === 6;
    }

    isHoliday(target: dayjs.Dayjs): Boolean {
        return (this.getCompanyHolidays().some(holiday => holiday.isSame(target, "day"))
                || this.getNationalHolidays().some(holiday => holiday.isSame(target, "day"))
                || this.isWeekend(target))
            && !this.getSpecialWorkdays().some(workday => workday.isSame(target, "day"))
    }

    isSpecialWorkday(target: dayjs.Dayjs): Boolean {
        return this.getSpecialWorkdays().some(workday => workday.isSame(target, "day"));
    }

    isCompanyHoliday(target: dayjs.Dayjs): Boolean {
        return this.getCompanyHolidays().some(holiday => holiday.isSame(target, "day"));
    }

    isNationalHoliday(target: dayjs.Dayjs): Boolean {
        return this.getNationalHolidays().some(holiday => holiday.isSame(target, "day"));
    }

    getDayPosition(target: dayjs.Dayjs): number {
        return this.getDays().findIndex(day => day.isSame(target, "day"));
    }

    getWeekPosition(target: dayjs.Dayjs): number {
        return this.getWeeks().findIndex(week => week.isSame(target, "week"));
    }

    getMonthPosition(target: dayjs.Dayjs): number {
        return this.getMonths().findIndex(month => month.isSame(target, "month"));
    }

    getQuarterPosition(target: dayjs.Dayjs): number {
        return this.getQuarters().findIndex(quarter => quarter.isSame(target, "quarter"));
    }

    getYearPosition(target: dayjs.Dayjs): number {
        return this.getYears().findIndex(year => year.isSame(target, "year"));
    }

    populateMonthsWithDays(): Array<{ month: dayjs.Dayjs; days: dayjs.Dayjs[]; }> {
        const monthsAndDays = [];
        const months = this.timelineData.months;
        for (const key in months) {
            const monthAndDays: { month: dayjs.Dayjs, days: Array<dayjs.Dayjs> } = {month: dayjs(), days: []};
            monthAndDays.month = dayjs(key);
            monthAndDays.days = months[key];
            monthsAndDays.push(monthAndDays);
        }
        return monthsAndDays;
    }

    populateYearsWithDays(): Array<{ year: dayjs.Dayjs; days: dayjs.Dayjs[]; }> {
        const yearsAndDays = [];
        const years = this.timelineData.years;
        for (const key in years) {
            const yearAndDays: { year: dayjs.Dayjs, days: Array<dayjs.Dayjs> } = {year: dayjs(), days: []};
            yearAndDays.year = dayjs(key);
            yearAndDays.days = years[key];
            yearsAndDays.push(yearAndDays);
        }
        return yearsAndDays;
    }

    populateYearsWithWeeks(): Array<{ year: dayjs.Dayjs; weeks: dayjs.Dayjs[]; }> {
        const weeks: dayjs.Dayjs[] = this.getWeeks();
        const groupArray = GroupUtil.groupArray<dayjs.Dayjs>(weeks, week => week.format("YYYY"));
        const yearsAndWeeks = [];
        for (const key in groupArray) {
            const yearAndWeeks: { year: dayjs.Dayjs, weeks: Array<dayjs.Dayjs> } = {year: dayjs(), weeks: []};
            yearAndWeeks.year = dayjs(key);
            yearAndWeeks.weeks = groupArray[key];
            yearsAndWeeks.push(yearAndWeeks);
        }
        return yearsAndWeeks;
    }

    populateYearsWithMonths(): Array<{ year: dayjs.Dayjs; months: dayjs.Dayjs[]; }> {
        const days = this.getDays();
        const months = Array.from(new Set(days.map(day => day.format("YYYY-MM")))).map(date => dayjs(date));
        const groupArray = GroupUtil.groupArray<dayjs.Dayjs>(months, month => month.format("YYYY"));
        const yearsAndMonths = [];
        for (const key in groupArray) {
            const yearAndMonths: { year: dayjs.Dayjs, months: Array<dayjs.Dayjs> } = {year: dayjs(), months: []};
            yearAndMonths.year = dayjs(key);
            yearAndMonths.months = groupArray[key];
            yearsAndMonths.push(yearAndMonths);
        }
        return yearsAndMonths;
    }

    populateYearsWithQuarters(): Array<{ year: dayjs.Dayjs; quarters: dayjs.Dayjs[]; }> {
        const days = this.getDays();
        const quarters = Array.from(new Set(days.map(day => day.startOf("quarter").format("YYYY-MM-DD")))).map(date => dayjs(date));
        const groupArray = GroupUtil.groupArray<dayjs.Dayjs>(quarters, quarter => quarter.format("YYYY"));
        const yearsAndQuarters = [];
        for (const key in groupArray) {
            const yearAndQuarters: { year: dayjs.Dayjs; quarters: Array<dayjs.Dayjs> } = {year: dayjs(), quarters: []};
            yearAndQuarters.year = dayjs(key);
            yearAndQuarters.quarters = groupArray[key];
            yearsAndQuarters.push(yearAndQuarters);
        }
        return yearsAndQuarters;
    }
}