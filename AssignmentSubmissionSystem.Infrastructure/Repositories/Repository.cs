using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AssignmentSubmissionSystem.Domain.Interfaces;
using AssignmentSubmissionSystem.Infrastructure.Persistence;

namespace AssignmentSubmissionSystem.Infrastructure.Repositories
{
    /// <summary>
    /// Generic EF Core implementation of <see cref="IRepository{T}"/>.
    /// Provides standard CRUD operations for any domain entity backed by <see cref="ApplicationDbContext"/>.
    /// </summary>
    /// <typeparam name="T">The domain entity type. Must be a reference type (class).</typeparam>
    public class Repository<T> : IRepository<T> where T : class
    {
        /// <summary>The EF Core database context injected via constructor injection.</summary>
        protected readonly ApplicationDbContext _dbContext;

        /// <summary>
        /// Initialises a new instance of <see cref="Repository{T}"/>.
        /// </summary>
        /// <param name="dbContext">The application's EF Core database context.</param>
        public Repository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        /// <inheritdoc />
        public async Task<T?> GetByIdAsync(Guid id)
        {
            // FindAsync uses the primary key cache before hitting the database — efficient for single lookups
            return await _dbContext.Set<T>().FindAsync(id);
        }

        /// <inheritdoc />
        /// <remarks>
        /// Uses <c>AsNoTracking()</c> for a significant read performance improvement.
        /// Since list results are read-only (never updated directly), we skip EF's change-tracking overhead.
        /// </remarks>
        public async Task<IReadOnlyList<T>> GetAllAsync()
        {
            return await _dbContext.Set<T>()
                .AsNoTracking() // Read-only: skip change tracking for better performance
                .ToListAsync();
        }

        /// <inheritdoc />
        public async Task<T> AddAsync(T entity)
        {
            await _dbContext.Set<T>().AddAsync(entity);
            await _dbContext.SaveChangesAsync();
            return entity;
        }

        /// <inheritdoc />
        public async Task UpdateAsync(T entity)
        {
            // Mark the entire entity as modified so EF Core generates an UPDATE statement for all fields
            _dbContext.Entry(entity).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
        }

        /// <inheritdoc />
        public async Task DeleteAsync(T entity)
        {
            _dbContext.Set<T>().Remove(entity);
            await _dbContext.SaveChangesAsync();
        }
    }
}
