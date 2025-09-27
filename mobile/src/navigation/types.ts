export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Landing: undefined;
  Login: undefined;
  SignUp: undefined;
  TermsOfService: undefined;
};

export type MainStackParamList = {
  HomeSelection: undefined;
  HomeDashboard: { home: any }; // Home object passed as parameter
  SecuritySettings: { home: any }; // Home object passed as parameter
  AppSettings: undefined;
  Profile: undefined;
  Settings: undefined;
  // Home Management
  HomeManagement: undefined;
  // Device Management
  DeviceManagement: { home: any };
  // Security Controls
  DeadboltControl: { home: any };
  FaceDetection: { home: any };
  RFIDManagement: { home: any };
  AccessLogs: { home: any };
  // Add more main app screens here as you develop them
};

// Navigation prop types
export type AuthScreenProps<T extends keyof AuthStackParamList> = {
  navigation: any; // We'll improve this with proper typing later
  route: {
    params: AuthStackParamList[T];
  };
};

export type MainScreenProps<T extends keyof MainStackParamList> = {
  navigation: any; // We'll improve this with proper typing later
  route: {
    params: MainStackParamList[T];
  };
};
