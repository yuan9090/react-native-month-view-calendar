import React from 'react';
import { VirtualizedList, Animated, TextStyle, ViewStyle } from 'react-native';
import { Event } from './contracts/event';
interface MonthViewProps {
    date: Date;
    weekDays: string[];
    events: Event[];
    headerTextStyles: TextStyle;
    dayTextStyles?: TextStyle;
    todayTextStyles?: TextStyle;
    otherMonthsDayTextStyles?: TextStyle;
    otherMonthsEnabled?: boolean;
    pastMonthsCellStyles?: ViewStyle;
    cellStyles?: ViewStyle;
    renderEvent: (event: Event, index: number) => any;
    onPress?: (date: Date) => void;
    onSwipe?: (date: Date) => void;
    onSwipePrev?: (date: Date) => void;
    onSwipeNext?: (date: Date) => void;
    onScrollToIndexFailed?: ((info: {
        index: number;
        highestMeasuredFrameIndex: number;
        averageItemLength: number;
    }) => void) | undefined;
}
interface MonthViewState {
    currentDate: Date | null;
    datesList: Date[];
}
declare class MonthViewCalendar extends React.Component<MonthViewProps, MonthViewState> {
    static defaultProps: {
        date: Date;
        weekDays: string[];
        headerTextStyles: {};
        dayTextStyles: {};
        otherMonthsDayTextStyles: {};
        pastMonthsCellStyles: {};
        cellStyles: {};
    };
    state: MonthViewState;
    CONTAINER_HEIGHT: number;
    HEADER_HEIGHT: number;
    pageOffset: number;
    currentPageIndex: number;
    monthVirtualList?: VirtualizedList<any>;
    eventsGridScrollX: Animated.Value;
    now: Date;
    constructor(props: MonthViewProps);
    /**
     * Calculate initial array of dates
     */
    calculateInitialDates: (date: Date) => void;
    /**
     * Add new dates to dateList by referencing
     */
    appendPagesInPlace: (datesList: Date[], nPages: number) => void;
    /**
     * Prepend new dates to dateList by referencing
     */
    prependPagesInPlace: (datesList: Date[], nPages: number) => void;
    /**
     * Return date object of the month that is being shown
     */
    getCurrentDate: () => Date;
    /**
     * Change month that is being shown
     */
    goToDate: (date: Date, animated?: boolean) => void;
    /**
     * Move scroll of virtualized list of months to specific index
     */
    scrollTo: (index: number, animated?: boolean) => void;
    scrollBegin: (event: any) => void;
    setRefOfMonthVirtualList: (ref: VirtualizedList<any>) => void;
    renderWeekCalendar(date: Date): React.ReactNode;
    componentDidUpdate(prevProps: Readonly<MonthViewProps>): void;
    render(): React.ReactNode;
}
export default MonthViewCalendar;
//# sourceMappingURL=index.d.ts.map