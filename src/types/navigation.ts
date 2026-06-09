import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Statistics: undefined;
  TaskForm: { taskId?: string } | undefined;
};

export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type DashboardScreenProps = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;
export type StatisticsScreenProps = NativeStackScreenProps<RootStackParamList, 'Statistics'>;
export type TaskFormScreenProps = NativeStackScreenProps<RootStackParamList, 'TaskForm'>;
