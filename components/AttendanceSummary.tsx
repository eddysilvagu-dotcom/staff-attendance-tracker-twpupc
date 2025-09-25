
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StaffMember, DayOfWeek } from '../types/attendance';
import { colors } from '../styles/commonStyles';

interface AttendanceSummaryProps {
  staffMembers: StaffMember[];
  weekDates: { [key in DayOfWeek]: string };
}

export default function AttendanceSummary({ staffMembers, weekDates }: AttendanceSummaryProps) {
  const calculateStats = () => {
    const totalStaff = staffMembers.length;
    if (totalStaff === 0) return { totalStaff: 0, presentToday: 0, attendanceRate: 0 };

    const today = new Date().toISOString().split('T')[0];
    const presentToday = staffMembers.filter(member => member.attendance[today]).length;
    
    // Calculate weekly attendance rate
    const totalPossibleAttendance = totalStaff * 7;
    let totalActualAttendance = 0;
    
    Object.values(weekDates).forEach(date => {
      staffMembers.forEach(member => {
        if (member.attendance[date]) {
          totalActualAttendance++;
        }
      });
    });
    
    const attendanceRate = totalPossibleAttendance > 0 
      ? Math.round((totalActualAttendance / totalPossibleAttendance) * 100)
      : 0;

    return { totalStaff, presentToday, attendanceRate };
  };

  const { totalStaff, presentToday, attendanceRate } = calculateStats();

  if (totalStaff === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No staff members added yet</Text>
        <Text style={styles.emptySubtext}>Tap the + button to add your first staff member</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>This Week&apos;s Summary</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalStaff}</Text>
          <Text style={styles.statLabel}>Total Staff</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{presentToday}</Text>
          <Text style={styles.statLabel}>Present Today</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{attendanceRate}%</Text>
          <Text style={styles.statLabel}>Weekly Rate</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.grey,
    textAlign: 'center',
  },
});
