import React from 'react';
import { Event } from '../contracts/event';
interface CalendarDayProps {
    index: number;
    date: Date;
    renderEvent: (value: Event, index: number, array: Event[]) => React.ReactNode;
    events: Event[];
    textStyles: {} | [];
    viewStyles: {} | [];
    onPress?: (date: Date) => void;
}
declare class CalendarDay extends React.Component<CalendarDayProps> {
    static defaultProps: {
        textStyles: {};
        viewStyles: {};
    };
    render(): React.JSX.Element;
}
export default CalendarDay;
//# sourceMappingURL=calendarDay.d.ts.map