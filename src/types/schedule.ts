export interface ScheduleType {
  scheduleId: number | string;
  metroId: string;
  scheduleTitle: string;
  registerDate: string;
  startDate: string;
  endDate: string;
  userId: {
    userId: number | string;
    nickname: string;
  };
  _id?: string;
}

export interface ScheduleDetailType {
  scheduleDetailId: number | string;
  scheduleId: number | string;
  scheduleOrder: number;
  startTime: string;
  endTime: string;
  contentId: string;
  registerTime: string;
}
