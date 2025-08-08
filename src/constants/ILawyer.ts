export interface ILawyer {
  "id": number,
  "name": string,
  "email": string,
  "address": string,
  "national_number": string,
  "union_branch": string,
  "union_number": string,
  "affiliation_date": string,
  "specializations": {
    "id": number,
    "name": string
  },
  "years_of_experience": number,
  "description": string,
  "phone": string,
  "avatar": string,
  "rank": number
  "rates": {
    "id": number,
    "user_id": number,
    "lawyer_id": number,
    "rating": number,
    "review": string
  },
  'agencies': {
    "id": number,
    "sequential_number": number,
    "record_number": number,
    "user_id": number,
    "user_name": string,
    "lawyer_id": number,
    "lawyer_name": string
    "lawyer_avatar": string,
    "representative_id": number,
    "place_of_issue": string,
    "type": string,
    "status": string,
    "pdf_path": string,
    "is_active": boolean,
    "is_isolated": boolean,
    "is_archived": boolean,
    "updated_at": string,
    "cause"?: string,
    "authorizations"?: {
      'id': number,
      'name': string
    },
    "exceptions"?: {
      'id': number,
      'name': string
    }
  }
}