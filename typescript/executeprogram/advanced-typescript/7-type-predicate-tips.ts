In an earlier lesson we saw type predicates, which are custom functions that work as type guards. We can use them to narrow union types like A | B to just A or B. Here's isNumber, a type predicate function:

>

function isNumber(maybeNumber: number | undefined): maybeNumber is number {
  return typeof maybeNumber === 'number';
}

Result:

undefined

We can use this function to narrow types from number | undefined to just number:

>

function numberOrUndefined(): number | undefined {
  return 1;
}
const n: number | undefined = numberOrUndefined();

let n2: number;
if (isNumber(n)) {
  n2 = n;
} else {
  n2 = 0;
}
n2;

Result:

1

There are two important things to know about type predicates in practice.

First, TypeScript blindly trusts us to implement type predicate functions correctly. This is different from most TypeScript code, where the compiler checks that every variable and argument matches exactly. If our type predicate function's body is wrong, then the types will also be wrong. They'll still be fully enforced, but the compiler will be enforcing the wrong types!

In the example above, we correctly identify number types with typeof maybeNumber === 'number'. But what if we make a mistake? To find out, the next example is intentionally wrong in a way that the type system can't see.

>

/* This function has a bug! TypeScript can't tell us when our type
 * predicate's body is wrong. */
function isNumber(n: number | string): n is number {
  return typeof n === 'string';
}
const n: string = 'oh no';
const n2: number = isNumber(n) ? n : 0;
n2;

Result:

'oh no'

We named our function isNumber, so it should return true when given a number. But we made a mistake: our function returns true when given strings. TypeScript doesn't know our intention; it only knows that if isNumber returns true, it should treat the argument n as a number. The result is that TypeScript lets us put a string inside a number variable.

Here's a code problem:

This isString function is a type predicate, but the function's body is incorrect. Fix the function so that it correctly identifies strings.

function isString(s: string | undefined): s is string {

  return typeof s === 'string';

}

const s1: undefined = undefined;

const s2: string = isString(s1) ? s1 : 'not a string';

s2;

Goal:

    'not a string'

Yours:

    'not a string'

Show Author's Answer

Our advice is to heavily test your type predicates with an automated test suite. That will increase your confidence in the predicates, which will allow you to trust the type system as a whole.

The second thing to know is that type predicates are a great place to use unknown. In the example above, we narrowed from string | undefined to string. But why should a function called isString only take string | undefined? What about other types that aren't strings, like boolean or Array<{name: string}>?

This is a perfect use case for unknown: our function doesn't need to know what type its argument s has. All it needs to do is check typeof s. Let's rewrite isString to take an unknown argument.

>

function isString(s: unknown): s is string {
  return typeof s === 'string';
}

>

isString(1);

Result:

false

>

isString('Amir');

Result:

true

>

const s: unknown = 'a string';
const s2: string = isString(s) ? s : 'not a string';
s2;

Result:

'a string'

>

const s: unknown = {name: 'Betty'};
const s2: string = isString(s) ? s : 'not a string';
s2;

Result:

'not a string'

Why don't we use any here instead of unknown? It's because unknown stops us from making incorrect assumptions about the argument's value. For example, with function isString(s: any), TypeScript will let us access properties like s.thisPropertyDoesNotExist. With function isString(s: unknown), TypeScript won't let us assume anything about s, which is more safe.

To recap, keep these two points in mind to prevent bugs when using type predicates:

    TypeScript trusts us to implement type predicates correctly. Test your predicate functions well to make sure that they do what you think they do.
    Type predicates can take unions as their arguments, or they can take unknown. In most cases, unknown is the safest and most flexible option.

