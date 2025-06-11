export interface WorkerType {
  _id?: string;
  name: string;
  phone?: string | null;
  type: "عامل" | "صنايعي";
  dailyWage: number;
  isPublished: boolean;
  _creationTime?: number;
}