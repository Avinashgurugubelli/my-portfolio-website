
# Factory Pattern

The Factory pattern provides an interface for creating objects without specifying their concrete classes.

## Implementation

```typescript
abstract class Product {
  abstract operation(): string;
}

class ConcreteProductA extends Product {
  operation(): string {
    return 'Result of ConcreteProductA';
  }
}

class ConcreteProductB extends Product {
  operation(): string {
    return 'Result of ConcreteProductB';
  }
}

class Factory {
  createProduct(type: string): Product {
    if (type === 'A') {
      return new ConcreteProductA();
    } else {
      return new ConcreteProductB();
    }
  }
}
```

## When to Use

Use the Factory pattern when:

- A class can't anticipate the class of objects it must create
- A class wants its subclasses to specify the objects it creates
- Classes delegate responsibility to one of several helper subclasses, and you want to localize the knowledge of which helper subclass is the delegate
