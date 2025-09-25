
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/commonStyles';
import { StaffMember, DayOfWeek } from '../types/attendance';
import { storageUtils } from '../utils/storage';
import { dateUtils } from '../utils/dateUtils';
import StaffMemberCard from '../components/StaffMemberCard';
import AddStaffBottomSheet from '../components/AddStaffBottomSheet';
import AttendanceSummary from '../components/AttendanceSummary';
import Icon from '../components/Icon';

export default function AttendanceApp() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isAddStaffVisible, setIsAddStaffVisible] = useState(false);
  const [weekDates, setWeekDates] = useState<{ [key in DayOfWeek]: string }>({} as any);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on app start
  useEffect(() => {
    loadData();
  }, []);

  // Update week dates when component mounts
  useEffect(() => {
    setWeekDates(dateUtils.getCurrentWeekDates());
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const savedStaffMembers = await storageUtils.getStaffMembers();
      setStaffMembers(savedStaffMembers);
      console.log('Loaded staff members:', savedStaffMembers.length);
    } catch (error) {
      console.log('Error loading data:', error);
      Alert.alert('Error', 'Failed to load attendance data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStaff = async (name: string) => {
    try {
      const newMember = await storageUtils.addStaffMember(name);
      setStaffMembers(prev => [...prev, newMember]);
      console.log('Staff member added successfully');
    } catch (error) {
      console.log('Error adding staff member:', error);
      Alert.alert('Error', 'Failed to add staff member');
    }
  };

  const handleRemoveStaff = async (staffId: string) => {
    const staffMember = staffMembers.find(member => member.id === staffId);
    if (!staffMember) return;

    Alert.alert(
      'Remove Staff Member',
      `Are you sure you want to remove ${staffMember.name}? This will delete all their attendance records.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await storageUtils.removeStaffMember(staffId);
              setStaffMembers(prev => prev.filter(member => member.id !== staffId));
              console.log('Staff member removed successfully');
            } catch (error) {
              console.log('Error removing staff member:', error);
              Alert.alert('Error', 'Failed to remove staff member');
            }
          }
        }
      ]
    );
  };

  const handleToggleAttendance = async (staffId: string, date: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      await storageUtils.updateAttendance(staffId, date, newStatus);
      
      setStaffMembers(prev => 
        prev.map(member => 
          member.id === staffId 
            ? { ...member, attendance: { ...member.attendance, [date]: newStatus } }
            : member
        )
      );
      
      console.log('Attendance toggled successfully');
    } catch (error) {
      console.log('Error toggling attendance:', error);
      Alert.alert('Error', 'Failed to update attendance');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Icon name="people-outline" size={48} color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Icon name="people-outline" size={32} color={colors.accent} />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddStaffVisible(true)}
        >
          <Icon name="add" size={24} color={colors.background} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <AttendanceSummary 
          staffMembers={staffMembers} 
          weekDates={weekDates}
        />

        {staffMembers.map((staffMember) => (
          <StaffMemberCard
            key={staffMember.id}
            staffMember={staffMember}
            weekDates={weekDates}
            onToggleAttendance={handleToggleAttendance}
            onRemoveStaff={handleRemoveStaff}
          />
        ))}
      </ScrollView>

      <AddStaffBottomSheet
        isVisible={isAddStaffVisible}
        onClose={() => setIsAddStaffVisible(false)}
        onAddStaff={handleAddStaff}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey + '20',
  },
  addButton: {
    backgroundColor: colors.accent,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
