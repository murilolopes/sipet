import AXIOS from './axios'

export class Category {
	static index() {
		return AXIOS.get('v1/categories')
	}
}
