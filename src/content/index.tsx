import { Icon } from '@iconify/react/dist/iconify.js'
import { QueryWrapper } from '@lifeforge/ui'
import clsx from 'clsx'
import { useMemo, useState } from 'react'

import METHOD_COLORS from '../constants/methodColors'
import useAPIQuery from '../hooks/useAPIQuery'
import useComponentBg from '../hooks/useComponentBg'
import Route from '../typescript/routes.interface'
import Sidebar from './components/Sidebar'

function MainContent() {
  const { componentBgWithHover } = useComponentBg()
  const endpointsQuery = useAPIQuery<Route[]>('/_routes', ['endpoints'])
  const [searchQuery, setSearchQuery] = useState('')

  const groupedEndpoints = useMemo(() => {
    if (!endpointsQuery.data) return {}

    return Object.fromEntries(
      Object.entries(
        endpointsQuery.data.reduce(
          (acc, endpoint) => {
            if (
              !endpoint.path.toLowerCase().includes(searchQuery.toLowerCase())
            ) {
              return acc
            }

            const topLevelPath = endpoint.path.split('/')[0] || 'root'
            if (!acc[topLevelPath]) {
              acc[topLevelPath] = []
            }
            acc[topLevelPath].push(endpoint)

            return acc
          },
          {} as Record<string, Route[]>
        )
      ).filter(([_, endpoints]) => endpoints.length > 0)
    )
  }, [endpointsQuery.data, searchQuery])

  return (
    <div className="flex h-full w-full flex-1">
      <QueryWrapper query={endpointsQuery}>
        {data => (
          <>
            <Sidebar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              groupedEndpoints={groupedEndpoints}
            />
            <div className="flex-1 overflow-y-auto p-12">
              <div className="space-y-3">
                {data.map((endpoint: any) => (
                  <div
                    className={clsx(
                      componentBgWithHover,
                      'flex-between shadow-custom gap-6 rounded-md p-4 text-lg'
                    )}
                  >
                    <div className="flex items-center gap-6">
                      <div className="text-bg-500 flex items-center gap-4">
                        <span
                          className={clsx(
                            'w-24 text-center font-semibold tracking-wider',
                            METHOD_COLORS[endpoint.method].color ||
                              'text-gray-500'
                          )}
                        >
                          {endpoint.method}
                        </span>
                        <code>{endpoint.path}</code>
                      </div>
                      <p className="text-bg-500 text-base">
                        {endpoint.description}
                      </p>
                    </div>
                    <Icon
                      icon="tabler:chevron-down"
                      className="text-bg-400 dark:text-bg-600 mr-2 size-5"
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </QueryWrapper>
    </div>
  )
}

export default MainContent
