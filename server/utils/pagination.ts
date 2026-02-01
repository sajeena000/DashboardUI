import { H3Event } from 'h3'

export const getPaginationParams = (event: H3Event) => {
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.max(1, Math.min(100, Number(query.limit) || 10))
  const offset = (page - 1) * limit

  return { page, limit, offset }
}

export const paginateResize = <T>(items: T[], total: number, page: number, limit: number) => {
  const totalPages = Math.ceil(total / limit)
  return {
    data: items,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  }
}
