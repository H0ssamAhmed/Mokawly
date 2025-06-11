export interface WorkerType {
  _id?: string;
  name: string;
  phone?: number | null;
  type: "عامل" | "صنايعي";
  dailyWage: number;
  isPublished: boolean;
  _creationTime?: number;
}