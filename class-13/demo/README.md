# Update with method-override

### server.js
Add update route modeled after `getOneTask` route
```javascript
app.put('/update/:task_id', updateTask);
```

And now add `updateTask` endpoint
```javascript
function updateTask(request, response) {
  // destructure variables
  let { title, description, category, contact, status } = request.body;
  // need SQL to update the specific task that we were on
  let SQL = `UPDATE tasks SET title=$1, description=$2, category=$3, contact=$4, status=$5 WHERE id=$6;`;
  // use request.params.task_id === whatever task we were on
  let values = [title, description, category, contact, status, request.params.task_id];

  client.query(SQL, values)
    .then(response.redirect(`/tasks/${request.params.task_id}`))
    .catch(err => handleError(err, response));
}
```

## detail-view.ejs
Add this form:
```html
<h2 class="view-title">Update</h2>
<form action="<%=`/update/${task.id}`%>" method="post">
  <input type="hidden" name="_method" value="put">
  <input type="text" name="title" value="<%- task.title %>" placeholder="Task Name">
  <textarea name="description" placeholder="Description of the task" cols="30" rows="10"><%- task.description %></textarea>
  <input type="text" name="category" value="<%- task.category %>" placeholder="Category">
  <input type="text" name="contact" value="<%- task.contact %>"  placeholder="Contact Person">
  <input type="text" name="status" value="<%- task.status %>" placeholder="Completion Status">
  <button type="submit">Update This Task</button>
</form>
```

WAIT A MINUTE...
Looks a lot like other form on in `add-view.ejs`!

## Refactor into form.ejs

```html
<h2 class="view-title"><%- 'update' === formAction ? "Update Task" : "Add A Task" %></h2>
<form action="<%= 'update' === formAction ? `/update/${task.id}` : '/add' %>" method="post">
  <!-- HOLY COW THIS PART IS IMPORTANT -->
  <input type="hidden" name="_method" value="<%- 'update' === formAction ? 'put' : 'post' %>">
  <input type="text" name="title" value="<%- task.title %>" placeholder="Task Name">
  <textarea name="description" placeholder="Description of the task" cols="30" rows="10"><%- task.description %></textarea>
  <input type="text" name="category" value="<%- task.category %>" placeholder="Category">
  <input type="text" name="contact" value="<%- task.contact %>"  placeholder="Contact Person">
  <input type="text" name="status" value="<%- task.status %>" placeholder="Completion Status">
  <button type="submit"><%- 'update' === formAction ? "Update This Task" : "Add This Task" %></button>
</form>
```

## detail-view.js
```html
<section class="task-form-view container">
  <%- include('form', {formAction: 'update', task: task}) %>
</section>
```

## add-view.js
```html
<%- include('form', {formAction: 'create', task: ''}) %>
```

## Hiding/Showing a form

### style.css
```css
.hide-me {
  display: none;
}
```

### detail-view.ejs
1. Add `<section>` tag  around form
2. Bring in jQuery and `/js/app.js` (will add code later)

```html
  <section class="task-form-view hide-me container">
    <%- include('form', {formAction: 'update', task: task}) %>
  </section>
<script
src="https://code.jquery.com/jquery-3.4.1.min.js"
integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
crossorigin="anonymous"></script>
<script src="/js/app.js"></script>
```

### /public/js/app.js
```javascript
$('.task-item').on('click', function(event){
  event.preventDefault();
  $('.task-view').addClass('hide-me');
  $('.task-form-view').removeClass('hide-me');
});
```