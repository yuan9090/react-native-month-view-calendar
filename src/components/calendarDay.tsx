import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Event } from '../contracts/event';

interface CalendarDayProps {
    index: number;
    date: Date,
    renderEvent: (value: Event, index: number, array: Event[]) => React.ReactNode;
    events: Event[];
    textStyles: {} | [];
    viewStyles: {} | [];
    onPressEnabled: boolean;
    onPress?: (date: Date) => void;
}

class CalendarDay extends React.Component<CalendarDayProps> {
  static defaultProps: { textStyles: {}; viewStyles: {}; };

  render() {
    const { index, date, renderEvent, events, textStyles, onPress, onPressEnabled } = this.props;
    const cellStyles: any[] = [styles.cell];
    if (index === 0) {
        cellStyles.push(styles.leftBorder);
    }

    if (Array.isArray(this.props.viewStyles)) {
        cellStyles.push(...this.props.viewStyles);
    } else {
        cellStyles.push(this.props.viewStyles);
    }

    return (
        <View key={date.getTime()} style={cellStyles}>
            <TouchableOpacity disabled={!onPressEnabled} style={styles.touchableOpacity} onPress={() => onPress && onPress(date)}>
                {
                    Platform.OS === 'ios'
                    ?   <View style={[styles.textView, textStyles]}>
                            <Text style={textStyles}>
                                {date.getDate()}
                            </Text>
                        </View>
                    :   <Text style={[styles.text, textStyles]}>
                            {date.getDate()}
                        </Text>
                }
                {events.map(renderEvent)}
            </TouchableOpacity>
        </View>
    );
  }
}

CalendarDay.defaultProps = {
    textStyles: {},
    viewStyles: {},
}

const styles = StyleSheet.create({
    cell: {
        width: '14.2857142857%',
        borderColor: '#CCCCCC',
        borderRightWidth: 1,
        minHeight: 65,
        paddingTop: 3,
        paddingHorizontal: 1.5,
    },
    leftBorder: {
        borderLeftWidth: 1,
    },
    textView: {
        height: 22,
        width: 22,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        height: 22,
        width: 22,
        alignSelf: 'center',
        textAlign: 'center'
    },
    touchableOpacity: {
        height: '100%',
        minHeight: 65
    }
});

export default CalendarDay;