---
trigger: always_on
---

# Python Development Rules

## Type Safety & Code Quality
- **Always use type hints**: Every function parameter, return value, and complex variable
- **Use modern typing**: Prefer `list[str]` over `List[str]` (Python 3.9+)
- **Strict type checking**: Enable mypy with strict settings (`--strict`)
- **Runtime type validation**: Use libraries like Pydantic for data validation
- **Protocol classes**: Use `typing.Protocol` for structural typing and interfaces
- **Generic types**: Create reusable generic functions and classes
- **Type guards**: Use `typing.TypeGuard` for runtime type narrowing

## Function Design & Architecture
- **Pure functions preferred**: Functions should be deterministic and side-effect free
- **Single responsibility**: Each function should have one clear purpose (<15 lines ideal)
- **Immutable by default**: Use `dataclasses` with `frozen=True` or `NamedTuple`
- **Functional composition**: Prefer map/filter/reduce over imperative loops
- **Context managers**: Use `with` statements for resource management
- **Dependency injection**: Pass dependencies explicitly, avoid global state
- **Result types**: Use Union types for success/error returns

## Error Handling & Resilience
- **Specific exceptions**: Create custom exception classes with meaningful names
- **Exception chaining**: Use `raise ... from` to preserve error context
- **Fail fast principle**: Validate inputs early and explicitly
- **Defensive programming**: Check preconditions and postconditions
- **Logging over print**: Use structured logging with appropriate levels
- **Error recovery**: Design graceful degradation strategies
- **Input validation**: Validate all external inputs (files, APIs, user input)

## Data Modeling & State Management
- **Dataclasses for data**: Use `@dataclass` for structured data with validation
- **Immutable data structures**: Prefer tuple, frozenset, and frozen dataclasses
- **Value objects**: Encapsulate business logic in domain-specific classes
- **Builder pattern**: For complex object construction with validation
- **State machines**: Use explicit state enums for complex business logic
- **Domain modeling**: Use types to represent business rules and constraints
- **Avoid primitive obsession**: Create meaningful types instead of using str/int everywhere

## Code Organization & Project Structure
- **Domain-driven design**: Organize code by business domains, not technical layers
- **Clear module boundaries**: Each module should have a single, clear responsibility
- **Package structure**: 
  ```
  src/
  ├── domain/          # Business logic and entities
  ├── application/     # Use cases and application services
  ├── infrastructure/  # External dependencies (DB, APIs, etc.)
  ├── interfaces/      # Controllers, CLI, web handlers
  └── shared/          # Common utilities and types
  ```
- **Init files**: Use `__init__.py` to control public APIs
- **Absolute imports**: Use absolute imports with proper package structure

## Testing & Documentation
- **Test-driven development**: Write tests before implementation
- **Property-based testing**: Use Hypothesis for complex logic testing
- **Arrange-Act-Assert**: Structure tests clearly with these phases
- **Mock external dependencies**: Isolate units under test
- **Integration tests**: Test actual behavior with real dependencies
- **Docstrings**: Use Google/NumPy style docstrings for all public APIs
- **Type documentation**: Document complex types and their purpose

## Performance & Best Practices
- **Profile before optimizing**: Use cProfile and line_profiler
- **Vectorized operations**: Use NumPy/PyTorch for numerical computations
- **Lazy evaluation**: Use generators for large datasets
- **Memory efficiency**: Be mindful of memory usage with large data
- **Async programming**: Use asyncio for I/O-bound operations
- **Caching**: Use `functools.lru_cache` for expensive computations
- **Data structures**: Choose appropriate data structures (set vs list, dict vs namedtuple)

## Machine Learning Specific (when applicable)
- **Reproducible research**: Set random seeds and document environment
- **Data validation**: Validate data shapes, types, and ranges
- **Model versioning**: Track model architecture and hyperparameters
- **Experiment tracking**: Use tools like MLflow or Weights & Biases
- **Resource management**: Handle GPU memory and cleanup properly
- **Batch processing**: Process data in appropriate batch sizes
- **Model serving**: Design models for production deployment

## Import & Dependency Management
- **Import ordering**: Follow isort standard (stdlib, third-party, local)
- **Minimal imports**: Import only what you need
- **Virtual environments**: Always use venv or conda environments
- **Dependency pinning**: Pin exact versions in requirements.txt
- **Optional dependencies**: Use `try/except ImportError` for optional features
- **Namespace packages**: Avoid conflicts with proper package naming

## Code Examples to Follow
```python
from typing import Protocol, TypeVar, Generic
from dataclasses import dataclass
from enum import Enum

T = TypeVar('T')
E = TypeVar('E')

@dataclass(frozen=True)
class Result(Generic[T, E]):
    """Represents either success with value T or failure with error E."""
    value: T | None = None
    error: E | None = None
    
    @property
    def is_success(self) -> bool:
        return self.error is None
    
    def unwrap(self) -> T:
        if self.error is not None:
            raise ValueError(f"Result contains error: {self.error}")
        return self.value  # type: ignore

class UserRepository(Protocol):
    def find_by_email(self, email: str) -> Result[User, str]: ...

def create_user(
    email: str, 
    name: str, 
    repository: UserRepository
) -> Result[User, str]:
    """Create a new user with validation."""
    if not email or '@' not in email:
        return Result(error="Invalid email format")
    
    if not name or len(name) < 2:
        return Result(error="Name must be at least 2 characters")
    
    existing = repository.find_by_email(email)
    if existing.is_success:
        return Result(error="User already exists")
    
    user = User(email=email, name=name)
    return Result(value=user)
```