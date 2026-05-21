# Contributing

Thanks for contributing to nodes.ro.

## Project goals

The repository intentionally stays lightweight and static.

Focus areas:

- readability
- accessibility
- performance
- maintainability
- minimal dependencies

## Updating projects

Edit:

```text
static/projects.json
```

Each project should contain:

- `category`
- `project_name`
- `short_description`
- `github_url`
- `project_url`
- `status`

## Status values

Allowed status values:

- `live`
- `upcoming`
- `draft`
- `archived`

## Before opening a PR

Verify:

- JSON files are valid
- Links are correct
- Text formatting is consistent
- The portfolio still renders correctly on mobile

## Design guidance

Keep the visual style:

- clean
- lightweight
- fast
- minimal

Avoid introducing heavy frameworks unless there is a strong justification.
