// src/config/assets.ts
const ASSET_BASE_URL = 'https://persona-assets.perdafos.my.id'

export const getVideoUrl = (path: string) => {
  return `${ASSET_BASE_URL}/video/${path}`
}

export const getAudioUrl = (path: string) => {
  return `${ASSET_BASE_URL}/audio/${path}`
}