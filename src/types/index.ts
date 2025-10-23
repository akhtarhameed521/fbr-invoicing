export interface ApiMessage {
  message: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: number;
      email: string;
      username: string;
      role: string;
    };
  }
}

export interface ApiMessageData extends ApiMessage {
  data: object;
  image?: string;
}

export interface ApiMessageDataPagination extends ApiMessageData {
  page: number;
  lastPage: number;
  total: number;
}

export enum StatusEnum {
  Active = "Active",
  Deactivate = "Deactivate",
}

export enum UserRoles {
  Admin = "Admin",
  User = "User",
  Staff = "Staff",
  Vendor = "Vendor",
  Supplementary = "Supplementary",
}

export enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

export enum ComplaintType {
  Water = "Water",
  Electric = "Electric",
  Security = "Security",
  Admin = "Admin",
  Other = "Other",
}

export enum ComplaintPriority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Urgent = "Urgent",
}

export enum ComplaintStatus {
  Pending = "Pending",
  InProgress = "InProgress",
  Resolved = "Resolved",
  Assign = "Assign",
  Closed = "Closed",
  ReOpen = "Re Open"
}

export enum VisitorStatus {
  Pending = "Pending",
  In = "In",
  Out = "Out",
}

export enum NotificationStatus {
  LIKE = "like",
  DISLIKE = "dislike",
  PENDING = "pending",
}

export enum maintenancestatusenum {
  Pending = "Pending",
  Paid = "Paid",
  Unpaid = "Unpaid",
  PartiallyPaid = "PartiallyPaid",
  Overdue = "Overdue",
}

export enum SupplementryStatus {
  FREEZE = "freeze",
  DECLINE = "decline",
  Pending = "pending",
  APPROVED = "approved",
}

export enum VehicleType {
  Car = "Car",
  Bike = "Bike",
}

export interface Vehicle {
  vehicleStatus: VehicleStatus;
  plateNo: string;
  name: string;
  model: number;
  color: string;
  type: string;
}

export enum SupplimentoryStatus {
  FREEZE = "freeze",
  DECLINE = "decline",
  PENDING = "pending",
  APPROVED = "approved",
}

export enum VehicleStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

export enum FlatTypeEnum {
  TwoBedDD = "2 Bed DD",
  ThreeBedDD = "3 Bed DD",
  FourBedDD = "4 Bed DD",
}