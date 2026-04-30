# What Are Design Patterns?

Design patterns are reusable solutions to commonly occurring problems in software design.

## Why Use Them?

- They provide proven solutions to recurring problems
- They create a shared vocabulary among developers
- They make code more maintainable and flexible
- They help avoid reinventing the wheel

## The Observer Pattern

The Observer pattern defines a one-to-many dependency between objects. When one object changes state, all its dependents are notified automatically.

```python
class EventEmitter:
    def __init__(self):
        self._listeners = {}

    def on(self, event, callback):
        self._listeners.setdefault(event, []).append(callback)

    def emit(self, event, *args):
        for cb in self._listeners.get(event, []):
            cb(*args)
```

## Key Takeaways

- Patterns are tools, not rules
- Pick the right pattern for the problem
- Keep it simple — don't over-engineer
