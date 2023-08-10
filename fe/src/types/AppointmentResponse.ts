export type AppointmentResponse = AppointmentIt[];

interface AppointmentIt {
  id: string;
  doctorFirstName: string;
  doctorLastName: string;
  doctorSpeciality: string;
  date: string;
}
