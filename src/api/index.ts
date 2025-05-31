import request from '@/utils/request'

export async function queryProse(): Promise<any> {
  console.warn('queryProse')
  return request('/prose')
}
