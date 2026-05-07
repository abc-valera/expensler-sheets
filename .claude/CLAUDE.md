# Instructions for Claude Code

## Version Control
- **Do not** execute any git modification commands (add, commit, restore, push, etc.)
- Only use read-only git commands if needed (status, diff, log, etc.)

## Project Structure

All the code is located in the `./src` directory, which is organized into three subdirectories:
- `./src/cmd`: Contains the main entry points for the application
- `./src/features`: Contains the implementations for the business features
- `./src/shared`: Contains shared between features utilities, connections to external services and other technical non-business functionalities that are relevant for multiple features

## Reuse Before Creation
New features should prefer leveraging existing Types, Services, and Repositories before introducing new ones. When existing abstractions partially fit, contributors should extend or compose them rather than duplicate functionality in new constructs.
It's possible to move some shared piece of code to the ./src/shared directory if it's already implemented for one of the features.
New Types, Services, or Repositories should only be created when:
- No existing abstraction covers the required domain concept
- Extending an existing abstraction would violate its single responsibility
- The new construct represents a genuinely distinct domain boundary
**Rationale**: Reusing established, well-tested abstractions reduces duplication, minimizes future technical debt, and keeps the codebase readable and consistent. Every new type or service introduced is a long-term maintenance commitment.
