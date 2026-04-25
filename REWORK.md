# Edit Form Layout Rework

## What was done (reference: `views/routes/admin/almanach/edit/body.gohtml`)

The Band (almanach) edit form's main/left column was redesigned from stacked
`inputwrapper` blocks into a two-column label-left / input-right grid layout.
The CSS classes are already in `views/transform/form.css`.

---

## CSS classes (already exist, just use them)

```css
.edit-form-grid        /* grid container: 4 columns — 10rem | 1fr | 2.5rem | 5.5rem */
.edit-form-label       /* label cell: self-start pt-1.5, bold sm text, slate-700 */
.edit-form-field       /* input cell: min-w-0 */
```

The 4-column grid normally behaves as a 2-column form (label + field). Most
field rows use `col-span-3` on the field cell so it spans columns 2–4. The
extra two columns (3 and 4) only matter for the special first row where a
short companion field (like Jahr) shares the row with the primary field.

---

## General pattern for the main column

Replace:
```html
<div class="simple-entity-main-column">
  <div class="inputwrapper">
    <div class="inputlabelrow">
      <label class="inputlabel">Feldname</label>
    </div>
    <input class="inputinput" ... />
  </div>
  ...
</div>
```

With:
```html
<div class="simple-entity-main-column edit-form-grid">

  <label for="field-id" class="edit-form-label">Feldname</label>
  <div class="edit-form-field col-span-3">
    <div class="inputshell"><input id="field-id" class="inputinput" ... /></div>
  </div>

  ...

</div>
```

Rules:
- Every simple field: `<label class="edit-form-label">` + `<div class="edit-form-field col-span-3">` as adjacent grid children.
- Wrap inputs in `<div class="inputshell">` (applies the border/focus ring). Textareas go inside inputshell too.
- `lookup-field` custom elements do NOT need an inputshell wrapper.
- Remove all `inputwrapper`, `inputlabelrow`, `inputlabel`, `flex items-center gap-1`, help-tooltip spans (`data-tippy-content`).
- Remove inline `flex flex-row gap-2` groupings that put multiple fields side by side — each field gets its own row.

---

## Checkboxes alongside a field

A checkbox that belongs to a field (e.g. "Fiktional" next to "Name") moves
into the right column cell of that field's row, inlined into the inputshell:

```html
<label for="name" class="edit-form-label">Name</label>
<div class="edit-form-field col-span-3">
  <div class="inputshell flex items-center">
    <input id="name" class="inputinput flex-1" ... />
    <label class="flex shrink-0 cursor-pointer items-center gap-1.5 pl-2 pr-3 text-sm font-bold text-gray-700" for="fictional">
      <input type="checkbox" name="fictional" id="fictional" ... data-boolean-checkbox />
      <span>Fiktional</span>
    </label>
  </div>
</div>
```

A standalone checkbox with no paired text input gets its own grid row:
```html
<label class="edit-form-label">Fiktional</label>
<div class="edit-form-field col-span-3 flex items-center gap-2 pt-1.5">
  <input type="checkbox" name="fictional" id="fictional" ... data-boolean-checkbox />
  <label for="fictional" class="text-sm text-gray-700">Ja</label>
</div>
```

---

## Annotation field

The `_annotation_field` template accepts an optional 5th boolean parameter.
When `true`, it skips its own `inputwrapper`/`inputlabelrow` so the caller
provides the label as a grid cell:

```html
<label for="annotation" class="edit-form-label">Annotation</label>
<div class="edit-form-field col-span-3">
  {{ template "_annotation_field" (Arr $entity.Annotation "Annotation" "annotation" "" true) }}
</div>
```

---

## Full-width spans

Items that should span all 4 columns (no label column):
```html
<div class="col-span-4">
  ... complex component ...
</div>
```

---

## What NOT to change

- The outer `simple-entity-form-grid` / `simple-entity-main-column` /
  `simple-entity-side-column` structure stays intact.
- The **right/side column** (`simple-entity-side-column`) is unchanged: it
  still contains `_status_edit`, `_simple_entity_related_items`, etc.
- The `_simple_entity_edit_header`, `_simple_entity_action_bar`, delete
  dialogs, and all Go template logic above the form body are unchanged.
- `simple-entity-form` class on the `<form>` element stays.

---

## Forms to rework

| File | Main fields |
|------|-------------|
| `views/routes/admin/person/edit/body.gohtml` | Name (lookup-field) + checkboxes (Verlag/Fiktional), Pseudonyme, Biografische Angaben, Profession, URL, Nachweise, Annotation |
| `views/routes/admin/reihe/edit/body.gohtml` | Reihentitel (lookup-field), Nachweise + Erscheinungsfrequenz (currently side-by-side), Annotation |
| `views/routes/admin/ort/edit/body.gohtml` | Name (lookup-field) + Fiktional checkbox, Alternativnamen, URL, Annotation |

### Person form notes
- Name + two checkboxes (Verlag, Fiktional) are currently in a `flex flex-row gap-2` row. In the new layout, Name gets its own full row, and each checkbox gets its own row (or both checkboxes can go on one row using a `col-span-3` flex cell).
- Biografische Angaben + Profession are currently in a `flex flex-row gap-2 w-full` row — split into two separate grid rows.
- URL + Nachweise are currently side-by-side — split into two separate grid rows.

### Reihe form notes
- Nachweise + Erscheinungsfrequenz are currently in a `flex flex-row gap-3` row — split into two rows. Erscheinungsfrequenz is short so it can share the Nachweise row using columns 3–4 if desired (like Jahr does in the Band form).

### Ort form notes
- Name + Fiktional checkbox currently in a `flex flex-row gap-2 items-start` row. Inline the checkbox into the Name field's inputshell (same pattern as Herausgeberangabe + Pseudonym in the Band form).
- Alternativnamen textarea: wrap in inputshell.
- URL input: wrap in inputshell.
