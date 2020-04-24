import { Category } from './../../services/category'

export const state = {}

export const mutations = {}

export const getters = {}

export const actions = {
	init({ state, dispatch }) {},

	fetchCategories() {
		return Category.index()
	},
}
