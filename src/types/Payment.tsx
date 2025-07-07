export interface Payment {
  _id?: string;
  companyId: string;
  companyName: string;
  amount: number;
  date: string;
  note?: string;
}