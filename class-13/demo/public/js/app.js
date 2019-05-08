$('.task-item').on('click', function(event){
  event.preventDefault();
  $('.task-view').addClass('hide-me');
  $('.task-form-view').removeClass('hide-me');
});
