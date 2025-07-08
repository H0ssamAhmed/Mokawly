import { CompanyType } from "./CompanyTypes";

export interface Payment {
  _id?: string;
  companyId: string;
  amount: number;
  date: string;
  note?: string;
  _creationTime?: number;
}

export interface CompanyWithPayments extends CompanyType {
  payments: Payment[];
  total: number;
}
