import React from 'react';
import { View, VirtualizedList, Animated, StyleSheet, TextStyle, ViewStyle } from 'react-native'
import { Event } from './contracts/event';
import CalendarHeader from './components/calendarHeader';
import CalendarRow from './components/calendarRow';
import CalendarDay from './components/calendarDay';
import WeekDaysLenghtError from './errors/weekDaysLengthError';

import {
    getDaysOfCalendarMonth,
    findEventsForTheDay,
    CONTAINER_WIDTH,
} from './utils'

interface MonthViewProps {
    date: Date,
    weekDays: string[],
    events: Event[],
    headerTextStyles: TextStyle,
    dayTextStyles?: ((day: Date) => TextStyle) | TextStyle,
    todayTextStyles?: TextStyle,
    otherMonthsDayTextStyles?: TextStyle,
    otherMonthsEnabled?: boolean,
    pastMonthsCellStyles?: ViewStyle,
    cellStyles?: ((day: Date) => ViewStyle) | ViewStyle,
    renderEvent: (event: Event, index: number) => any,
    onPress?: (date: Date) => void,
    onSwipe?: (date: Date) => void,
    onSwipePrev?: (date: Date) => void,
    onSwipeNext?: (date: Date) => void,
    onScrollToIndexFailed?: ((info: {
        index: number;
        highestMeasuredFrameIndex: number;
        averageItemLength: number;
    }) => void) | undefined,
}

interface MonthViewState {
    currentDate: Date | null,
    datesList: Date[],
}

class MonthViewCalendar extends React.Component<MonthViewProps, MonthViewState> {
    static defaultProps: { 
        date: Date;
        weekDays: string[];
        headerTextStyles: {};
        dayTextStyles: {};
        otherMonthsDayTextStyles: {},
        pastMonthsCellStyles: {};
        cellStyles: {};
    };

    state: MonthViewState = {
        currentDate: null,
        datesList: [],
    }

    CONTAINER_HEIGHT: number;
    HEADER_HEIGHT: number;
    pageOffset: number;
    currentPageIndex: number;
    monthVirtualList?: VirtualizedList<any>;
    eventsGridScrollX: Animated.Value;
    now: Date;

    constructor(props: MonthViewProps) {
        super(props);
        this.now = new Date();
        this.CONTAINER_HEIGHT = 0;
        this.HEADER_HEIGHT = 50;
        this.pageOffset = 0;
        this.currentPageIndex = this.pageOffset;
        this.eventsGridScrollX = new Animated.Value(0);

        if (props.weekDays.length != 7) {
            throw new WeekDaysLenghtError(props.weekDays.length.toString());
        }

        this.state.currentDate = props.date;
        this.calculateInitialDates(this.props.date);
    }

    /**
     * Calculate initial array of dates
     */
    calculateInitialDates = (date: Date): void => {
        const initialDates: Date[] = [];

        for (let i = -this.pageOffset; i <= this.pageOffset; i += 1) {
            const centralDate = new Date(date);
            centralDate.setMonth(centralDate.getMonth() + i);
            initialDates.push(centralDate);
        }

        this.state.datesList = initialDates;
    }

    /**
     * Add new dates to dateList by referencing
     */
    appendPagesInPlace = (datesList: Date[], nPages: number): void => {
        const latest = datesList[datesList.length - 1];
        for (let i = 1; i <= nPages; i += 1) {
            const newDate = new Date(latest);
            newDate.setMonth(newDate.getMonth() + i);
            datesList.push(newDate)
        }
    }

    /**
     * Prepend new dates to dateList by referencing
     */
    prependPagesInPlace = (datesList: Date[], nPages: number): void => {
        const first = datesList[0];
        for (let i = 1; i <= nPages; i += 1) {
            const newDate = new Date(first);
            newDate.setMonth(newDate.getMonth() - i);
            datesList.unshift(newDate)
        }
    }

    /**
     * Return date object of the month that is being shown
     */
    getCurrentDate = (): Date => {
        return this.state.datesList[this.currentPageIndex];
    }

    /**
     * Change month that is being shown
     */
    goToDate = (date: Date, animated = true): void => {
        if (!this.monthVirtualList) {
            return;
        }
        const currentDate = this.state.datesList[this.currentPageIndex];
        if (
            currentDate.getMonth() == date.getMonth()
            && currentDate.getFullYear() == date.getFullYear()
        ) {
            return;
        }
      
        const index = this.state.datesList.findIndex((item) => {
            return item.getMonth() == date.getMonth()
            && item.getFullYear() == date.getFullYear();
        });
      
        this.scrollTo(index, animated);
    }

    /**
     * Move scroll of virtualized list of months to specific index
     */
    scrollTo = (index: number, animated = true): void => {
        if (this.monthVirtualList) {
            this.monthVirtualList.scrollToIndex({
                index, animated,
            });
            this.currentPageIndex = index;
        }
    }

    scrollBegin = (event: any) => {
        const {
            nativeEvent: { contentOffset },
          } = event;
          
          const { x: position } = contentOffset;
          const { date, onSwipe, onSwipePrev, onSwipeNext } = this.props;
      
          const newIndex = position > 50 ? 1 : position < -50 ? -1 : 0;
          const newDate = new Date(date.setMonth(date.getMonth() + newIndex))
  
          newIndex !== 0 && onSwipe && onSwipe(newDate);
          if (newIndex > 0) {
            onSwipeNext && onSwipeNext(newDate);
          } else if(newIndex < 0) {
            onSwipePrev && onSwipePrev(newDate);
          }
    }

    setRefOfMonthVirtualList = (ref: VirtualizedList<any>) => {
        this.monthVirtualList = ref;
    }

    renderWeekCalendar(date: Date): React.ReactNode {
        const days = getDaysOfCalendarMonth(date);

        return days.map((week, i) => (
            <CalendarRow key={`week-${i}`}>
                {week.map((day: Date, j: number) => {
                    day.setHours(23, 59, 59)
                    const isSameMonth = day.getMonth() == date.getMonth() && day.getFullYear() == date.getFullYear()
                    const isToday = day.getDate() === new Date().getDate()
                    const eventsOfDay = findEventsForTheDay(day, this.props.events)

                    const getViewStyle = typeof this.props.cellStyles === 'function' ? this.props.cellStyles : () => this.props.cellStyles
                    let viewStyles = [
                        getViewStyle(day),
                        { height: ((this.CONTAINER_HEIGHT - this.HEADER_HEIGHT) / days.length)},
                        (this.now > day ? this.props.pastMonthsCellStyles : {})
                    ];
                    
                    let textStyles
                    const getTextStyle = typeof this.props.dayTextStyles === 'function' ? this.props.dayTextStyles : () => this.props.dayTextStyles
                    if (isSameMonth) {
                        textStyles = getTextStyle(day)
                        if (isToday && this.props.todayTextStyles) {
                            textStyles = this.props.todayTextStyles
                        }
                    } else {
                        textStyles = this.props.otherMonthsDayTextStyles
                    }

                    return (
                        <CalendarDay
                            key={j}
                            index={j}
                            date={day}
                            events={eventsOfDay}
                            renderEvent={this.props.renderEvent}
                            textStyles={textStyles}
                            viewStyles={viewStyles}
                            onPressEnabled={isSameMonth || !!this.props.otherMonthsEnabled}
                            onPress={this.props.onPress}
                        />
                    )
                })}
            </CalendarRow>
        ))
    }

    componentDidUpdate(prevProps: Readonly<MonthViewProps>): void {
        if (this.props.date !== prevProps.date) {
            this.calculateInitialDates(this.props.date);
        }
    }

    render(): React.ReactNode {
        const { weekDays, headerTextStyles } = this.props;

        return (
            <View style={styles.calendarContainer} onLayout={event=> {this.CONTAINER_HEIGHT = event.nativeEvent.layout.height}}>
                <VirtualizedList
                    ref={this.setRefOfMonthVirtualList}
                    keyExtractor={(item) => item}
                    data={this.state.datesList}
                    getItemCount={(data) => data.length}
                    getItem={(data, index) => data[index]}
                    initialScrollIndex={this.pageOffset}
                    horizontal
                    renderItem={({item}) => {
                        return (
                            <View style={{ width: CONTAINER_WIDTH, height: this.HEADER_HEIGHT }}>
                                <CalendarHeader
                                weekDays={weekDays}
                                textStyles={headerTextStyles}
                                />
                                {this.renderWeekCalendar(item)}
                            </View>
                        )
                    }}
                    pagingEnabled
                    onMomentumScrollBegin={this.scrollBegin}
                    scrollEventThrottle={32}
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {
                                    contentOffset: {
                                        x: this.eventsGridScrollX,
                                    },
                                },
                            },
                        ],
                        { useNativeDriver: false },
                    )}
                    onScrollToIndexFailed={this.props.onScrollToIndexFailed}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }

}

MonthViewCalendar.defaultProps = {
    date: new Date(),
    weekDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    headerTextStyles: {},
    dayTextStyles: {},
    otherMonthsDayTextStyles: {},
    pastMonthsCellStyles: {},
    cellStyles: {},
}

const styles = StyleSheet.create({
    calendarContainer: {
        flex: 1,
        minHeight: 300,
        width: '100%',
    },
})

export default MonthViewCalendar;