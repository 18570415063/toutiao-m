import request from '@/utils/request.js'
// 获取所有频道列表
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/channels'
  })
}
// 获取用户频道列表
export const PostChannels = channels => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/channels',
    data: {
      channels: [channels]
    }
  })
}

// 删除用户指定频道
export const DeleteChannels = channelsID => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/channels/${channelsID}`
  })
}
