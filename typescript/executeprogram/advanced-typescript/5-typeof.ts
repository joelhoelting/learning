We've applied static types to variables, to functions, to function parameters, etc. However, so far we haven't seen a way to go in the other direction. What if we want to get the type of a variable or function that we already declared?

TypeScript gives us the typeof operator for exactly that purpose. typeof someVariable gives us the type of that variable.

>

const one: number = 1;
const two: typeof one = 2;
two;

Result:

2

>

const one: number = 1;
type OurType = typeof one;
const two: OurType = 2;
two;

Result:

2

>

const one: number = 1;
type OurType = typeof one;
const aString: OurType = 'hello';
aString;

Result:

type error: Type 'string' is not assignable to type 'number'.

This typeof operator may remind you of the JavaScript's typeof, which we also use in TypeScript. For example, we use it in type guards like if (typeof s === 'string'). However, this new typeof is a completely separate operator despite having the same name. We'll come back to this issue later in the lesson. For now, try to put what you know about the JavaScript typeof on hold!

The TypeScript typeof operator works with any type, no matter how complex. Here's an example with an array:

>

const numbers = [1, 2];
type OurVariableType = typeof numbers;
const moreNumbers: OurVariableType = [3, 4, 5];
moreNumbers;

Result:

[3, 4, 5]

In JavaScript and TypeScript, functions are values. We can use typeof to get their types, just like we did for numbers and arrays above.

>

function double(n: number) {
  return n * 2;
}

// This gives us the type `(n: number) => number`.
type OurFunctionType = typeof double;
const quadruple: OurFunctionType = n => n * 4;
quadruple(5);

Result:

20

That code type checked because double and quadruple have the same type, (n: number) => number. But note that we never wrote that type out explicitly! We didn't even have to specify the type of quadruple's argument, n, because OurFunctionType tells TypeScript that it must be a number.

Types from typeof are enforced like any other type. For example, OurFunctionType wants one number parameter. If we try to use that type for a function that takes two parameters, that's a type error.

>

function double(n: number) {
  return n * 2;
}

type OurFunctionType = typeof double;
const add: OurFunctionType = (x: number, y: number) => x + y;
add(1, 2);

Result:

type error: Type '(x: number, y: number) => number' is not assignable to type '(n: number) => number'.

An earlier lesson showed the ReturnType and Parameters generic types, using them on function types that we defined explicitly. But we had no way to define a function and then use ReturnType or Parameters on it. Now we can use typeof to do that! First we get the function's type with typeof, then we extract its return type or parameter types.

>

function double(n: number) {
  return n * 2;
}

type OurReturnType = ReturnType<typeof double>;
const n: OurReturnType = 55;
n;

Result:

55

We can use typeof together with ReturnType and Parameters to "disassemble" existing functions into their component types. Then we can build new functions out of those types.

>

function double(n: number) {
  return n * 2;
}

type OurReturnType = ReturnType<typeof double>;
const add = (x: number, y: number): OurReturnType => x + y;
add(2, 3);

Result:

5

>

function double(n: number) {
  return n * 2;
}

type OurReturnType = ReturnType<typeof double>;
const add = (x: number, y: number): OurReturnType => (x + y).toString();
add(2, 3);

Result:

type error: Type 'string' is not assignable to type 'number'.

Sometimes typeof gives surprising results. For example, earlier in this lesson we defined const one: number = 1. As we might expect, typeof one was number. But what if we define const one = 1, letting TypeScript infer the type? In that case, TypeScript infers the literal type 1, so typeof one is 1, not number!

>

const one = 1;
const two: typeof one = 2;
two;

Result:

type error: Type '2' is not assignable to type '1'.

Fortunately there's an easy workaround when this happens: add an explicit type annotation.

>

const one: number = 1;
const two: typeof one = 2;
two;

Result:

2

Here's a code problem:

In the code below, we define a double function and a quadruple function. Currently, the quadruple function's type definition is missing.

Add a type definition, but not by writing it out! Use typeof to give quadruple the same type as double. (You won't need to change any other part of the function.)

function double(n: number): number {

  return n * 2;

}

const quadruple: typeof double = (n) => n * 4;

[quadruple(3), quadruple(7)];

Goal:

    [12, 28]

Yours:

    [12, 28]

Show Author's Answer

The typeof operator illustrates an important concept in TypeScript, and in statically typed languages generally. There are two worlds in TypeScript: the value world and the type world. Values work like they do in JavaScript. If 1 + 1 === 2 in JavaScript, then 1 + 1 === 2 in TypeScript, and likewise for any other expression we can imagine.

The type world is specific to TypeScript, and is strictly separated from the world of values. That's why we can't say type SomeType = someVariable, and we can't say const someVariable = SomeType. These statements don't make sense because value expressions and type expressions are two separate sub-languages within TypeScript.

When we write const n: number, we're integrating types and values. That code says "at runtime we'll have a value n, and we expect its runtime value to match the compile-time type number". Until this lesson, we only went in that direction: we had types, and we used const, function, etc. to declare values with those types.

As of this lesson, we can now go in the other direction too. We have a variable holding a value like a number or a function, and we use typeof to move from the value world to the type world. When we do typeof someFunction, we're asking TypeScript what static type someFunction already has.

As we mentioned in the beginning of the lesson, there are two separate operators named typeof. The fact that they have the same name can be confusing at first. Crucially, one typeof operator only works in the value world, and the other in the type world.

We've already seen many similar situations; TypeScript is full of them! For example, what does {name: string} mean? Is it an object with a name property whose value comes from a variable named string?

>

const string = 'Amir';
const amir = {name: string};
amir;

Result:

{name: 'Amir'}

Or is {name: string} a TypeScript type where the name property has the type string?

>

type User = {name: string};
const amir: User = {name: 'Amir'};
amir;

Result:

{name: 'Amir'}

The expression is identical in both cases: {name: string}. In a value context, that's a literal object value that references a variable. In a type context, it's a type describing the shape of objects.

Like the {name: string} object syntax, the two typeof operators do different things despite having the same name. The new TypeScript typeof operator introduced in this lesson only works inside of TypeScript types, letting us access the type of an existing identifier like a variable. The old JavaScript operator returns a string, like typeof 1 === 'number'. TypeScript extends that JavaScript operator to also do type narrowing, like if (typeof x === 'number'), but even in TypeScript it only works on values.

>

function doubleIfNumber(n: number | string): number | string {
  if (typeof n === 'number') {
    return n * 2;
  } else {
    return n;
  }
}

[
  doubleIfNumber(5),
  doubleIfNumber('a'),
];

Result:

[10, 'a']

This is another example of how TypeScript is actually two languages: it's JavaScript, plus a separate type language layered on top. With some practice, you'll use both typeof operators without having to think about it.
