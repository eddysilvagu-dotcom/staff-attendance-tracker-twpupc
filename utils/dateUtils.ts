
import { DayOfWeek, DAYS_OF_WEEK } from '../types/attendance';

export const dateUtils = {
  // Get current week's dates (Monday to Sunday)
  getCurrentWeekDates(): { [key in DayOfWeek]: string } {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Calculate Monday of current week
    const monday = new Date(today);
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1; // Handle Sunday
    monday.setDate(today.getDate() - daysFromMonday);
    
    const weekDates: { [key in DayOfWeek]: string } = {} as any;
    
    DAYS_OF_WEEK.forEach((day, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      weekDates[day] = this.formatDate(date);
    });
    
    return weekDates;
  },

  // Format date as YYYY-MM-DD
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  },

  // Get day name from date
  getDayName(date: string): string {
    const dateObj = new Date(date + 'T00:00:00');
    return dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  },

  // Get formatted date for display (e.g., "Mon 15")
  getDisplayDate(date: string): string {
    const dateObj = new Date(date + 'T00:00:00');
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = dateObj.getDate();
    return `${dayName} ${dayNumber}`;
  },

  // Check if date is today
  isToday(date: string): boolean {
    const today = this.formatDate(new Date());
    return date === today;
  }
};
