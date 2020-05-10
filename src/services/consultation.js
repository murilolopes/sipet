import AXIOS from './axios'

export class Consultation {
  static create(payload) {
  	const consultation = {
  		consult_type: 1,
  		vet_id: payload.vet.id,
  		pet_id: payload.pet_id,
  		person_id: payload.person_id,
  		complaint: payload.complaint,
  		observations: payload.observations,
  		establishment_id: payload.establishment_id,
  		consultations_service_attributes: payload.services
  	}
    return AXIOS.post('/consultations', consultation);
  }

  static fetchConsultations() {
    return AXIOS.get('/consultations')
  }
}