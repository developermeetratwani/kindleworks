import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://kindleworks.in'
const DEFAULT_IMAGE = `${SITE_URL}/logo_transparent.webp`

export default function Seo({ title, description, path = '/', image = DEFAULT_IMAGE, noindex = false, jsonLd }) {
  const url = `${SITE_URL}${path}`
  const schemas = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="KindleWorks" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}

export { SITE_URL }
