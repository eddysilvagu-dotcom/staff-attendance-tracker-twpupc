
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StaffMember } from '../types/attendance';

const STORAGE_KEYS = {
  STAFF_MEMBERS: 'staff_members',
  ATTENDANCE_DATA: 'attendance_data'
};

export const storageUtils = {
  // Staff Members
  async getStaffMembers(): Promise<StaffMember[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.STAFF_MEMBERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.log('Error getting staff members:', error);
      return [];
    }
  },

  async saveStaffMembers(staffMembers: StaffMember[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.STAFF_MEMBERS, JSON.stringify(staffMembers));
      console.log('Staff members saved successfully');
    } catch (error) {
      console.log('Error saving staff members:', error);
    }
  },

  async addStaffMember(name: string): Promise<StaffMember> {
    try {
      const staffMembers = await this.getStaffMembers();
      const newMember: StaffMember = {
        id: Date.now().toString(),
        name: name.trim(),
        attendance: {}
      };
      
      staffMembers.push(newMember);
      await this.saveStaffMembers(staffMembers);
      console.log('New staff member added:', newMember.name);
      return newMember;
    } catch (error) {
      console.log('Error adding staff member:', error);
      throw error;
    }
  },

  async removeStaffMember(staffId: string): Promise<void> {
    try {
      const staffMembers = await this.getStaffMembers();
      const filteredMembers = staffMembers.filter(member => member.id !== staffId);
      await this.saveStaffMembers(filteredMembers);
      console.log('Staff member removed:', staffId);
    } catch (error) {
      console.log('Error removing staff member:', error);
    }
  },

  async updateAttendance(staffId: string, date: string, isPresent: boolean): Promise<void> {
    try {
      const staffMembers = await this.getStaffMembers();
      const memberIndex = staffMembers.findIndex(member => member.id === staffId);
      
      if (memberIndex !== -1) {
        staffMembers[memberIndex].attendance[date] = isPresent;
        await this.saveStaffMembers(staffMembers);
        console.log('Attendance updated for:', staffMembers[memberIndex].name, date, isPresent);
      }
    } catch (error) {
      console.log('Error updating attendance:', error);
    }
  },

  // Clear all data (for testing)
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.STAFF_MEMBERS, STORAGE_KEYS.ATTENDANCE_DATA]);
      console.log('All data cleared');
    } catch (error) {
      console.log('Error clearing data:', error);
    }
  }
};
