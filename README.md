# nodes.ro

Static portfolio site for nodes.ro projects.

## Project structure

```text
index.html
static/
  projects.json
  styles.css
  logo.png
  bg.png
  bg_back.png
```

## Edit projects

Project data lives in `static/projects.json`.

Each project should include:

- `category`
- `project_name`
- `short_description`
- `github_url`
- `project_url`
- `status`

Use `null` for unavailable URLs. Use `status` to make placeholders explicit, for example `live`, `upcoming`, or `draft`.

## Local preview

Serve the repository root with any static server. For example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deployment

The site is static and can be deployed by any static hosting service, including GitHub Pages.
