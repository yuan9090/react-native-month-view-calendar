[![version](https://badge.fury.io/js/%40iftek%2Freact-native-month-view-calendar.svg)](https://www.npmjs.com/package/@iftek/react-native-month-view-calendar)
[![downloads](https://img.shields.io/npm/dt/@iftek/react-native-month-view-calendar.svg?style=flat-square)](https://npm-stat.com/charts.html?package=@iftek/react-native-month-view-calendar&from=2024-03-24)

# @iftek/react-native-month-view-calendar
React Native Month View Calendar

- Fork from [react-native-month-view-calendar](https://github.com/strappberry/react-native-month-view-calendar)

<p>
<img src="screenshots/1.png?raw=1" width="200" />
&nbsp;
<img src="screenshots/2.png?raw=1" width="200" />
</p>

## Install

```
npm install --save @iftek/react-native-month-view-calendar
```

### Basic usage
```js
import React from 'react';
import MonthViewCalendar from '@iftek/react-native-month-view-calendar';
import { View, ScrollView } from 'react-native'

const Component = () => {
  const eventsForCalendar = [
  	{
  	  title: 'My awesome event',
  	  date: new Date(),
  	},
  ];

  return (
    <ScrollView>
      <MonthViewCalendar
        cellStyles={{ minHeight: 65 }}
        events={eventsForCalendar}
        renderEvent={(event, i) => {
          return (
            <Text key={i} numberOfLines={1}>{event.title}</Text>
          )
        }}
      />
    </ScrollView>
  );
}
```
### Props

| Properties | Default | type | Description|
| --- | --- | --- | --- |
|date            |new Date()||Date from which the calendar will be built|
|dayTextStyles   |{}|TextStyle \| (day:Date) => TextStyle|Styles for label day(numer of day), can be function, array or object|
|todayTextStyles |{}||Styles for label day(today), can be array or object|
|otherMonthsDayTextStyles   |{}||Styles for label day(numer of day) `other months`, can be array or object|
|otherMonthsEnabled   |false||other months day cell onPress enabled or not|
|events          ||| Array of events|
|headerTextStyles|{}||Styles for label week day name, can be array or object|
|cellStyles      |{}||Styles for all cells|
|pastMonthsCellStyles|{}||Styles for all cells from past dates|
|weekDays        |['S', 'M', 'T', 'W', 'T', 'F', 'S']||Array with name of the day of the week|
|renderEvent     |||Function required to render event information. Example (event, index) => <Event key={index} />|
|onPress         |||Callback when day cell is pressed|
|onSwipe         |||Callback when calendar is swiped|
|onSwipePrev     |||Callback when calendar is swiped to previous month|
|onSwipeNext     |||Callback when calendar is swiped to next month|
|onScrollToIndexFailed ||| Callback to handle errors on swipe|

### Methods
To use the component methods save a reference to it:

```js
const reference = useRef();

<MonthViewCalendar
  ref={reference}
/>
```
* __goToDate(date)__: the component navigates to a custom date, date variable must be an instance of Date. Example: _reference.current.goToDate(new Date());_
* __getCurrentDate()__ returns current date that being displayed

### Event object
```js
{
  /// your props
  date: new Date(),
}
```