/**
 * The journey's media, discovered at build time. Every file is optional:
 * voice lines stay on Marwan's machine (git-ignored), and the curtain video
 * and music arrive later, so a build simply works with whatever is present.
 */

import type { LineId } from './scenes'

type FileMap = Record<string, string>

const glob = {
  voice: import.meta.glob('/src/assets/voice/*.mp3', {
    eager: true,
    query: '?url',
    import: 'default',
  }) as FileMap,
  music: import.meta.glob('/src/assets/music/*.mp3', {
    eager: true,
    query: '?url',
    import: 'default',
  }) as FileMap,
  curtainVideo: import.meta.glob('/src/assets/curtain/*.mp4', {
    eager: true,
    query: '?url',
    import: 'default',
  }) as FileMap,
  curtainPoster: import.meta.glob('/src/assets/curtain/*.webp', {
    eager: true,
    query: '?url',
    import: 'default',
  }) as FileMap,
}

/** The URL of the file whose name (without extension) is exactly `name` */
export const pickFile = (files: FileMap, name: string): string | undefined => {
  const key = Object.keys(files).find(
    (path) =>
      path
        .split('/')
        .pop()
        ?.replace(/\.[^.]+$/, '') === name
  )
  return key ? files[key] : undefined
}

export const voiceUrl = (id: LineId): string | undefined =>
  pickFile(glob.voice, id)

export const musicUrl: string | undefined = Object.values(glob.music)[0]

const curtainSrc = pickFile(glob.curtainVideo, 'curtain')

export const curtainVideo: { src: string; poster?: string } | undefined =
  curtainSrc
    ? {
        src: curtainSrc,
        poster: pickFile(glob.curtainPoster, 'curtain-poster'),
      }
    : undefined
