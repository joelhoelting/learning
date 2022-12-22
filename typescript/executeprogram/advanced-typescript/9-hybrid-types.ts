JavaScript (and therefore TypeScript) functions can have properties, just like objects do.

>

function double(n: number): number {
  return n * 2;
}

double.isDoubleFunction = true;
[double(3), double.isDoubleFunction];

Result:

[6, true]

How do we write the type for that double function? We can't do it with a function type, because the function type syntax provides no way to declare the isDoubleFunction property. Instead, we have to use an interface type.

Any interface type can describe a function that also has some properties. The syntax looks just like the syntax that we use when defining a function's signature, including the return value. For example, (n: number): number. We put that signature right inside the interface.

>

interface Path {
  (suffix: string): string
  prefix: string
}

function coursePath(suffix: string) {
  return `/${coursePath.prefix}/${suffix}`;
}
coursePath.prefix = 'courses';

const coursePath2: Path = coursePath;
[coursePath2.prefix, coursePath2('typescript')];

Result:

['courses', '/courses/typescript']

That doesn't look very useful in isolation. We had to create a second variable just to use the Path type. However, all of this makes a lot more sense when the function is returned by another function.

In the next example, we define a buildPath function. It takes a prefix (like 'courses') and returns a function that builds paths with that prefix (like '/courses/typescript'). The buildPath function also stores its prefix in a prefix property, so that other parts of the system can access it.

>

type Path = {
  (suffix: string): string
  prefix: string
};

function buildPath(prefix: string): Path {
  function path(suffix: string) {
    return `/${prefix}/${suffix}`;
  }
  path.prefix = prefix;
  
  return path;
}

>

const path: Path = buildPath('courses');
[path.prefix, path('regexes')];

Result:

['courses', '/courses/regexes']

>

const path: Path = buildPath('users');
[path.prefix, path('amir')];

Result:

['users', '/users/amir']

Types like Path are hybrids between objects and functions: they act like both at the same time. Accordingly, TypeScript calls these "hybrid types".

So far we've shown hybrid types with interfaces, but they also work with object types. The syntax in that case is exactly the same: a signature like (suffix: string): string right inside of the object type definition.

Finally, you might wonder why we chose paths for our code examples in this lesson. It's because Execute Program's own source code has a hybrid Path type!
