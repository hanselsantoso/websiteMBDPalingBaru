export type ParsedVideo = { provider: 'youtube' | 'vimeo'; id: string; embedUrl: string; thumbnail: string | null }

export function parseVideoUrl(url: string | null | undefined): ParsedVideo | null {
  if (!url) return null
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, '')
    if (host === 'youtu.be' || host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      const id = host === 'youtu.be' ? parsed.pathname.slice(1) : parsed.searchParams.get('v') ?? parsed.pathname.split('/').filter(Boolean).pop() ?? ''
      if (!/^[\w-]{6,}$/.test(id)) return null
      return {
        provider: 'youtube',
        id,
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      }
    }
    if (host.endsWith('vimeo.com')) {
      const id = parsed.pathname.split('/').filter(Boolean).pop() ?? ''
      if (!/^\d+$/.test(id)) return null
      return { provider: 'vimeo', id, embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1`, thumbnail: null }
    }
  } catch {
    return null
  }
  return null
}
