$('.task-item').on('click', function(event){
  console.log('hello');
  event.preventDefault();
  $('.task-view').addClass('hide-me');
  $('.task-form-view').removeClass('hide-me');
});
