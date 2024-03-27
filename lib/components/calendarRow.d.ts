import React from 'react';
interface CalendarRowProps {
    children: React.ReactNode;
    borderColor: string;
}
declare class CalendarRow extends React.Component<CalendarRowProps> {
    static defaultProps: {
        borderColor: string;
    };
    render(): React.JSX.Element;
}
export default CalendarRow;
//# sourceMappingURL=calendarRow.d.ts.map