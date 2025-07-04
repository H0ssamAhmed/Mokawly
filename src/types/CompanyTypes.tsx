export interface CompanyType {
  _id?: string;
  name: string,
  person_one?: string,
  person_one_phone?: number | null,
  person_two?: string,
  person_two_phone?: number | null,
  note: string,
  _creationTime?: number;
}