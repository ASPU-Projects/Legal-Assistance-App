import { IAuthorization } from "./IAuthorization";
import { IException } from "./IException";

export interface IAgency {
  id: number;
  sequential_number: string;
  record_number: string;
  user_id: number;
  user_name: string;
  lawyer_id: number;
  lawyer_name: string;
  lawyer_avatar: string;
  representative_id: number;
  place_of_issue: string;
  type: string;
  status: string;
  pdf_path: string;
  is_active: string;
  is_isolated: string;
  is_archived: string;
  updated_at: string;
  authorizations: IAuthorization[];
  exceptions: IException[];
}
