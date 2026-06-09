import { NavigatorScreenParams, CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type AuthStackParamList = {
  Login: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Statistics: undefined;
};

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  TaskForm: { taskId?: string } | undefined;
};

export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export type DashboardScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Dashboard'>,
  NativeStackScreenProps<AppStackParamList>
>;

export type StatisticsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Statistics'>,
  NativeStackScreenProps<AppStackParamList>
>;

export type TaskFormScreenProps = NativeStackScreenProps<AppStackParamList, 'TaskForm'>;
