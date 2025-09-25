
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { colors } from '../styles/commonStyles';
import SimpleBottomSheet from './BottomSheet';
import Button from './Button';

interface AddStaffBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onAddStaff: (name: string) => void;
}

export default function AddStaffBottomSheet({ 
  isVisible, 
  onClose, 
  onAddStaff 
}: AddStaffBottomSheetProps) {
  const [staffName, setStaffName] = useState('');

  const handleAdd = () => {
    const trimmedName = staffName.trim();
    if (!trimmedName) {
      Alert.alert('Error', 'Please enter a staff member name');
      return;
    }
    
    if (trimmedName.length < 2) {
      Alert.alert('Error', 'Name must be at least 2 characters long');
      return;
    }

    onAddStaff(trimmedName);
    setStaffName('');
    onClose();
  };

  const handleClose = () => {
    setStaffName('');
    onClose();
  };

  return (
    <SimpleBottomSheet isVisible={isVisible} onClose={handleClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Add New Staff Member</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Staff Name</Text>
          <TextInput
            style={styles.input}
            value={staffName}
            onChangeText={setStaffName}
            placeholder="Enter staff member name"
            placeholderTextColor={colors.grey}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleAdd}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            text="Add Staff Member"
            onPress={handleAdd}
            style={styles.addButton}
          />
          <Button
            text="Cancel"
            onPress={handleClose}
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
          />
        </View>
      </View>
    </SimpleBottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.grey + '40',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    minHeight: 48,
  },
  buttonContainer: {
    gap: 12,
  },
  addButton: {
    backgroundColor: colors.accent,
  },
  cancelButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.grey + '40',
  },
  cancelButtonText: {
    color: colors.text,
  },
});
