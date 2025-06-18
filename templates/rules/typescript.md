---
trigger: always_on
---

# TypeScript Development Rules

## Type Safety & Code Quality
- **Always use explicit types**: Never rely on `any` - use `unknown` for truly unknown types
- **Strict TypeScript configuration**: Enable `strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
- **Type-first development**: Define interfaces and types before implementation
- **Use branded types** for domain-specific primitives (e.g., `type UserId = string & { __brand: 'UserId' }`)
- **Prefer `const assertions`** (`as const`) for literal types and readonly arrays
- **Use discriminated unions** for complex state management and error handling
- **Type guards and narrowing**: Use `is` predicates and TypeGuard for runtime type checking

## Function Design & Logic
- **Pure functions preferred**: Functions should be deterministic and side-effect free when possible
- **Single responsibility**: Each function should do one thing well (<15 lines ideal)
- **Early returns**: Reduce nesting with guard clauses and early returns
- **Functional composition**: Use `map`, `filter`, `reduce` over imperative loops
- **Named functions for complex logic**: Arrow functions only for simple transformations
- **Default parameters**: Use defaults instead of runtime undefined checks
- **Result/Option types**: Use Result<T, E> pattern for error-prone operations

## Error Handling & Resilience
- **Custom error classes**: Create specific error types with context
- **Result pattern**: Return `{ success: true, data: T } | { success: false, error: E }`
- **Exhaustive error handling**: Handle all possible error cases explicitly
- **Async error handling**: Always wrap async operations in try-catch
- **Input validation**: Validate at boundaries using libraries like Zod or custom validators
- **Fail fast**: Validate inputs early and throw meaningful errors

## Code Organization & Architecture
- **Barrel exports**: Use index.ts files for clean module boundaries
- **Dependency injection**: Prefer constructor injection and interfaces
- **Separation of concerns**: Separate business logic, data access, and presentation
- **Single export per file**: One main export per file for clarity
- **Consistent file naming**: Use kebab-case for files, PascalCase for classes, camelCase for everything else
- **Layer architecture**: Clear separation between domain, application, and infrastructure layers

## Data Modeling & State Management
- **Immutable data structures**: Use readonly and deep readonly types
- **Domain modeling**: Use types to represent business rules and constraints
- **State machines**: Use explicit state types for complex business logic
- **Value objects**: Encapsulate business logic in domain objects
- **Builder pattern**: For complex object construction with validation
- **Avoid primitive obsession**: Create meaningful types instead of using strings/numbers everywhere

## Testing & Documentation
- **Test-driven design**: Write tests that document expected behavior
- **Arrange-Act-Assert**: Structure tests clearly with these phases
- **Property-based testing**: Use libraries like fast-check for complex logic
- **Integration tests**: Test actual behavior, not implementation details
- **JSDoc for public APIs**: Document all exported functions and classes
- **Type documentation**: Use branded types and comments to explain business meaning

## Performance & Best Practices
- **Lazy evaluation**: Use generators and lazy loading when appropriate
- **Memoization**: Cache expensive computations with proper cache invalidation
- **Tree shaking**: Structure code to enable dead code elimination
- **Bundle analysis**: Monitor and optimize bundle size
- **Async optimization**: Use Promise.all() for parallel operations
- **Memory management**: Be mindful of closures and memory leaks

## Import & Module Management
- **Type-only imports**: Use `import type` for type-only imports
- **Absolute imports**: Use path mapping for internal modules
- **Dependency boundaries**: Avoid circular dependencies
- **External dependencies**: Pin versions and audit regularly
- **Tree-shakeable imports**: Import only what you need from libraries

## Code Examples to Follow
```typescript
// Good: Explicit types and error handling
interface CreateUserRequest {
  readonly email: string;
  readonly name: string;
}

type CreateUserResult = 
  | { success: true; user: User }
  | { success: false; error: ValidationError };

async function createUser(request: CreateUserRequest): Promise<CreateUserResult> {
  try {
    const validation = validateEmail(request.email);
    if (!validation.isValid) {
      return { success: false, error: new ValidationError(validation.message) };
    }
    
    const user = await userRepository.create(request);
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
```