import { Icon } from '@iconify/react/dist/iconify.js'
import {
  DateInput,
  EmptyStateScreen,
  QueryWrapper,
  SearchInput,
  SidebarDivider,
  SidebarTitle
} from '@lifeforge/ui'
import clsx from 'clsx'
import { useMemo, useState } from 'react'

import Header from '../components/Header'
import useAPIQuery from '../hooks/useAPIQuery'
import useComponentBg from '../hooks/useComponentBg'

const METHOD_COLORS: Record<
  string,
  {
    color: string
    bg: string
    border: string
  }
> = {
  GET: {
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500'
  },
  POST: {
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500'
  },
  PUT: {
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500'
  },
  DELETE: {
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500'
  },
  PATCH: {
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500'
  }
}

function MainContent() {
  const { componentBgWithHover } = useComponentBg()
  const endpointsQuery = useAPIQuery('/_routes', ['endpoints'])
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const groupedEndpoints = useMemo(() => {
    if (!endpointsQuery.data) return []
    return Object.fromEntries(
      Object.entries(
        endpointsQuery.data.reduce((acc: any, endpoint: any) => {
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
        }, {})
      ).filter(([_, endpoints]) => endpoints.length > 0)
    )
  }, [endpointsQuery.data, searchQuery])

  return (
    <div className="flex h-full w-full flex-1">
      <aside
        className={clsx(
          'bg-bg-50 shadow-custom dark:bg-bg-900 lg:bg-bg-50/50 lg:dark:bg-bg-900/50 absolute top-0 left-0 flex h-full shrink-0 flex-col overflow-hidden rounded-r-2xl backdrop-blur-xs transition-all duration-300 lg:relative lg:backdrop-blur-xs',
          sidebarExpanded
            ? 'w-full min-w-80 sm:w-1/2 lg:w-3/12 xl:w-1/5'
            : 'w-0 min-w-0 sm:w-[5.4rem]'
        )}
      >
        <Header />
        <div className="px-4">
          <SearchInput
            className="mb-4"
            namespace="core.apiExplorer"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            stuffToSearch="endpoints"
          />
        </div>
        <div className="mt-2 flex-1 space-y-4 overflow-y-auto">
          {Object.entries(groupedEndpoints).length ? (
            Object.entries(groupedEndpoints).map(
              ([topLevelPath, endpoints]) => (
                <>
                  <div key={topLevelPath} className="mb-6">
                    <SidebarTitle
                      name={`${topLevelPath} (${endpoints.length})`}
                    />
                    <div className="mt-2 space-y-4">
                      {endpoints.map((endpoint: any) => (
                        <p className="text-bg-500 w-full min-w-0 gap-4 truncate px-8">
                          <span
                            className={clsx(
                              'font-semibold tracking-wider',
                              METHOD_COLORS[endpoint.method].color ||
                                'text-gray-500'
                            )}
                          >
                            {endpoint.method}
                          </span>
                          <code className="ml-2 w-full min-w-0">
                            {endpoint.path}
                          </code>
                        </p>
                      ))}
                    </div>
                  </div>
                  <SidebarDivider />
                </>
              )
            )
          ) : (
            <EmptyStateScreen
              namespace="core.apiExplorer"
              name="search"
              smaller
              icon="tabler:search-off"
            />
          )}
        </div>
      </aside>
      <div className="flex-1 overflow-y-auto p-12">
        <QueryWrapper query={endpointsQuery}>
          {data => (
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
          )}
        </QueryWrapper>
      </div>
    </div>
  )
}

export default MainContent
