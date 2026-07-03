import { Studio } from 'sanity'
import sanityConfig from '../sanity.config'

export default function Admin() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Studio config={sanityConfig} />
    </div>
  )
}
