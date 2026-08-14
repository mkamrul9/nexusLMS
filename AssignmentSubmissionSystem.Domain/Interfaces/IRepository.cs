using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AssignmentSubmissionSystem.Domain.Interfaces
{
    /// <summary>
    /// Generic repository interface that defines the standard CRUD operations for all domain entities.
    /// Implemented by <c>Repository&lt;T&gt;</c> in the Infrastructure layer using Entity Framework Core.
    /// This abstraction keeps the domain and application layers decoupled from database concerns.
    /// </summary>
    /// <typeparam name="T">The domain entity type. Must be a reference type (class).</typeparam>
    public interface IRepository<T> where T : class
    {
        /// <summary>
        /// Retrieves a single entity by its primary key (GUID).
        /// </summary>
        /// <param name="id">The unique identifier of the entity.</param>
        /// <returns>The entity if found, or <c>null</c> if no matching record exists.</returns>
        Task<T?> GetByIdAsync(Guid id);

        /// <summary>
        /// Retrieves all entities of type <typeparamref name="T"/> from the database.
        /// </summary>
        /// <remarks>
        /// ⚠️ Scalability Note: This loads all records into memory. For large datasets,
        /// add filtered query methods (e.g., GetByStudentIdAsync) to avoid full table scans.
        /// </remarks>
        /// <returns>A read-only list of all entities.</returns>
        Task<IReadOnlyList<T>> GetAllAsync();

        /// <summary>
        /// Adds a new entity to the database and saves changes immediately.
        /// </summary>
        /// <param name="entity">The new entity to persist.</param>
        /// <returns>The persisted entity (with any database-generated values populated).</returns>
        Task<T> AddAsync(T entity);

        /// <summary>
        /// Updates an existing entity in the database and saves changes immediately.
        /// </summary>
        /// <param name="entity">The entity with updated field values.</param>
        Task UpdateAsync(T entity);

        /// <summary>
        /// Deletes an existing entity from the database and saves changes immediately.
        /// </summary>
        /// <param name="entity">The entity instance to remove.</param>
        Task DeleteAsync(T entity);
    }
}
