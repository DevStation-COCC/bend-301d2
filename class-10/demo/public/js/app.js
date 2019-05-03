// Example of call stack
function bigOlCallStack(){
  let counter = 0;
  function foo(){
    console.log('starting foo...');
    console.log('ending foo...');
  }

  function bar(){
    console.log('starting bar...');
    foo();
    console.log('ending bar...');
  }

  function baz(){
    // I wonder what the counter is up to...
    console.log(counter);

    // BASE CASE
    if(counter > 10) return;
    counter++; // Update base case

    console.log('starting baz...');
    bar();
    console.log('ending baz...');

    baz(); // Call self recursively
  }

  console.log('Starting recursion...');
  baz();
  console.log('ending recursion');
}

function bigOlCallStack2(){
  let counter = 0;
  function foo(){
    return 'foo returning...';
  }
  function bar(){
    console.log(foo());
    return 'bar returning...';
  }
  function baz(){
    // I wonder what the counter is up to...
    console.log(counter);
    // BASE CASE
    if(counter > 10) return;
    counter++; // Update base case

    console.log(bar());
    console.log(baz()); // Call self recursively
    return 'baz returning ...';
  }

  console.log(baz());
}


// Example of Reference error
function referenceErrorExample(){
  // Using a try/catch will prevent the script from crashing
  // We aren't trying to *prevent* errors, we need to handle them with grace
  try{
    console.log(foo);
  }catch(e){
    console.error(e); // expected output: Reference error
  }

  try{
    const foo = {};
    console.log(foo.bar); // expected output: undefined
  }catch(e){
    console.error(e);
  }finally{
    console.log('Finished with referenceErrorExample()');
  }
}


// Example of Syntax error
function syntaxErrorExample(){
  // JSON.parse is expecting a string, not an object
  try{
    JSON.parse({'name': 'Adam'});
  }catch(e){
    console.error(e);
  }

  JSON.parse('{"name": "Adam"}'); // expected output: no error, no output
}

// Example of Range error
function rangeErrorExample(){
  try{
    77.1234.toExponential(-1);
  }catch(e){
    console.error(e);
  }
}

// Example of Type error
function typeErrorExample(){
  const foo = {};
  try{
    // foo is defined
    // bar is not defined
    // When we try to access a property on something that is undefined we get a Type error
    console.log(foo.bar.baz); // expected output: Type error
  }catch(e){
    console.error(e);
  }

  try{
    // This will at least check if foo exists, still throws error
    if(foo){
      console.log(foo.bar()); // expected output: TypeError: foo.bar is not a function
    }
  }catch(e){
    console.error(e);
  }

  // Since foo.bar will return falsy the console.log will not execute
  if(foo && foo.bar){
    console.log(foo.bar.baz); // this will never execute
  }
}


let initPage = () => {
  bigOlCallStack();
  // bigOlCallStack2();
  // referenceErrorExample();
  // syntaxErrorExample();
  // rangeErrorExample();
  // typeErrorExample();

  // Arrow function notation with keyword 'this' errors
};

document.addEventListener("DOMContentLoaded", initPage);
