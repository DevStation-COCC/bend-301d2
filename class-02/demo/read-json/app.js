'use strict';

function Dog(dog) {
  this.name = dog.name;
  this.image_url = dog.image_url;
  this.hobbies = dog.hobbies;
}

Dog.allDogs = [];

Dog.prototype.render = function() {
  // Render a single instance of Dog to DOM

  // 1. Create the element
  let dogClone = $('#dog-template').clone();
  let $dogClone = $(dogClone[0].content);

  // 2. Give the element content
  $dogClone.find('h2').text(this.name);
  $dogClone.find('img').attr('src', this.image_url);
  $dogClone.find('p').text(this.hobbies);

  // 3. Append element to parent
  $dogClone.appendTo('main');
};

Dog.readJson = () => {
  $.get('./data.json')
    .then(data => {
      data.forEach(item => {
        Dog.allDogs.push(new Dog(item));
      });
    })
    .then(Dog.loadDogs);
};

Dog.loadDogs = () => {
  // Loop over each dog in Dog.allDogs and render
  Dog.allDogs.forEach(dog => dog.render());
};

$(() => Dog.readJson());
