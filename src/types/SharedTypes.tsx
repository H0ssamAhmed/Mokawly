export interface WorkerType {
  _id?: string;
  name: string;
  phone?: string | null;
  type: "عامل" | "صنايعي";
  dailyWage: number;
  note?: string;
  isPublished: boolean;
  _creationTime?: number;
}
export interface DilayAttendance {
  workerId: string,
  name: string,
  dailyWage: number,
  date: string,
  note: string
}

export interface JobExpense {
  _id?: string;
  type: string;
  paidBy: string,
  description: string;
  amount: number;
  date: string;
  _creationTime?: number;

}

export interface WorkerExpense {
  _id?: string;
  workerId: string;
  paidBy: string,
  workerName: string;
  amount: number;
  date: string;
  description?: string;
  _creationTime?: number;

}