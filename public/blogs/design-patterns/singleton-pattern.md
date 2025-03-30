# Singleton Pattern

The Singleton pattern ensures a class has only one instance and provides a global point of access to it.

## Implementation

```typescript
class Singleton {
  private static instance: Singleton;

  private constructor() {}

  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}
```

## When to Use

Use the Singleton pattern when:

- Exactly one instance of a class is needed
- The instance needs to be accessible globally
- The instance should be extensible by subclassing

## Pros and Cons

### Pros
- Controlled access to sole instance
- Reduced namespace
- Permits refinement of operations and representation

### Cons
- Can make unit testing difficult
- Can hide dependencies
