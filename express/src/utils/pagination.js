// src/utils/pagination.js

function getPagination(query = {}) {
  const page = parseInt(query.page) || 1;
  const limit = query.limit === "all" ? null : parseInt(query.limit) || 10;

  const isAll = query.limit === "all";

  return {
    page,
    limit,
    isAll,
    skip: isAll ? undefined : (page - 1) * limit,
    take: isAll ? undefined : limit,
  };
}

module.exports = { getPagination };
