<!-- PR Title Should match format:
#{TicketNumber}: Description of Changes

if no ticket number, use `chore:`, `fix:`, `feat:` etc.

Example:
#123: Add pagination to List Applications endpoint
-->

## Summary

<!-- High level, short description of work done. 1-2 sentences. -->

### Related Issues

- Paste URL to issue 1
- Paste URL to issue 2

## Description of Changes
<!-- Describe the changes in your pull request **per service or package**, providing enough context for reviewers.

Be sure to call out any breaking changes, as well as any special instructions required to run the new code (i.e. New or updated dependencies? `pnpm i`. New migrations to run? `pnpm run migrate-dev`. etc.) 

Add a heading for each app/package that you have contributed changes to and list the changes included.
-->

<!-- EXAMPLE START
General description of the changes in your PR and the functionality it adds.

### UI
- Added a new component `ComponentName` which achieves some functionality.
  - Description of `ComponentName` and the changes you made to create it
  - Added package [`package name`](https://link.to/package) to handle something

### Server
- Added new endpoint `GET /stuff`that does stuff


### Special Instructions
Before running these changes, you will need to install `package name`:
```
pnpm i
```
EXAMPLE END -->

## PR Readiness Checklist

- [ ] I have performed a self review of code and manual testing of changes
- [ ] Title is properly formatted: `#{TicketNumber}: Description of Changes`
- [ ] Labels added to PR for service name (`api`, `ui`, etc...), type (`feature`, `chore`, `documentation`, etc...)
- [ ] Unit and integration tests have been updated to capture new features or bug behaviour
- [ ] The code successfully builds locally and passes all test suites
- [ ] All new environment variables added to `.env.schema` files and documented in the README
- [ ] All changes to server HTTP endpoints have open-api documentation