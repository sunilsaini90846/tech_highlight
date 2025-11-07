import { Metadata } from 'next'
import Link from 'next/link'
import { listSources } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Sources Management - TechHighlight Admin',
  description: 'Manage sources in TechHighlight admin panel',
}

export default async function SourcesPage() {
  const sources = await listSources()

  return (
    <div className="container-custom">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Sources</h1>
          <p className="mt-2 text-neutral-600">
            Manage news sources and their reliability
          </p>
        </div>
        <Link href="/admin/sources/new" className="btn btn-primary">
          Add Source
        </Link>
      </div>

      {/* Sources List */}
      {sources.length > 0 ? (
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Reliability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {sources.map((source) => (
                <tr key={source.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {source.logo ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={source.logo}
                            alt={source.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-neutral-600">
                              {source.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-900">
                          {source.name}
                        </div>
                        <div className="text-sm text-neutral-500">
                          {source.url}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 capitalize">
                      {source.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 bg-neutral-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${source.reliability}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-neutral-600">
                        {source.reliability}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      source.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {source.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/sources/${source.id}`}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-neutral-900">
            No sources found
          </h3>
          <p className="mt-2 text-neutral-600">
            Get started by adding your first news source.
          </p>
          <div className="mt-6">
            <Link href="/admin/sources/new" className="btn btn-primary">
              Add Source
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
