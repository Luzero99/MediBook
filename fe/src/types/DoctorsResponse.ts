interface DoctorResponse {
  id: string;
  userFirstName: string;
  userLastName: string;
  bio: string;
  speciality: string;
  profilePicture: string;
}

export type DoctorsResponse = DoctorResponse[];
