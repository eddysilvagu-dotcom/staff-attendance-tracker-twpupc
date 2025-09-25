
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StaffMember, DayOfWeek, DAYS_OF_WEEK } from '../types/attendance';
import { colors } from '../styles/commonStyles';
import { dateUtils } from '../utils/dateUtils';
import Icon from './Icon';

interface StaffMemberCardProps {
  staffMember: StaffMember;
  weekDates: { [key in DayOfWeek]: string };
  onToggleAttendance: (staffId: string, date: string, currentStatus: boolean) => void;
  onRemoveStaff: (staffId: string) => void;
}

export default function StaffMemberCard({ 
  staffMember, 
  weekDates, 
  onToggleAttendance, 
  onRemoveStaff 
}: StaffMemberCardProps) {
  
  const handleDayPress = (day: DayOfWeek) => {
    const date = weekDates[day];
    const currentStatus = staffMember.attendance[date] || false;
    onToggleAttendance(staffMember.id, date, currentStatus);
  };

  const handleRemove = () => {
    onRemoveStaff(staffMember.id);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{staffMember.name}</Text>
        <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
          <Icon name="trash-outline" size={20} color={colors.accent} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.daysContainer}>
        {DAYS_OF_WEEK.map((day) => {
          const date = weekDates[day];
          const isPresent = staffMember.attendance[date] || false;
          const isToday = dateUtils.isToday(date);
          
          return (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayButton,
                isPresent && styles.dayButtonPresent,
                isToday && styles.dayButtonToday
              ]}
              onPress={() => handleDayPress(day)}
            >
              <Text style={[
                styles.dayText,
                isPresent && styles.dayTextPresent
              ]}>
                {dateUtils.getDayName(date)}
              </Text>
              <Text style={[
                styles.dateText,
                isPresent && styles.dateTextPresent
              ]}>
                {new Date(date + 'T00:00:00').getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  removeButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: colors.background,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginHorizontal: 2,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.grey + '30',
  },
  dayButtonPresent: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  dayButtonToday: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  dayTextPresent: {
    color: colors.background,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  dateTextPresent: {
    color: colors.background,
  },
});
