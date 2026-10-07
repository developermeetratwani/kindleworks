import { Link } from 'react-router-dom'
import { SITE_URL } from './Seo'

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

export default function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, i) => (
          <li key={item.path}>
            {i === items.length - 1 ? (
              <span aria-current="page">{item.label}</span>
            ) : (
              <Link to={item.path}>{item.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
