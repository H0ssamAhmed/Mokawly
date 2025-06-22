export interface WorkerType {
  _id?: string;
  name: string;
  phone?: string | null;
  type: "عامل" | "صنايعي";
  dailyWage: number;
  isPublished: boolean;
  _creationTime?: number;
  note?: string
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