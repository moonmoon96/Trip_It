import { PlaceApiType } from "./place";

export interface ColumnType {
  place: PlaceApiType;
  scheduleOrder: number;
  startTime: string;
  endTime: string;
}

export interface ScheduleDtoInputType {
  metroId: string;
  startDate: string;
  endDate: string;
  scheduleTitle: string;
}

export interface ScheduleDetailDtoInputType {
  contentId: string;
  scheduleOrder: number;
  startTime: string;
  endTime: string;
}

export interface ScheduleDetailDtoUpdateType
  extends ScheduleDetailDtoInputType {
  scheduleDetailId?: string | number;
  scheduleId?: string | number;
}
