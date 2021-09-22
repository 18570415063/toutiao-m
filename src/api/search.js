import request from '@/utils/request.js'

export const searchSuggestion = q => {
  return request({
    method: 'GET',
    url: '/v1_0/suggestion',
    params: {
      q
    }

  })
}

export const getSearchResult = params => {
  return request({
    method: 'GET',
    url: '/v1_0/search',
    params
  })
}

export const getHistory = () => {
  return request({
    method: 'GET',
    url: '/v1_0/search/histories'
  })
}

export const deleteHistory = () => {
  return request({
    method: 'DELETE',
    url: '/v1_0/search/histories'
  })
}
